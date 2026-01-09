import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
