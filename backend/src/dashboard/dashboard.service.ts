import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadDocument, UploadFile } from '../uploads/schemas/upload.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(UploadFile.name) private readonly uploadModel: Model<UploadDocument>,
  ) {}

  async getStats() {
    const [totalUploads, allUploads, recentUploads] = await Promise.all([
      this.uploadModel.countDocuments().exec(),
      this.uploadModel.find().select('size mimeType').exec(),
      this.uploadModel.find().sort({ uploadDate: -1 }).limit(6).exec(),
    ]);

    const totalStorageBytes = allUploads.reduce(
      (sum, file) => sum + Number(file.size || 0),
      0,
    );

    const mimeMap = new Map<string, { count: number; bytes: number }>();
    for (const up of allUploads) {
      const current = mimeMap.get(up.mimeType) || { count: 0, bytes: 0 };
      current.count += 1;
      current.bytes += Number(up.size || 0);
      mimeMap.set(up.mimeType, current);
    }

    return {
      summary: {
        totalUploadedFiles: totalUploads,
        totalStorageBytes,
      },
      distributions: {
        uploadsByType: Array.from(mimeMap.entries()).map(([mimeType, info]) => ({
          mimeType,
          count: info.count,
          bytes: info.bytes,
        })),
      },
      recent: {
        uploads: recentUploads,
      },
    };
  }

  async getActivity() {
    const recentUploads = await this.uploadModel.find().sort({ uploadDate: -1 }).limit(8).exec();
    const events = recentUploads.map((f) => ({
      id: `upload-${String(f._id)}`,
      type: 'file_uploaded' as const,
      title: `Media asset uploaded: ${f.originalName}`,
      subtitle: `${f.mimeType} • ${(f.size / 1024).toFixed(1)} KB`,
      timestamp: (f.uploadDate || f.createdAt || new Date()).toISOString(),
      actor: 'Media Pipeline',
    }));
    return { events, totalEvents: events.length };
  }
}
