import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadFile, UploadFileSchema } from './schemas/upload.schema';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UploadFile.name, schema: UploadFileSchema },
    ]),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService, MongooseModule],
})
export class UploadsModule {}
