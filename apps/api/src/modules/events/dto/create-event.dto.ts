import { IsString, IsOptional, IsObject, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @IsDateString()
  startAt!: string;

  @ApiPropertyOptional()
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
}
