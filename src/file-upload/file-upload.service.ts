import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';
import { Generator } from '../utils/generator.util';

@Injectable()
export class FileUploadService {
  private readonly s3: AWS.S3;
  private readonly logger = new Logger(FileUploadService.name);

  constructor(private readonly configService: ConfigService) {
    const options: AWS.S3.Types.ClientConfiguration = {
      region: this.configService.get('AWS_BUCKET_REGION'),
      accessKeyId: this.configService.get('AWS_KEY'),
      secretAccessKey: this.configService.get('AWS_KEY_SECRET'),
    };

    this.s3 = new AWS.S3(options);
  }

  async deleteFile(key: string) {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: key,
        })
        .promise();
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(
        `Image with key ${key} is not deleted`,
      );
    }
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const filename = Generator.filename(
        <string>mime.extension(file.mimetype),
      );
      const key = `images/${filename}`;

      const data = await this.s3
        .upload({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Body: file.buffer,
          Key: key,
          ACL: 'public-read',
        })
        .promise();

      return data.Location;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
