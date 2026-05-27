import { IProduct } from "../../../types";

export class CatalogModel {
  private products: IProduct[] = [];
  private previewProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  setPreview(product: IProduct): void {
    this.previewProduct = product;
  }

  getPreview(): IProduct | null {
    return this.previewProduct;
  }
}
