import { isNumber } from 'class-validator';
import { IPageMetaParametersDto } from '../interfaces/pagination-meta-parameters.interface';

export class PageMetaModel {
  readonly page?: number;
  readonly limit?: number;
  readonly itemsCount: number;

  constructor({ pageOptionsDto, itemCount }: IPageMetaParametersDto) {
    this.page = pageOptionsDto?.page;
    this.limit = pageOptionsDto?.limit;
    this.itemsCount = itemCount;
  }
}
