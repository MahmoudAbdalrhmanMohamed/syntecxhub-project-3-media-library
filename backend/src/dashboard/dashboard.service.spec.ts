import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadFile } from '../uploads/schemas/upload.schema';
import { DashboardService } from './dashboard.service';

describe('DashboardService (Project 3 - Media Library)', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const mockUploads = [
      {
        _id: '673700000000000000000201',
        originalName: 'product-gateway-x1.svg',
        mimeType: 'image/svg+xml',
        size: 2048,
        uploadDate: new Date(),
      },
    ];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getModelToken(UploadFile.name),
          useValue: {
            countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) }),
            find: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUploads) }),
              sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUploads) }),
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('aggregates uploaded media file counts and byte storage totals', async () => {
    const stats = await service.getStats();
    expect(stats.summary.totalUploadedFiles).toBe(1);
    expect(stats.summary.totalStorageBytes).toBe(2048);
  });
});
