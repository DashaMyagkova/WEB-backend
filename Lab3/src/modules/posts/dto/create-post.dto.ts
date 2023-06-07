import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(128)
    @ApiProperty({description: 'Post title', minLength: 2, maxLength: 128, required: true})
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'Post content', required: true})
    content: string;
}
