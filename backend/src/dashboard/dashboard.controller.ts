import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({
    summary:
      'Retrieve real-time platform analytics, KPI totals, distributions, and recent entities',
  })
  @ApiOkResponse({ description: 'Dashboard statistics retrieved from MongoDB' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('activity')
  @ApiOperation({
    summary: 'Retrieve unified chronological activity stream across users, products, and uploads',
  })
  @ApiOkResponse({ description: 'Recent platform activity stream returned' })
  getActivity() {
    return this.dashboardService.getActivity();
  }
}
