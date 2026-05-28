import { IApi } from "../types";
import { IProductResponse, IOrder, IOrderResponse } from "../types";

export class AppApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProducts(): Promise<IProductResponse> {
    const response = await this._api.get('/product');
    return response as IProductResponse;
  }

  async postOrder(order: IOrder): Promise<IOrderResponse> {
    const response = await this._api.post('/order', order);
    return response as IOrderResponse;
  }
}