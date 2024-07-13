import { Module } from "@nestjs/common";
import { WinstonLogger } from "./logger.service";

@Module({
    imports: [],
    providers: [WinstonLogger],
    exports: [WinstonLogger],
  })
  export class WinsotnModule {}