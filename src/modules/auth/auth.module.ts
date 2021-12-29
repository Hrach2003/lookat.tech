import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTwoFactorStrategy } from './strategies/jwt-two-factor-auth.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    TwoFactorAuthService,
    JwtTwoFactorStrategy,
  ],
  controllers: [AuthController, TwoFactorAuthController],
  exports: [AuthService, TwoFactorAuthService],
})
export class AuthModule {}
