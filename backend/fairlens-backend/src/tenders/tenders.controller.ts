import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TendersService } from './tenders.service';
import { CreateTenderDto } from './dto/create-tender.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('tenders')
export class TendersController {
  constructor(private readonly tendersService: TendersService) {}

  @Patch(':tenderId/award/:bidId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.GOVERNMENT)
awardBid(
  @Param('tenderId') tenderId: string,
  @Param('bidId') bidId: string,
  @Req() req,
) {
  return this.tendersService.awardBid(
    tenderId,
    bidId,
    req.user.id,
  );
}


  // 🔹 GET /tenders (public)
  @Get()
  findAll() {
    return this.tendersService.findAll();
  }

  // 🔹 GET /tenders/my (Government-only) ✅ MUST BE ABOVE :id
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  getMyTenders(@Req() req) {
    return this.tendersService.getMyTenders(req.user.id);
  }

  // 🔹 GET /tenders/:id (public)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tendersService.findById(id);
  }

  // 🔹 POST /tenders (Government-only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  createTender(@Body() body: CreateTenderDto, @Req() req) {
    return this.tendersService.createTender(body, req.user.id);
  }

  // 🔹 PATCH /tenders/:id/open (Government-only)
  @Patch(':id/open')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  openTender(@Param('id') id: string, @Req() req) {
    return this.tendersService.openTender(id, req.user.id);
  }

  // 🔹 PATCH /tenders/:id/close (Government-only)
  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  closeTender(@Param('id') id: string, @Req() req) {
    return this.tendersService.closeTender(id, req.user.id);
  }

  // 🏆 PATCH /tenders/:tenderId/award/:bidId (Government-only)
  @Patch(':tenderId/award/:bidId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  awardTender(
    @Param('tenderId') tenderId: string,
    @Param('bidId') bidId: string,
    @Req() req,
  ) {
    return this.tendersService.awardBid(
      tenderId,
      bidId,
      req.user.id,
    );
  }
}
