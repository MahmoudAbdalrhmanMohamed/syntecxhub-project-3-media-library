import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { AppModule } from '../app.module';
import { UploadDocument, UploadFile } from '../uploads/schemas/upload.schema';

async function runSeed() {
  const logger = new Logger('Project3UploadsSeed');
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const uploadModel = app.get<Model<UploadDocument>>(getModelToken(UploadFile.name));
    await uploadModel.deleteMany({});
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filesOnDisk = fs.readdirSync(uploadsDir).filter((f) => f.endsWith('.svg'));
    const docs = filesOnDisk.map((filename) => {
      const stat = fs.statSync(path.join(uploadsDir, filename));
      return {
        originalName: filename,
        storedName: filename,
        mimeType: 'image/svg+xml',
        size: stat.size,
        filePath: `uploads/${filename}`,
        publicUrl: `http://localhost:4000/uploads/${filename}`,
        altText: filename.replace(/[-_.]/g, ' '),
        uploadDate: new Date(),
      };
    });
    const inserted = await uploadModel.insertMany(docs);
    logger.log(`Seeded ${inserted.length} media assets into MongoDB.`);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  runSeed();
}
