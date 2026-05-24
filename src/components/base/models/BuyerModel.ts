import { IProduct } from "../../../types";

export class BasketModel {
  private _items: IProduct[] = [];

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(product: IProduct): void {
    this._items.push(product);
  }

  removeItem(productId: string): void {
    this._items = this._items.filter(item => item.id !== productId);
  }

  clear(): void {
    this._items = [];
  }

  getTotalPrice(): number {
    return this._items.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  getItemCount(): number {
    return this._items.length;
  }

  hasItem(productId: string): boolean {
    return this._items.some(item => item.id === productId);
  }
}