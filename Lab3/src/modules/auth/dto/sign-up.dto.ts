import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";
import {ApiProperty} from '@nestjs/swagger';
import { Transform } from "class-transformer";

export class SignUpDto {
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

    @IsDate()
    @Transform(({value}) => typeof value === "string" ? new Date(value) : value)
    @ApiProperty({description: 'Birth date of user', default: new Date()})
    birthDate: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'User sex', default: 'female'})
    sex: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(128)
    @ApiProperty({description: 'User name', default: 'Dasha', minLength: 2, maxLength: 128})
    name: string;
}
