import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './module/common/interceptor/transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['http://localhost:3000', 'https://tlogo-fe.vercel.app'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3001);
}
bootstrap();
