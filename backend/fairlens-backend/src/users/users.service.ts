import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { BlockchainService } from '../blockchain/blockchain.service';
import { hashContractorIdentity } from '../blockchain/contractor-hash.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchainService: BlockchainService,
  ) {}

  /* =========================================================
     READ METHODS
     ========================================================= */

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        walletAddress: true,
        contractorHash: true,
        verifiedBy: true,
        verifiedAt: true,
        createdAt: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        walletAddress: true,
        contractorHash: true,
        verifiedBy: true,
        verifiedAt: true,
        createdAt: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
  }

  /* =========================================================
     CREATE USER
     ========================================================= */

  create(data: {
    email: string;
    password: string;
    name: string;
    role: Role;
    walletAddress?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  /* =========================================================
     GOVERNMENT → VERIFY CONTRACTOR (BLOCKCHAIN)
     ========================================================= */

  async verifyContractor(contractorId: string, governmentId: string) {
    const contractor = await this.prisma.user.findUnique({
      where: { id: contractorId },
    });

    if (!contractor) {
      throw new BadRequestException('Contractor not found');
    }

    if (contractor.role !== Role.CONTRACTOR) {
      throw new BadRequestException('User is not a contractor');
    }

    if (!contractor.walletAddress) {
      throw new BadRequestException('Contractor wallet not linked');
    }

    if (contractor.contractorHash) {
      throw new BadRequestException('Contractor already verified');
    }

    /* 🔐 CANONICAL IDENTITY (NO TIME, NO MUTATION) */
    const payload = {
      contractorId: contractor.id,
      name: contractor.name,
      walletAddress: contractor.walletAddress,
      verifiedBy: governmentId,
    };

    const contractorHash = hashContractorIdentity(payload);

    /* 🔗 Anchor on blockchain (timestamp comes from chain) */
    const txHash = await this.blockchainService.verifyContractor(
      contractorHash,
      contractor.walletAddress,
    );

    /* 💾 Store hash + metadata (metadata NOT part of hash) */
    const verifiedAt = new Date();

    await this.prisma.user.update({
      where: { id: contractor.id },
      data: {
        contractorHash,
        verifiedBy: governmentId,
        verifiedAt,
      },
    });

    return {
      contractorId: contractor.id,
      name: contractor.name,
      walletAddress: contractor.walletAddress,
      contractorHash,
      verifiedBy: governmentId,
      verifiedAt,
      txHash,
      network: 'sepolia',
    };
  }
}
