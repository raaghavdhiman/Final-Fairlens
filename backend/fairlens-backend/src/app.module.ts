import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TendersModule } from './tenders/tenders.module'; 
import { AuditModule } from './audit/audit.module';
import { BidsModule } from './bids/bids.module';
import { PublicModule } from './public/public.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { MilestonesModule } from './milestones/milestones.module';
import { PrismaModule } from './prisma/prisma.module';
import { PortfolioModule } from './portfolio/portfolio.module';


@Module({
  imports: [
    AuthModule,
    UsersModule,
    TendersModule, 
    AuditModule,
    BidsModule,
    PublicModule,
    BlockchainModule,
    MilestonesModule,
    PrismaModule,
    PortfolioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
