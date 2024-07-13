import { ApiProperty } from '@nestjs/swagger';
import { PageMetaModel } from '../models/page-meta.model';

export class PageMetaDto extends PageMetaModel {
  @ApiProperty({ type: Number })
  readonly page?: number;
  @ApiProperty({ type: Number })
  readonly limit?: number;
  @ApiProperty({ type: Number })
  readonly itemsCount: number;
}
