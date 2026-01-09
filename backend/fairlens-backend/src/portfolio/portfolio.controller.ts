import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('public/portfolio')
export class PortfolioController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('contractor/:id')
  async getContractorPortfolio(@Param('id') contractorId: string) {
    const contractor = await this.prisma.user.findUnique({
      where: { id: contractorId },
    });

    if (!contractor || contractor.role !== 'CONTRACTOR') {
      throw new NotFoundException('Contractor not found');
    }

    /* ===============================
       FETCH AWARDED TENDERS
       =============================== */
    const tenders = await this.prisma.tender.findMany({
      where: {
        winningContractorId: contractorId,
      },
      include: {
        milestones: true,
      },
    });

    /* ===============================
       AGGREGATE STATS
       =============================== */
    let totalMilestones = 0;
    let completedMilestones = 0;
    let totalPaidEth = 0;

    const history = tenders.map((tender) => {
      const milestones = tender.milestones.map((m) => {
        totalMilestones++;

        if (m.paidAt) {
          completedMilestones++;
          totalPaidEth += m.amount;
        }

        return {
          description: m.description,
          amount: m.amount,
          paid: !!m.paidAt,
          txHash: m.paymentTxHash,
        };
      });

      return {
        tenderId: tender.id,
        title: tender.title,
        milestones,
      };
    });

    return {
      verified: !!contractor.verifiedAt,
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
        totalPaidEth,
      },
      history,
    };
  }
}
