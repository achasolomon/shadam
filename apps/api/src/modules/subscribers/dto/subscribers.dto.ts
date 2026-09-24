import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty()
  @IsEmail()
  email!: string;
}

export class UnsubscribeDto {
  @ApiProperty()
  @IsEmail()
  email!: string;
}

export class UpdateSubscriberDto {
  @ApiProperty({ enum: ['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED'] })
  @IsString()
  @MinLength(1)
  status!: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED';
}

export class SendNewsletterDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  subject!: string;

  @ApiProperty({ description: 'Plain text or HTML body' })
  @IsString()
  @MinLength(1)
  message!: string;

  @ApiPropertyOptional({ description: 'Treat message as raw HTML' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  isHtml?: string;
}
