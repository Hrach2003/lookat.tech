import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { OpenApiService } from './open-api/open-api.service';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    UserModule,
    FileUploadModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenApiService],
})
export class AppModule {}
