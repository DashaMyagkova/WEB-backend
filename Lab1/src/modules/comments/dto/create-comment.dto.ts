import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'Comment content', required: true})
    content: string;
}
