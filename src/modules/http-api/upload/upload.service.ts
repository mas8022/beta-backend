import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadVideoDto } from './dto/upload-video.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as path from 'path';

@Injectable()
export class UploadService {
  private s3 = new S3Client({
    region: 'us-east-1',
    endpoint: process.env.LIARA_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.LIARA_ACCESS_KEY!,
      secretAccessKey: process.env.LIARA_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  async uploadVideo({ name, type }: UploadVideoDto) {
    const ext = path.extname(name).toLowerCase();
    if (ext !== '.mp4') {
      throw new BadRequestException('فقط فایل‌هایی با فرمت .mp4 مجاز هستند');
    }

    if (type !== 'video/mp4') {
      throw new BadRequestException('نوع فایل غیرمجاز است');
    }

    const safeName = name.replace(/[^a-zA-Z0-9_\-.]/g, '');

    const key = `videos/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.LIARA_BUCKET_NAME!,
      Key: key,
      ContentType: 'video/mp4',
    });

    const uploaderUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });

    return { status: 201, uploaderUrl, key };
  }
}
