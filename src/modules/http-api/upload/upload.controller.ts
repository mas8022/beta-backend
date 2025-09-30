import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadVideoDto } from './dto/upload-video.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('video')
  async uploadVideo(@Body() body: UploadVideoDto) {
    return await this.uploadService.uploadVideo(body);
  }
}
