import { Injectable } from '@nestjs/common';
import { UploadVideoDto } from './dto/upload-video.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    const key = `videos/${Date.now()}-${name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: key,
      ContentType: type,
    });

    const uploaderUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });

    return { status:201, uploaderUrl, key };
  }
}
