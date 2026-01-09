import { Module } from '@nestjs/common';
import { TendersController } from './tenders.controller';
import { TendersService } from './tenders.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditModule } from '../audit/audit.module'; // 👈 ADD THIS

@Module({
  imports: [AuditModule], // 👈 THIS IS THE FIX
  controllers: [TendersController],
  providers: [TendersService, PrismaService],
  exports: [TendersService],
})
export class TendersModule {}
