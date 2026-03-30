import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu (ít nhất 6 ký tự)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên hiển thị',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
