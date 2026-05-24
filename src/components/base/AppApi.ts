import { IApi } from "../../types";
import { IProductResponse, IOrder, IOrderResponse } from "../../types";

export class AppApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProducts(): Promise<IProductResponse> {
    try {
      const response = await this._api.get('/product');
      return response as IProductResponse;
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
      throw error;
    }
  }

  async postOrder(order: IOrder): Promise<IOrderResponse> {
    try {
      const response = await this._api.post('/order', order);
      return response as IOrderResponse;
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      throw error;
    }
  }
}