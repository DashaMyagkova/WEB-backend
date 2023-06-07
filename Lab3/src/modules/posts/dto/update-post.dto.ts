import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto {
    @IsString()
    @MinLength(2)
    @MaxLength(128)
    @IsOptional()
    @ApiProperty({description: 'Post title', minLength: 2, maxLength: 128, nullable: true})
    title?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({description: 'Post content', nullable: true})
    content?: string;
}
