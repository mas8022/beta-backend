import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import * as path from 'path';
import * as crypto from 'crypto';
import * as mime from 'mime-types';

@Injectable()
export class PocketService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: process.env.LIARA_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY!,
        secretAccessKey: process.env.LIARA_SECRET_KEY!,
      },
    });
  }

  async uploadFile(
    file: any,
    allowedTypes: ('image' | 'video')[] = ['image', 'video'],
  ): Promise<string | null> {
    if (!file) return null;

    const ext = file.originalname
      ? path.extname(file.originalname).toLowerCase()
      : `.${mime.extension(file.mimetype) || 'bin'}`;

    const contentType = file.mimetype;

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4'];

    let fileBuffer: Buffer;

    if (
      allowedTypes.includes('image') &&
      allowedImageTypes.includes(contentType)
    ) {
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        throw new BadRequestException('Invalid image file extension');
      }

      fileBuffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 50 })
        .toBuffer();
    } else if (
      allowedTypes.includes('video') &&
      allowedVideoTypes.includes(contentType)
    ) {
      if (ext !== '.mp4') {
        throw new BadRequestException('Invalid video file extension');
      }

      fileBuffer = file.buffer;
    } else {
      throw new BadRequestException('Unsupported file type');
    }

    const fileName = `${Date.now()}_${crypto.randomUUID()}${ext}`;

    const params = {
      Body: fileBuffer,
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: fileName,
      ContentType: contentType,
    };

    await this.s3.send(new PutObjectCommand(params));

    return `https://${process.env.LIARA_BUCKET_NAME}.storage.iran.liara.space/${fileName}`;
  }
}
