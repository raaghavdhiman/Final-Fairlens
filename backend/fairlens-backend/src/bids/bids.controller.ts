import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  /* =========================================================
     CONTRACTOR → CREATE BID
     ========================================================= */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONTRACTOR)
  createBid(@Body() dto: CreateBidDto, @Req() req) {
    return this.bidsService.createBid(dto, req.user.id);
  }

  /* =========================================================
     CONTRACTOR → MY BIDS
     ========================================================= */
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONTRACTOR)
  getMyBids(@Req() req) {
    return this.bidsService.getMyBids(req.user.id);
  }

  /* =========================================================
     GOVERNMENT → ALL BIDS (ALL TENDERS)
     ========================================================= */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  getAllBidsForGovernment(@Req() req) {
    return this.bidsService.getAllBidsForGovernment(req.user.id);
  }

  /* =========================================================
     GOVERNMENT → BIDS FOR A SPECIFIC TENDER
     ========================================================= */
  @Get('tender/:tenderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  getBidsForTender(
    @Param('tenderId') tenderId: string,
    @Req() req,
  ) {
    return this.bidsService.getBidsForTender(
      tenderId,
      req.user.id,
    );
  }
}
