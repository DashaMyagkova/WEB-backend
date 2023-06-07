import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json } from "express";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { ErrorAnswer } from "./answers";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { environment } from "./environments/environment";
import { MESSAGES } from "@nestjs/core/constants";
import { RedisSocketIoAdapter } from "./adapters";

const port = process.env.PORT || environment.PORT;
const logger = new Logger("Bootstrap");

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(json({ limit: "50mb" }));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            exceptionFactory: (errors) => new BadRequestException(
                new ErrorAnswer(`Invalid ${errors.map((error) => error.property).join(", ")}`)
            )
        })
    );

    const redisIoAdapter = new RedisSocketIoAdapter(app);
    await redisIoAdapter.connectToRedis({url: environment.REDIS_URL});

    app.useWebSocketAdapter(redisIoAdapter);

    const options = new DocumentBuilder()
        .setTitle("Lab API")
        .setDescription("This documentation is auto-generated.")
        .setVersion("1.0")
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        })
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("docs", app, document);

    await app.listen(port, async () => {
        logger.log(MESSAGES.APPLICATION_READY);
        logger.log(`App available on http://localhost:${port}`);
        logger.log(`See API docs on http://localhost:${port}/docs`);
    });
}

bootstrap();
