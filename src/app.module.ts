import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { UserModule } from './modules/user/user.module';
import { OpenApiService } from './open-api/open-api.service';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        UPLOAD_KEY: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        AWS_BUCKET_REGION: Joi.string().required(),
        AWS_BUCKET_ARN: Joi.string().required(),
        AWS_KEY: Joi.string().required(),
        AWS_SECRET_KEY: Joi.string().required(),
      }),
    }),
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
