import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { FileUploadModule } from '../../file-upload/file-upload.module';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [FileUploadModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
