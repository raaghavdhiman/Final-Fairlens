import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MilestoneStatus } from '@prisma/client';
import { BlockchainService } from '../blockchain/blockchain.service';
import { keccak256, toUtf8Bytes, parseEther } from 'ethers';

const MAX_PENALTY_RATE = 10; // %

@Injectable()
export class MilestonesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly blockchainService: BlockchainService,
  ) {}

  /* =========================================================
     GOVERNMENT → ADD MILESTONE
     ========================================================= */
  async addMilestone(
    tenderId: string,
    description: string,
    amount: number,
    dueDate: Date,
    penaltyRate: number,
    governmentId: string,
  ) {
    const tender = await this.prisma.tender.findUnique({
      where: { id: tenderId },
    });

    if (!tender) throw new BadRequestException('Tender not found');
    if (tender.createdById !== governmentId)
      throw new ForbiddenException('Not authorized');

    if (!dueDate || isNaN(dueDate.getTime()))
      throw new BadRequestException('Invalid due date');

    if (dueDate <= new Date())
      throw new BadRequestException('Due date must be in the future');

    if (amount <= 0)
      throw new BadRequestException('Amount must be positive');

    if (penaltyRate < 0 || penaltyRate > MAX_PENALTY_RATE)
      throw new BadRequestException(
        `Penalty rate must be between 0 and ${MAX_PENALTY_RATE}%`,
      );

    const milestone = await this.prisma.milestone.create({
      data: {
        tenderId,
        description,
        amount,
        dueDate,
        penaltyRate,
        status: MilestoneStatus.PENDING,
        delayDays: 0,
        penaltyAmount: 0,
        actOfGod: false,
      },
    });

    await this.auditService.log({
      userId: governmentId,
      tenderId,
      action: 'MILESTONE_CREATED',
      details: `Milestone "${description}" created | Due ${dueDate.toISOString()} | Penalty ${penaltyRate}%/day`,
    });

    return milestone;
  }

  /* =========================================================
     CONTRACTOR → START WORK
     ========================================================= */
  async startWork(milestoneId: string, contractorId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { tender: true },
    });

    if (!milestone) throw new BadRequestException('Milestone not found');
    if (milestone.status !== MilestoneStatus.PENDING)
      throw new BadRequestException('Cannot start milestone');

    if (milestone.tender.winningContractorId !== contractorId)
      throw new ForbiddenException('Not assigned contractor');

    const updated = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: MilestoneStatus.IN_PROGRESS },
    });

    await this.auditService.log({
      userId: contractorId,
      tenderId: milestone.tenderId,
      action: 'MILESTONE_STARTED',
      details: `Milestone "${milestone.description}" started`,
    });

    return updated;
  }

  /* =========================================================
     CONTRACTOR → SUBMIT WORK
     ========================================================= */
  async submitWork(milestoneId: string, contractorId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { tender: true },
    });

    if (!milestone) throw new BadRequestException('Milestone not found');
    if (milestone.status !== MilestoneStatus.IN_PROGRESS)
      throw new BadRequestException('Milestone not in progress');

    if (milestone.tender.winningContractorId !== contractorId)
      throw new ForbiddenException('Not assigned contractor');

    const updated = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: MilestoneStatus.COMPLETED,
        submittedAt: new Date(),
      },
    });

    await this.auditService.log({
      userId: contractorId,
      tenderId: milestone.tenderId,
      action: 'MILESTONE_SUBMITTED',
      details: `Milestone "${milestone.description}" submitted`,
    });

    return updated;
  }

  /* =========================================================
     GOVERNMENT → VERIFY WORK (LOCKED)
     ========================================================= */
  async verifyWork(milestoneId: string, governmentId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { tender: true },
    });

    if (!milestone) throw new BadRequestException('Milestone not found');
    if (milestone.status !== MilestoneStatus.COMPLETED)
      throw new BadRequestException('Work not submitted');

    if (milestone.verifiedAt)
      throw new BadRequestException('Milestone already verified');

    if (milestone.paidAt)
      throw new BadRequestException('Milestone already paid');

    if (milestone.tender.createdById !== governmentId)
      throw new ForbiddenException('Not authorized');

    let delayDays = 0;
    let penaltyAmount = 0;

    if (
      milestone.submittedAt &&
      milestone.dueDate &&
      milestone.submittedAt > milestone.dueDate &&
      !milestone.actOfGod
    ) {
      const diffMs =
        milestone.submittedAt.getTime() -
        milestone.dueDate.getTime();

      delayDays = Math.max(
        0,
        Math.ceil(diffMs / (1000 * 60 * 60 * 24)),
      );

      const rate = milestone.penaltyRate ?? 0;
      penaltyAmount =
        milestone.amount * (rate / 100) * delayDays;
    }

    const updated = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        verifiedAt: new Date(),
        delayDays,
        penaltyAmount,
      },
    });

    await this.auditService.log({
      userId: governmentId,
      tenderId: milestone.tenderId,
      action: 'MILESTONE_VERIFIED',
      details: `Verified | delay=${delayDays} days | penalty=${penaltyAmount} ETH`,
    });

    return updated;
  }

  /* =========================================================
     GOVERNMENT → RELEASE PAYMENT (ATOMIC)
     ========================================================= */
  async releasePayment(milestoneId: string, governmentId: string) {
  /* =======================
     PHASE 1 — DB VALIDATION
     ======================= */

  const milestone = await this.prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: {
      tender: { include: { winningContractor: true } },
    },
  });

  if (!milestone) throw new BadRequestException('Milestone not found');
  if (!milestone.verifiedAt)
    throw new BadRequestException('Milestone not verified');
  if (milestone.paidAt)
    throw new BadRequestException('Already paid');

  if (milestone.tender.createdById !== governmentId)
    throw new ForbiddenException('Not authorized');

  const contractor = milestone.tender.winningContractor;
  if (!contractor?.walletAddress)
    throw new BadRequestException('Contractor wallet missing');

  const finalAmount = Math.max(
    milestone.amount - (milestone.penaltyAmount ?? 0),
    0,
  );

  if (finalAmount <= 0)
    throw new BadRequestException(
      'Penalty exceeds milestone amount',
    );

  /* =======================
     PHASE 2 — BLOCKCHAIN
     ======================= */

  const milestoneHash = keccak256(
    toUtf8Bytes(
      JSON.stringify({
        milestoneId: milestone.id,
        tenderId: milestone.tenderId,
        amount: milestone.amount,
      }),
    ),
  );

  const amountWei = parseEther(finalAmount.toString());

  const txHash =
    await this.blockchainService.releaseMilestonePayment({
      milestoneHash,
      contractorWallet: contractor.walletAddress,
      amountWei,
    });

  /* =======================
     PHASE 3 — DB UPDATE
     ======================= */

  const updated = await this.prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      paidAt: new Date(),
      paymentTxHash: txHash,
    },
  });

  await this.auditService.log({
    userId: governmentId,
    tenderId: milestone.tenderId,
    action: 'MILESTONE_PAID',
    details: `Paid ${finalAmount} ETH | tx=${txHash}`,
  });

  return {
    txHash,
    milestone: updated,
  };
}


  /* =========================================================
     GOVERNMENT → DECLARE ACT OF GOD (STRICTLY LOCKED)
     ========================================================= */
  async markActOfGod(
    milestoneId: string,
    reason: string,
    governmentId: string,
  ) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { tender: true },
    });

    if (!milestone) throw new BadRequestException('Milestone not found');

    if (milestone.paidAt)
      throw new BadRequestException(
        'Cannot declare Act of God after payment',
      );

    if (milestone.actOfGod)
      throw new BadRequestException('Act of God already declared');

    if (milestone.tender.createdById !== governmentId)
      throw new ForbiddenException('Not authorized');

    if (!reason || reason.trim().length < 5)
      throw new BadRequestException('Reason required');

    const updated = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        actOfGod: true,
        actOfGodReason: reason,
        delayDays: 0,
        penaltyAmount: 0,
      },
    });

    await this.auditService.log({
      userId: governmentId,
      tenderId: milestone.tenderId,
      action: 'ACT_OF_GOD_DECLARED',
      details: `Reason: ${reason}`,
    });

    return updated;
  }

  async getMilestonesByTender(tenderId: string, governmentId: string) {
  const tender = await this.prisma.tender.findUnique({
    where: { id: tenderId },
  });

  if (!tender) {
    throw new BadRequestException('Tender not found');
  }

  if (tender.createdById !== governmentId) {
    throw new BadRequestException('Not authorized');
  }

  return this.prisma.milestone.findMany({
    where: { tenderId },
    orderBy: { createdAt: 'asc' },
  });
}
async getMyMilestones(contractorId: string) {
  return this.prisma.milestone.findMany({
    where: {
      tender: {
        winningContractorId: contractorId,
      },
    },
    include: {
      tender: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      dueDate: 'asc',
    },
  });
}

}
