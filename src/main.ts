import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  app.enableCors({
    origin: 'http://localhost:3003', 
    credentials: true,
  });
    const config = new DocumentBuilder()
    .setTitle('Tunisian Football Premier League API')
    .setDescription('API documentation for the Tunisian Football Premier League')
    .setVersion('1.0')
    .addBearerAuth() 
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
          tokenUrl: 'https://oauth2.googleapis.com/token',
          scopes: {
            'email': 'Access your email',
            'profile': 'Access your profile information',
          },
        },
      },
    })
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        oauth2RedirectUrl: 'http://localhost:3003/auth/google/callback',
      },
    });

    await app.listen(process.env.PORT ?? 3003);
}
bootstrap();