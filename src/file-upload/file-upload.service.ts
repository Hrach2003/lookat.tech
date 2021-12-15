import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get url() {
    const apiKey = this.configService.get('UPLOAD_KEY');
    return `https://api.imgbb.com/1/upload?key=${apiKey}`;
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const response = await this.httpService.post(this.url, {
        image: file,
      });
      this.logger.log(response);
      return response;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }
}
