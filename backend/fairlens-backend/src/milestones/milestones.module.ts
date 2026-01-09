import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { AuditModule } from '../audit/audit.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [
    AuditModule,
    BlockchainModule,
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule {}
