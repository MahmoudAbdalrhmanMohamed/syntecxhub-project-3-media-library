import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadFile } from './schemas/upload.schema';
import { UploadsService } from './uploads.service';

describe('UploadsService', () => {
  let service: UploadsService;

  const mockUploadModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    _id: '673700000000000000000201',
    save: jest.fn().mockResolvedValue({
      _id: '673700000000000000000201',
      ...dto,
    }),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        {
          provide: getModelToken(UploadFile.name),
          useValue: mockUploadModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'maxFileSizeBytes') return 5 * 1024 * 1024;
              if (key === 'publicBaseUrl') return 'http://localhost:4000';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  it('rejects unsupported non-image MIME types', () => {
    expect(() =>
      service.validateFile({
        originalname: 'malicious.exe',
        mimetype: 'application/x-msdownload',
        size: 1024,
      } as Express.Multer.File),
    ).toThrow(BadRequestException);
  });

  it('rejects files larger than 5MB limit', () => {
    expect(() =>
      service.validateFile({
        originalname: 'huge-banner.png',
        mimetype: 'image/png',
        size: 6 * 1024 * 1024,
      } as Express.Multer.File),
    ).toThrow(BadRequestException);
  });

  it('saves valid image upload metadata and constructs publicUrl', async () => {
    const saved = await service.saveUploadedFiles([
      {
        originalname: 'gateway-photo.png',
        filename: '1700000000-gateway-photo.png',
        mimetype: 'image/png',
        size: 124000,
      } as Express.Multer.File,
    ]);

    expect(saved).toHaveLength(1);
    expect(saved[0].publicUrl).toBe(
      'http://localhost:4000/uploads/1700000000-gateway-photo.png',
    );
  });
});
