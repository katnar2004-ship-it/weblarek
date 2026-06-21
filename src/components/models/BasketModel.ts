import { IProduct } from "../../types";
import { IEvents } from '../base/Events';

export class BasketModel {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    const exists = this.items.some(item => item.id === product.id);
    if (!exists) {
      this.items.push(product);
      this.emitChange();
    }
  }

  removeItem(productId: string): void {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== productId);
    if (initialLength !== this.items.length) {
      this.emitChange();
    }
  }

  clear(): void {
    if (this.items.length > 0) {
      this.items = [];
      this.emitChange();
    }
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }

  private emitChange(): void {
    this.events.emit('basket:changed');
  }
}