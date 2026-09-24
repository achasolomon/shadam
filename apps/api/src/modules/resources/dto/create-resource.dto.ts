import { IsString, IsOptional, IsInt, IsIn, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const CONTENT_STATUSES = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'REJECTED'] as const;
export type ContentStatusValue = (typeof CONTENT_STATUSES)[number];

function toIso({ value }: { value: unknown }): unknown {
  if (!value || typeof value !== 'string') return value;
  if (value.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toISOString();
}

export class CreateResourceDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: ['DOCUMENT', 'ARTICLE'] })
  @IsIn(['DOCUMENT', 'ARTICLE'])
  @IsOptional()
  resourceType?: 'DOCUMENT' | 'ARTICLE';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  fileSize?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional({ enum: CONTENT_STATUSES })
  @IsIn(CONTENT_STATUSES)
  @IsOptional()
  status?: ContentStatusValue;

  @ApiPropertyOptional()
  @Transform(toIso)
  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}

export class UpdateResourceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: ['DOCUMENT', 'ARTICLE'] })
  @IsIn(['DOCUMENT', 'ARTICLE'])
  @IsOptional()
  resourceType?: 'DOCUMENT' | 'ARTICLE';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  fileSize?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional({ enum: CONTENT_STATUSES })
  @IsIn(CONTENT_STATUSES)
  @IsOptional()
  status?: ContentStatusValue;

  @ApiPropertyOptional()
  @Transform(toIso)
  @IsDateString()
  @IsOptional()
  publishedAt?: string;
}
