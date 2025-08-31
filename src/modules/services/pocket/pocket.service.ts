import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

@Injectable()
export class PocketService {
  private s3: S3Client;

  constructor() {
    const accessKey = process.env.LIARA_ACCESS_KEY;
    const secretKey = process.env.LIARA_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error('Liara credentials are not set in environment variables');
    }

    this.s3 = new S3Client({
      region: 'default',
      endpoint: process.env.LIARA_ENDPOINT,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
  }

  async uploadFile(file: any): Promise<string | null> {
    if (!file) return null;

    const fileName = Date.now() + '_' + crypto.randomUUID();
    const buffer = file.buffer;

    let fileBuffer: Buffer;
    let contentType = file.mimetype;

    if (contentType.startsWith('image/')) {
      fileBuffer = await sharp(buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 50 })
        .toBuffer();
    } else if (contentType.startsWith('video/')) {
      fileBuffer = buffer;
    } else {
      throw new BadRequestException('Unsupported file type');
    }

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
