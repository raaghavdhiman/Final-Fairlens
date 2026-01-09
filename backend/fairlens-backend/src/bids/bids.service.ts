import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { Role } from '@prisma/client';
import { hashContractorIdentity } from '../blockchain/contractor-hash.util';

@Injectable()
export class BidsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createBid(dto: CreateBidDto, contractorId: string) {
    /* =========================================================
       1️⃣ LOAD CONTRACTOR
       ========================================================= */
    const contractor = await this.prisma.user.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new BadRequestException('User not found');
    }

    if (contractor.role !== Role.CONTRACTOR) {
      throw new ForbiddenException('Only contractors can bid');
    }

    /* =========================================================
       2️⃣ BLOCKCHAIN VERIFICATION (CANONICAL + STORED)
       ========================================================= */
    if (
      !contractor.contractorHash ||
      !contractor.walletAddress ||
      !contractor.verifiedBy ||
      !contractor.verifiedAt
    ) {
      throw new ForbiddenException('Contractor is not blockchain-verified');
    }

    const verificationPayload = {
      contractorId: contractor.id,
      name: contractor.name,
      walletAddress: contractor.walletAddress.toLowerCase(),
      verifiedBy: contractor.verifiedBy,
      verifiedAt: contractor.verifiedAt.toISOString(),
    };

    const recomputedHash = hashContractorIdentity(verificationPayload);

    if (recomputedHash !== contractor.contractorHash) {
      throw new ForbiddenException('Contractor verification mismatch');
    }

    /* =========================================================
       3️⃣ LOAD & VALIDATE TENDER
       ========================================================= */
    const tender = await this.prisma.tender.findUnique({
      where: { id: dto.tenderId },
    });

    if (!tender) {
      throw new BadRequestException('Tender not found');
    }

    if (tender.status !== 'OPEN') {
      throw new BadRequestException('Bidding is closed for this tender');
    }

    /* =========================================================
       4️⃣ PREVENT DUPLICATE BIDS
       ========================================================= */
    const existingBid = await this.prisma.bid.findFirst({
      where: {
        tenderId: dto.tenderId,
        contractorId,
      },
    });

    if (existingBid) {
      throw new BadRequestException('You have already bid on this tender');
    }

    /* =========================================================
       5️⃣ CREATE BID
       ========================================================= */
    const bid = await this.prisma.bid.create({
      data: {
        tenderId: dto.tenderId,
        contractorId,
        amount: dto.amount,
        proposal: dto.proposal,
      },
    });

    /* =========================================================
       6️⃣ AUDIT LOG
       ========================================================= */
    await this.auditService.log({
      userId: contractorId,
      tenderId: tender.id,
      action: 'BID_SUBMITTED',
      details: `Bid of ${dto.amount} submitted`,
    });

    return bid;
  }

  async getMyBids(contractorId: string) {
  const bids = await this.prisma.bid.findMany({
    where: { contractorId },
    orderBy: { submittedAt: 'desc' },
    include: {
      tender: {
        select: {
          id: true,
          title: true,
          status: true,
          budget: true,
        },
      },
    },
  });

  // Deduplicate by tenderId (keep latest)
  const map = new Map<string, any>();

  for (const bid of bids) {
    if (!map.has(bid.tenderId)) {
      map.set(bid.tenderId, bid);
    }
  }

  return Array.from(map.values());
}


async getBidsForTender(tenderId: string, governmentId: string) {
  const tender = await this.prisma.tender.findUnique({
    where: { id: tenderId },
  });

  if (!tender) {
    throw new BadRequestException('Tender not found');
  }

  if (tender.createdById !== governmentId) {
    throw new BadRequestException('Not authorized');
  }

  return this.prisma.bid.findMany({
    where: { tenderId },
    orderBy: { submittedAt: 'asc' },
    include: {
      contractor: {
        select: {
          id: true,
          name: true,
          walletAddress: true,
        },
      },
    },
  });
}

async getBidsForMyTenders(governmentId: string) {
  return this.prisma.tender.findMany({
    where: {
      createdById: governmentId,
    },
    select: {
      id: true,
      title: true,
      status: true,
      bids: {
        orderBy: { submittedAt: 'asc' },
        include: {
          contractor: {
            select: {
              id: true,
              name: true,
              walletAddress: true,
            },
          },
        },
      },
    },
  });
}

async getAllBidsForGovernment(governmentId: string) {
  return this.prisma.bid.findMany({
    where: {
      tender: {
        createdById: governmentId,
      },
    },
    orderBy: { submittedAt: "desc" },
    include: {
      tender: {
        select: {
          id: true,
          title: true,
        },
      },
      contractor: {
        select: {
          name: true,
          walletAddress: true,
        },
      },
    },
  });
}


}
