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
import { MilestonesService } from './milestones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('milestones')
export class MilestonesController {
  constructor(
    private readonly milestonesService: MilestonesService,
  ) {}

  /* =========================================================
     GOVERNMENT → ADD MILESTONE
     ========================================================= */
  @Post(':tenderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  addMilestone(
    @Param('tenderId') tenderId: string,
    @Body()
    body: {
      description: string;
      amount: number;
      dueDate: string;
      penaltyRate: number;
    },
    @Req() req,
  ) {
    return this.milestonesService.addMilestone(
      tenderId,
      body.description,
      body.amount,
      new Date(body.dueDate),
      body.penaltyRate,
      req.user.id,
    );
  }

  /* =========================================================
     CONTRACTOR → START WORK
     ========================================================= */
  @Patch(':id/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONTRACTOR)
  startWork(@Param('id') id: string, @Req() req) {
    return this.milestonesService.startWork(id, req.user.id);
  }

  /* =========================================================
     CONTRACTOR → SUBMIT WORK
     ========================================================= */
  @Patch(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONTRACTOR)
  submitWork(@Param('id') id: string, @Req() req) {
    return this.milestonesService.submitWork(id, req.user.id);
  }

  /* =========================================================
     GOVERNMENT → VERIFY WORK
     ========================================================= */
  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  verifyWork(@Param('id') id: string, @Req() req) {
    return this.milestonesService.verifyWork(id, req.user.id);
  }

  /* =========================================================
     GOVERNMENT → RELEASE PAYMENT
     ========================================================= */
  @Patch(':id/pay')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GOVERNMENT)
  releasePayment(@Param('id') id: string, @Req() req) {
    return this.milestonesService.releasePayment(id, req.user.id);
  }
  @Patch(':id/act-of-god')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.GOVERNMENT)
markActOfGod(
  @Param('id') id: string,
  @Body() body: { reason: string },
  @Req() req,
) {
  return this.milestonesService.markActOfGod(
    id,
    body.reason,
    req.user.id,
  );
}

@Get('tender/:tenderId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.GOVERNMENT)
getByTender(
  @Param('tenderId') tenderId: string,
  @Req() req,
) {
  return this.milestonesService.getMilestonesByTender(
    tenderId,
    req.user.id,
  );
}

@Get('my')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CONTRACTOR)
getMyMilestones(@Req() req) {
  return this.milestonesService.getMyMilestones(req.user.id);
}



}
