import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageOptionsModel } from '../models/page-options.model';
import { Order } from '../models/order.enum';

export class PageOptionsDto extends PageOptionsModel {
  @ApiPropertyOptional({ enum: Order, default: Order.desc })
  @IsOptional()
  @IsEnum(Order)
  readonly order?: Order = Order.desc;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit?: number = 10;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly skip?: number;
}
