import { Handler, Context, APIGatewayProxyResult } from "aws-lambda";
import { proxy } from "aws-serverless-fastify";
import fastify, { FastifyInstance } from "fastify";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

let fastifyServer: FastifyInstance;

export async function bootstrap() {
  const instance = fastify({ logger: true });
  const nestApp = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance)
  );

  nestApp.enableCors();
  await nestApp.init();
  return instance;
}

process.on("unhandledRejection", (reason) => {
  console.error(reason);
});

process.on("uncaughtException", (reason) => {
  console.error(reason);
});

export const handler: Handler = async (
  event: any,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!fastifyServer) fastifyServer = await bootstrap();
  return await proxy(fastifyServer, event, context);
};
