import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashCanonicalPayload } from '../blockchain/hash.util';
import { hashContractorIdentity } from '../blockchain/contractor-hash.util';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicService: PublicService,
  ) {}

  /* =========================================================
     AUDIT VERIFICATION (PUBLIC)
     ========================================================= */
  @Get('verify/audit/:id')
  async verifyAudit(@Param('id') id: string) {
    const audit = await this.prisma.auditLog.findUnique({
      where: { id },
    });

    if (!audit || !audit.auditHash || !audit.txHash) {
      return { verified: false };
    }

    const payload = {
      auditId: audit.id,
      tenderId: audit.tenderId,
      action: audit.action,
      userId: audit.userId,
      timestamp: audit.timestamp.toISOString(),
    };

    const recomputedHash = hashCanonicalPayload(payload);

    return {
      verified: recomputedHash === audit.auditHash,
      auditHash: audit.auditHash,
      recomputedHash,
      txHash: audit.txHash,
      network: 'sepolia',
      contract: process.env.FAIRLENS_VERIFIER_ADDRESS,
    };
  }

  /* =========================================================
     CONTRACTOR VERIFICATION (PUBLIC)
     ========================================================= */
  @Get('verify/contractor/:id')
  async verifyContractor(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (
      !user ||
      !user.contractorHash ||
      !user.walletAddress ||
      !user.verifiedBy ||
      !user.verifiedAt
    ) {
      return { verified: false };
    }

    const payload = {
      contractorId: user.id,
      name: user.name,
      walletAddress: user.walletAddress.toLowerCase(),
      verifiedBy: user.verifiedBy,
      verifiedAt: user.verifiedAt.toISOString(),
    };

    const recomputedHash = hashContractorIdentity(payload);

    return {
      verified: recomputedHash === user.contractorHash,
      name: user.name,
      wallet: user.walletAddress,
      contractorHash: user.contractorHash,
      network: 'sepolia',
      contract: process.env.FAIRLENS_VERIFIER_ADDRESS,
    };
  }

  /* =========================================================
     MILESTONE PAYMENT VERIFICATION (PUBLIC)
     ========================================================= */
  @Get('verify/milestone/:id')
  verifyMilestone(@Param('id') id: string) {
    return this.publicService.verifyMilestonePayment(id);
  }

  /* =========================================================
     CONTRACTOR PORTFOLIO (PUBLIC PROFILE)
     ========================================================= */
  @Get('portfolio/contractor/:id')
  async contractorPortfolio(@Param('id') id: string) {
    const contractor = await this.prisma.user.findUnique({
      where: { id },
    });

    if (
      !contractor ||
      contractor.role !== 'CONTRACTOR' ||
      !contractor.contractorHash
    ) {
      return { verified: false };
    }

    const tenders = await this.prisma.tender.findMany({
      where: { winningContractorId: contractor.id },
      include: { milestones: true },
    });

    let totalMilestones = 0;
    let completedMilestones = 0;
    let totalPaid = 0;

    tenders.forEach((t) =>
      t.milestones.forEach((m) => {
        totalMilestones++;
        if (m.paidAt) {
          completedMilestones++;
          totalPaid += m.amount - (m.penaltyAmount ?? 0);
        }
      }),
    );

    return {
      verified: true,
      contractor: {
        id: contractor.id,
        name: contractor.name,
        wallet: contractor.walletAddress,
        verifiedAt: contractor.verifiedAt,
      },
      stats: {
        tendersAwarded: tenders.length,
        totalMilestones,
        completedMilestones,
        totalPaidEth: totalPaid,
      },
      history: tenders.map((t) => ({
        tenderId: t.id,
        title: t.title,
        milestones: t.milestones.map((m) => ({
          description: m.description,
          amount: m.amount,
          penalty: m.penaltyAmount ?? 0,
          paid: !!m.paidAt,
          txHash: m.paymentTxHash,
        })),
      })),
    };
  }

  /* =========================================================
     TENDER TIMELINE (PUBLIC AUDIT TRAIL)
     ========================================================= */
  @Get('timeline/tender/:id')
  async tenderTimeline(@Param('id') id: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id },
    });

    if (!tender) {
      return { found: false };
    }

    const audits = await this.prisma.auditLog.findMany({
      where: { tenderId: id },
      orderBy: { timestamp: 'asc' },
    });

    const milestones = await this.prisma.milestone.findMany({
      where: { tenderId: id },
    });

    const events: any[] = [];

    audits.forEach((a) => {
      events.push({
        type: a.action,
        timestamp: a.timestamp,
        actorId: a.userId,
        description: a.action.replace(/_/g, ' ').toLowerCase(),
        proof: a.txHash
          ? { txHash: a.txHash, network: 'sepolia' }
          : undefined,
      });
    });

    milestones.forEach((m) => {
      if (m.paidAt) {
        events.push({
          type: 'MILESTONE_PAID',
          timestamp: m.paidAt,
          description: `Milestone "${m.description}" paid`,
          proof: {
            txHash: m.paymentTxHash,
            network: 'sepolia',
          },
        });
      }

      if (m.actOfGod) {
        events.push({
          type: 'ACT_OF_GOD_DECLARED',
          timestamp: m.updatedAt,
          description: `Act of God declared: ${m.actOfGodReason}`,
        });
      }
    });

    events.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime(),
    );

    return {
      tender: {
        id: tender.id,
        title: tender.title,
        status: tender.status,
      },
      timeline: events,
    };
  }

  /* =========================================================
   PUBLIC → LIST TENDERS
   ========================================================= */
@Get('tenders')
getPublicTenders() {
  return this.publicService.getPublicTenders();
}

/* =========================================================
   PUBLIC → TENDER DETAILS
   ========================================================= */
@Get('tenders/:id')
getPublicTender(@Param('id') id: string) {
  return this.publicService.getPublicTenderById(id);
}

/* =========================================================
   PUBLIC → TENDER MILESTONES
   ========================================================= */
@Get('tenders/:id/milestones')
getPublicMilestones(@Param('id') id: string) {
  return this.publicService.getPublicMilestones(id);
}

}
