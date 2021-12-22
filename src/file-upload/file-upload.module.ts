import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [HttpModule],
  exports: [FileUploadService],
  providers: [FileUploadService],
})
export class FileUploadModule {}
