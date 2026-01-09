import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Module({
  providers: [BlockchainService],
  exports: [BlockchainService], // ✅ THIS IS CRITICAL
})
export class BlockchainModule {}
