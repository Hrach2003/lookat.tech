export type Config = ReturnType<typeof loadConfig>;

export const loadConfig = () => ({
  PORT: process.env.PORT,
  IS_DEV: process.env.NODE_ENV === 'development',
  UPLOAD_KEY: process.env.UPLOAD_KEY,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_SECRET: process.env.JWT_SECRET,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_BUCKET_ARN: process.env.AWS_BUCKET_ARN,
  AWS_KEY: process.env.AWS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AUTH_APP_NAME: process.env.AUTH_APP_NAME,
});
