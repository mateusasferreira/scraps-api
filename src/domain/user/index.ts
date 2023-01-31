import { Module } from "@nestjs/common";
import { DataSource } from "typeorm";
import dataSource from "../../config/database.config";
import { TYPES } from "./user.constants";
import { UserController } from "./user.controller";
import { TypeORMUserDao } from "./user.dao";
import { UserService } from "./user.service";

@Module({
  controllers: [
    UserController
  ],
  providers: [
    {
      provide: TYPES.USERDAO,
      useClass: TypeORMUserDao
    },
    {
      provide: TYPES.USERSERVICE,
      useClass: UserService
    },
    {
      provide: DataSource,
      useValue: dataSource
    }
  ],
  // exports: [
  //   UserService
  // ]
})
export class UserModule {}