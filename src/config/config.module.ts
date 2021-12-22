import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
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
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {}
