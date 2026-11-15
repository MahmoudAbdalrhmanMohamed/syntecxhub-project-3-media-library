import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { QueryUploadsDto } from './dto/query-uploads.dto';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  UploadsService,
} from './uploads.service';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  @ApiOperation({ summary: 'List uploaded media files with pagination and filtering' })
  @ApiOkResponse({ description: 'Paginated media library records returned' })
  findAll(@Query() query: QueryUploadsDto) {
    return this.uploadsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single uploaded file metadata by ID' })
  @ApiParam({ name: 'id', description: '24-character MongoDB ObjectId' })
  @ApiOkResponse({ description: 'Uploaded file metadata returned' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.uploadsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload one or multiple image files (JPEG, PNG, WebP, GIF, SVG up to 5MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Image files uploaded and metadata stored in MongoDB' })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, path.join(process.cwd(), 'uploads'));
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase() || '.png';
          const safeBase = path
            .basename(file.originalname, path.extname(file.originalname))
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 40);
          cb(null, `${Date.now()}-${safeBase || 'asset'}-${randomUUID().slice(0, 8)}${ext}`);
        },
      }),
      limits: {
        fileSize: MAX_UPLOAD_SIZE_BYTES,
        files: 10,
      },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `Invalid image format "${file.mimetype}". Allowed formats: JPEG, PNG, WebP, GIF, SVG.`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const saved = await this.uploadsService.saveUploadedFiles(files);
    return {
      message: `${saved.length} file(s) uploaded successfully`,
      data: saved,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an uploaded file from disk and MongoDB' })
  @ApiParam({ name: 'id', description: '24-character MongoDB ObjectId' })
  @ApiOkResponse({ description: 'File deleted successfully' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.uploadsService.remove(id);
    return {
      message: 'File deleted successfully',
      data: result,
    };
  }
}
