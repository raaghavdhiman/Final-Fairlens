import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Body,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* =========================================================
     AUTHENTICATED USER (ANY ROLE)
     ========================================================= */

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  /* =========================================================
     READ-ONLY USER QUERIES (GOV ONLY)
     ========================================================= */

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  /* =========================================================
     GOVERNMENT → VERIFY CONTRACTOR
     ========================================================= */

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  verifyContractor(@Param('id') contractorId: string, @Req() req) {
    return this.usersService.verifyContractor(
      contractorId,
      req.user.id,
    );
  }
  @Patch('me/wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CONTRACTOR)
linkWallet(@Req() req, @Body('walletAddress') walletAddress: string) {
  return this.usersService.linkWallet(req.user.id, walletAddress);
}

}
