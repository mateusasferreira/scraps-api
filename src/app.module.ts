import { Module } from "@nestjs/common";
import { UserModule } from "./domain/user";

@Module({
  imports: [UserModule]
})
export class AppModule {}