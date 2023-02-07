import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { DataSource } from "typeorm";
import dataSource from "../../config/database.config";
import { AuthenticationMiddleware } from "@middlewares/authenticate";
import { TOKENS } from "./user.constants";
import { UserController } from "./user.controller";
import { TypeORMUserDao } from "./user.dao";
import { UserService } from "./user.service";
import { validate } from "./user.validators";

@Module({
  controllers: [
    UserController
  ],
  providers: [
    {
      provide: TOKENS.USERDAO,
      useClass: TypeORMUserDao
    },
    {
      provide: DataSource,
      useValue: dataSource
    },
    UserService
  ],
  exports: [
    UserService
  ]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validate('create-user'))
      .forRoutes({ path: '/users', method: RequestMethod.POST })
      .apply(AuthenticationMiddleware)
      .forRoutes(
        {path: '/users/:id/follow', method: RequestMethod.POST},
        {path: '/users/:id/unfollow', method: RequestMethod.POST},
        {path: '/', method: RequestMethod.DELETE})
  }
}