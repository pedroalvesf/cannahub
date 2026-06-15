import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './infra/database/database.module';
import { CryptographyModule } from './infra/cryptography/cryptography.module';
import { HttpModule } from './infra/http/http.module';
import { LoggingModule } from './infra/logging/logging.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      // Global default: 100 requests / minute / IP. Sensitive routes (login,
      // register) tighten this with @Throttle. Disabled under tests so the
      // e2e suite (which hammers auth) is not rate-limited.
      throttlers: [{ ttl: 60_000, limit: 100 }],
      skipIf: () => process.env.NODE_ENV === 'test',
    }),
    LoggingModule,
    DatabaseModule,
    CryptographyModule,
    HttpModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
