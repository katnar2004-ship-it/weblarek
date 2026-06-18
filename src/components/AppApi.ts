import { IApi } from "../types";
import { IProductResponse, IOrder, IOrderResponse } from "../types";

export class AppApi {
  private _api: IApi;
  private _cdnUrl: string;

  constructor(api: IApi, cdnUrl: string) {
    this._api = api;
    this._cdnUrl = cdnUrl;
  }

  async getProducts(): Promise<IProductResponse> {
    const response = await this._api.get('/product');
    const itemsWithImages = response.items.map(item => ({
      ...item,
      image: `${this._cdnUrl}${item.image}`
    }));
        
    return {
      ...response,
      items: itemsWithImages
    };
  }

  async postOrder(order: IOrder): Promise<IOrderResponse> {
    const response = await this._api.post('/order', order);
    return response as IOrderResponse;
  }
}