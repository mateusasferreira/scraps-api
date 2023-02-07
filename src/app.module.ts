import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { UserModule } from "@domain/user";
import { ErrorHandler } from "@middlewares/errorHandler";

@Module({
  imports: [
    UserModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHandler
    }
  ]
})
export class AppModule {}