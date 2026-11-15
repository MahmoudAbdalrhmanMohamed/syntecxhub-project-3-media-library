import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { FilterQuery, Model } from 'mongoose';
import * as path from 'path';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { escapeRegExp } from '../common/utils/regex.util';
import { QueryUploadsDto } from './dto/query-uploads.dto';
import { UploadDocument, UploadFile } from './schemas/upload.schema';

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class UploadsService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectModel(UploadFile.name)
    private readonly uploadModel: Model<UploadDocument>,
    private readonly configService: ConfigService,
  ) {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file was provided for upload.');
    }
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type "${file.mimetype}". Allowed types: JPEG, PNG, WebP, GIF, SVG.`,
      );
    }
    const maxBytes =
      this.configService.get<number>('maxFileSizeBytes') || MAX_UPLOAD_SIZE_BYTES;
    if (file.size > maxBytes) {
      throw new BadRequestException(
        `File "${file.originalname}" exceeds maximum allowed size of ${(
          maxBytes /
          (1024 * 1024)
        ).toFixed(1)} MB.`,
      );
    }
  }

  async findAll(
    query: QueryUploadsDto,
  ): Promise<PaginatedResult<UploadDocument>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const filter: FilterQuery<UploadDocument> = {};

    if (query.search && query.search.trim()) {
      const safeRegex = new RegExp(escapeRegExp(query.search.trim()), 'i');
      filter.$or = [{ originalName: safeRegex }, { storedName: safeRegex }];
    }

    if (query.mimeType && query.mimeType.trim()) {
      filter.mimeType = query.mimeType.trim();
    }

    const allowedSortFields = ['uploadDate', 'createdAt', 'size', 'originalName'];
    const sortField = allowedSortFields.includes(query.sortBy)
      ? query.sortBy
      : 'uploadDate';
    const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      this.uploadModel
        .find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.uploadModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<UploadDocument> {
    const record = await this.uploadModel.findById(id).exec();
    if (!record) {
      throw new NotFoundException(`Uploaded file with ID "${id}" was not found.`);
    }
    return record;
  }

  async saveUploadedFiles(
    files: Express.Multer.File[],
  ): Promise<UploadDocument[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Please select at least one image file to upload.');
    }

    const baseUrl =
      this.configService.get<string>('publicBaseUrl') || 'http://localhost:4000';

    const savedRecords: UploadDocument[] = [];
    for (const file of files) {
      this.validateFile(file);
      const storedName = file.filename;
      const relativeFilePath = `uploads/${storedName}`;
      const publicUrl = `${baseUrl.replace(/\/+$/, '')}/uploads/${storedName}`;

      const record = new this.uploadModel({
        originalName: file.originalname,
        storedName,
        mimeType: file.mimetype,
        size: file.size,
        filePath: relativeFilePath,
        publicUrl,
        altText: path.parse(file.originalname).name.replace(/[-_]+/g, ' '),
        uploadDate: new Date(),
      });

      savedRecords.push(await record.save());
    }

    return savedRecords;
  }

  async remove(id: string): Promise<{ deletedId: string; storedName: string }> {
    const existing = await this.findOne(id);
    const fullDiskPath = path.join(this.uploadsDir, path.basename(existing.storedName));

    if (fs.existsSync(fullDiskPath)) {
      try {
        fs.unlinkSync(fullDiskPath);
      } catch {
        // Ignore unlink errors if file was already removed externally
      }
    }

    await this.uploadModel.findByIdAndDelete(id).exec();
    return {
      deletedId: String(existing._id),
      storedName: existing.storedName,
    };
  }
}
