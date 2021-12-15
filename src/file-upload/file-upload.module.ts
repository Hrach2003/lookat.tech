import { Logger, Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule, Logger],
  exports: [FileUploadService],
  providers: [FileUploadService],
})
export class FileUploadModule {}
