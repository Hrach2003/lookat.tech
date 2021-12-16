import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { UserRepository } from 'src/core/user/repositories/user.repository';
import { PrismaService } from 'src/database/database.service';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [FileUploadModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService],
})
export class UserModule {}
