import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainModule } from '../blockchain/blockchain.module'; // 👈 THIS LINE WAS MISSING

@Module({
  imports: [BlockchainModule],
  providers: [AuditService, PrismaService],
  exports: [AuditService],
  
})
export class AuditModule {}
