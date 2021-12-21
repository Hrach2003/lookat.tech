import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [HttpModule, ConfigModule, Logger],
  exports: [FileUploadService],
  providers: [FileUploadService],
})
export class FileUploadModule {}
