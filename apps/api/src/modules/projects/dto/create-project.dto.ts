import { IsString, IsOptional, IsObject, IsDateString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CONTENT_STATUSES = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'REJECTED'] as const;
type ContentStatusValue = (typeof CONTENT_STATUSES)[number];

function toIso({ value }: { value: unknown }): unknown {
  if (!value || typeof value !== 'string') return value;
  if (value.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toISOString();
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  body?: Record<string, any>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverMediaId?: string;

  @ApiPropertyOptional()
  @Transform(toIso)
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @Transform(toIso)
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ctaLabel?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ctaUrl?: string;

  @ApiPropertyOptional({ enum: CONTENT_STATUSES })
  @IsIn(CONTENT_STATUSES)
  @IsOptional()
  status?: ContentStatusValue;
}
