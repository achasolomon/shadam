import { IsString, IsOptional, IsObject, IsDateString, IsBoolean, IsIn } from 'class-validator';
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

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  body?: Record<string, any>;

  @ApiProperty()
  @Transform(toIso)
  @IsDateString()
  startAt!: string;

  @ApiPropertyOptional()
  @Transform(toIso)
  @IsDateString()
  @IsOptional()
  endAt?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  venueAddress?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverMediaId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  registrationUrl?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ enum: CONTENT_STATUSES })
  @IsIn(CONTENT_STATUSES)
  @IsOptional()
  status?: ContentStatusValue;
}
