import { Injectable, BadRequestException,ForbiddenException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenderDto } from './dto/create-tender.dto';
import { AuditService } from '../audit/audit.service';
import { TenderStatus } from '@prisma/client';

@Injectable()
export class TendersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /* =========================================================
     READ
     ========================================================= */

  findAll() {
    return this.prisma.tender.findMany();
  }

  findById(id: string) {
    return this.prisma.tender.findUnique({
      where: { id },
    });
  }

  /* =========================================================
     CREATE
     ========================================================= */

  async createTender(dto: CreateTenderDto, userId: string) {
    const tender = await this.prisma.tender.create({
      data: {
        title: dto.title,
        description: dto.description,
        budget: dto.budget,
        createdById: userId,
        status: TenderStatus.DRAFT,
      },
    });

    await this.auditService.log({
      userId,
      tenderId: tender.id,
      action: 'TENDER_CREATED',
      details: `Tender "${tender.title}" created`,
    });

    return tender;
  }

  /* =========================================================
     OPEN
     ========================================================= */

  async openTender(tenderId: string, userId: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id: tenderId },
    });

    if (!tender) throw new BadRequestException('Tender not found');
    if (tender.createdById !== userId)
      throw new BadRequestException('Not allowed');

    if (tender.status !== TenderStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT tenders can be opened');
    }

    const updated = await this.prisma.tender.update({
      where: { id: tenderId },
      data: { status: TenderStatus.OPEN },
    });

    await this.auditService.log({
      userId,
      tenderId,
      action: 'TENDER_OPENED',
      details: `Tender opened`,
    });

    return updated;
  }

  async getMyTenders(governmentId: string) {
  return this.prisma.tender.findMany({
    where: {
      createdById: governmentId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          bids: true,
          milestones: true,
        },
      },
    },
  });
}


  /* =========================================================
     CLOSE
     ========================================================= */

  async closeTender(tenderId: string, userId: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id: tenderId },
    });

    if (!tender) throw new BadRequestException('Tender not found');
    if (tender.createdById !== userId)
      throw new BadRequestException('Not allowed');

    if (tender.status !== TenderStatus.OPEN) {
      throw new BadRequestException('Only OPEN tenders can be closed');
    }

    const updated = await this.prisma.tender.update({
      where: { id: tenderId },
      data: { status: TenderStatus.CLOSED },
    });

    await this.auditService.log({
      userId,
      tenderId,
      action: 'TENDER_CLOSED',
      details: `Tender closed`,
    });

    return updated;
  }

  /* =========================================================
     🏆 AWARD (WORK STARTS HERE)
     ========================================================= */

  async awardBid(
  tenderId: string,
  bidId: string,
  governmentId: string,
) {
  // 1️⃣ Transaction: DB ONLY
  const updatedTender = await this.prisma.$transaction(async (tx) => {
    const tender = await tx.tender.findUnique({
      where: { id: tenderId },
    });

    if (!tender) throw new BadRequestException('Tender not found');
    if (tender.createdById !== governmentId)
      throw new ForbiddenException('Not authorized');
    if (tender.status === 'AWARDED')
      throw new BadRequestException('Tender already awarded');

    const bid = await tx.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid || bid.tenderId !== tenderId)
      throw new BadRequestException('Invalid bid');

    await tx.bid.update({
      where: { id: bidId },
      data: { isAccepted: true },
    });

    await tx.bid.updateMany({
      where: {
        tenderId,
        id: { not: bidId },
      },
      data: { isAccepted: false },
    });

    return tx.tender.update({
      where: { id: tenderId },
      data: {
        status: 'AWARDED',
        winningContractorId: bid.contractorId,
      },
    });
  });

  // 2️⃣ AFTER transaction (safe)
  await this.auditService.log({
    userId: governmentId,
    tenderId,
    action: 'BID_AWARDED',
    details: `Bid ${bidId} awarded`,
  });

  return updatedTender;
}


  /* =========================================================
     CANCEL (ONLY NON-FINAL)
     ========================================================= */

  async cancelTender(tenderId: string, governmentId: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id: tenderId },
    });

    if (!tender) throw new BadRequestException('Tender not found');
    if (tender.createdById !== governmentId)
      throw new BadRequestException('Not authorized');

    if (tender.status === TenderStatus.CANCELLED) {
      throw new BadRequestException('Already cancelled');
    }

    const updated = await this.prisma.tender.update({
      where: { id: tenderId },
      data: { status: TenderStatus.CANCELLED },
    });

    await this.auditService.log({
      userId: governmentId,
      tenderId,
      action: 'TENDER_CANCELLED',
      details: `Tender cancelled`,
    });

    return updated;
  }
}
