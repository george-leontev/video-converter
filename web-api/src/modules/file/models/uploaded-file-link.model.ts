import { ApiProperty } from '@nestjs/swagger';

export class UploadedFileLink {
    @ApiProperty()
    link: string;
}
