import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
    @IsString()
    @IsOptional()
    @ApiProperty({description: 'Comment content', nullable: true})
    content?: string;
}
