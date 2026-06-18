import { IProduct } from "../../types";
import { IEvents } from '../base/Events';

export class CatalogModel {
  private products: IProduct[] = [];
  private previewProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed', { products: this.products });
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  setPreview(product: IProduct): void {
    this.previewProduct = product;
    this.events.emit('catalog:preview-changed');
  }

  getPreview(): IProduct | null {
    return this.previewProduct;
  }
}
