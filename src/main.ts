import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RpcExceptionToHttpFilter } from './filter/rpc.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('User API gateway')
    .setDescription('First task a user CRUD and file upload')
    .setVersion('1.0')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // add validator
  app.useGlobalPipes(new ValidationPipe());

  // add grpc exception filter
  app.useGlobalFilters(new RpcExceptionToHttpFilter());
  await app.listen(3001);
}
bootstrap();
