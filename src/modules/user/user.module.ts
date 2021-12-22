import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileUploadModule } from 'file-upload/file-upload.module';
import { UserRepository } from 'modules/user/repositories/user.repository';
import { PrismaService } from 'database/database.service';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [FileUploadModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService],
})
export class UserModule {}
