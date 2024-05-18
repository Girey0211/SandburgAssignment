import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger';
import { LoggerInterceptor } from './util/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableCors()

  app.useGlobalInterceptors(new LoggerInterceptor());

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
