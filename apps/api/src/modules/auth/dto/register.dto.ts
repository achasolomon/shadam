import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'john@shedam.org' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    description: 'Role id. Only Super Admin may set this; defaults to role-read-only.',
    example: 'role-read-only',
  })
  @IsString()
  @IsOptional()
  @IsIn(['role-read-only', 'role-content-manager', 'role-media-manager', 'role-editor', 'role-events-manager', 'role-support-officer', 'role-super-admin'], {
    message: 'roleId must be a valid role id',
  })
  roleId?: string;
}
