import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JsonRpcProvider, keccak256, toUtf8Bytes } from 'ethers';

@Injectable()
export class PublicService {
  private readonly provider: JsonRpcProvider;
  private readonly contractAddress: string;

  constructor(private readonly prisma: PrismaService) {
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const contract = process.env.FAIRLENS_VERIFIER_ADDRESS;

    if (!rpcUrl || !contract) {
      throw new Error('Missing blockchain environment variables');
    }

    this.provider = new JsonRpcProvider(rpcUrl);
    this.contractAddress = contract;
  }

  /* =========================================================
     PUBLIC → LIST TENDERS (READ-ONLY)
     ========================================================= */
  async getPublicTenders() {
    return this.prisma.tender.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        status: true,
        createdAt: true,
        department: true,
        location: true,
        expectedTimeline: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /* =========================================================
     PUBLIC → TENDER DETAILS (READ-ONLY)
     ========================================================= */
  async getPublicTenderById(tenderId: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id: tenderId },
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        status: true,
        createdAt: true,
        department: true,
        location: true,
        expectedTimeline: true,
        _count: {
         select: {
         bids: true,
                 },
                },
        winningContractor: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            contractorHash: true,
            
          },
        },
      },
    });

    if (!tender) {
      throw new BadRequestException('Tender not found');
    }

    return tender;
  }

  /* =========================================================
     PUBLIC → LIST MILESTONES FOR A TENDER (READ-ONLY)
     ========================================================= */
  async getPublicMilestones(tenderId: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id: tenderId },
    });

    if (!tender) {
      throw new BadRequestException('Tender not found');
    }

    return this.prisma.milestone.findMany({
      where: { tenderId },
      select: {
        id: true,
        description: true,
        amount: true,
        dueDate: true,
        submittedAt: true,
        verifiedAt: true,
        delayDays: true,
        penaltyRate: true,
        penaltyAmount: true,
        actOfGod: true,
        actOfGodReason: true,
        paidAt: true,
        paymentTxHash: true,
        status: true,

      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /* =========================================================
     PUBLIC → VERIFY MILESTONE PAYMENT (ON-CHAIN PROOF)
     ========================================================= */
  async verifyMilestonePayment(milestoneId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        tender: {
          include: {
            winningContractor: true,
          },
        },
      },
    });

    if (!milestone) {
      throw new BadRequestException('Milestone not found');
    }

    if (!milestone.paymentTxHash) {
      throw new BadRequestException('Milestone not paid on-chain');
    }

    /* =========================================================
       1️⃣ Recompute canonical milestone hash (OFF-CHAIN)
       ========================================================= */
    const recomputedHash = keccak256(
      toUtf8Bytes(
        JSON.stringify({
          milestoneId: milestone.id,
          tenderId: milestone.tenderId,
          amount: milestone.amount,
        }),
      ),
    );

    /* =========================================================
       2️⃣ Fetch transaction receipt from Sepolia
       ========================================================= */
    const receipt = await this.provider.getTransactionReceipt(
      milestone.paymentTxHash,
    );

    if (!receipt) {
      return {
        verified: false,
        reason: 'Transaction not found on-chain',
      };
    }

    /* =========================================================
       3️⃣ Locate MilestonePaid event
       ========================================================= */
    const eventSignature = keccak256(
      toUtf8Bytes('MilestonePaid(bytes32,address,uint256,uint256)'),
    );

    const log = receipt.logs.find(
      (l) =>
        l.address.toLowerCase() ===
          this.contractAddress.toLowerCase() &&
        l.topics[0] === eventSignature,
    );

    if (!log) {
      return {
        verified: false,
        reason: 'MilestonePaid event not found in transaction',
      };
    }

    /* =========================================================
       4️⃣ Compare emitted hash with recomputed hash
       ========================================================= */
    const emittedHash = log.topics[1];
    const verified = emittedHash === recomputedHash;

    /* =========================================================
       5️⃣ PUBLIC TRANSPARENCY PAYLOAD
       ========================================================= */
    return {
      verified,

      milestone: {
        id: milestone.id,
        description: milestone.description,
        amount: milestone.amount,
        dueDate: milestone.dueDate,
        submittedAt: milestone.submittedAt,
        verifiedAt: milestone.verifiedAt,
        delayDays: milestone.delayDays,
        penaltyRate: milestone.penaltyRate,
        penaltyAmount: milestone.penaltyAmount,
        actOfGod: milestone.actOfGod,
        actOfGodReason: milestone.actOfGodReason,
      },

      payment: {
        paidEth: milestone.amount - (milestone.penaltyAmount ?? 0),
        txHash: milestone.paymentTxHash,
        contractor:
          milestone.tender.winningContractor?.walletAddress,
        network: 'sepolia',
        contract: this.contractAddress,
      },

      cryptographicProof: {
        emittedHash,
        recomputedHash,
      },
    };
  }
}
