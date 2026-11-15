import { Module } from '@nestjs/common';
import { UploadsModule } from '../uploads/uploads.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [UploadsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
