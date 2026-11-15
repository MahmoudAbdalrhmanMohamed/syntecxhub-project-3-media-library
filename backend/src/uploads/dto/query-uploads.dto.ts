import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryUploadsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by image MIME type (e.g. image/png, image/svg+xml)' })
  @IsOptional()
  @IsString()
  mimeType?: string;
}
