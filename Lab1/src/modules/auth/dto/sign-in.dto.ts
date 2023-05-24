import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class SignInDto {
    @IsEmail()
    @MaxLength(128)
    @MinLength(5)
    @ApiProperty({default: 'example@gmail.com', minLength: 5, maxLength: 128})
    email: string;

    @IsString()
    @MaxLength(64)
    @MinLength(8)
    @ApiProperty({default: 'password123', minLength: 8, maxLength: 64})
    password: string;
}
