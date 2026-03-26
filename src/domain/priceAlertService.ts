type Product = {
  id: string;
  currentPrice: number | null;
  targetPrice: number;
  lastNotifiedPrice: number | null;
};

type PriceData = {
  price: number;
};

export class PriceAlertService {
  static evaluate(product: Product, data: PriceData) {
    const hasPrice = product.currentPrice !== null;

    const priceChanged = hasPrice ? product.currentPrice !== data.price : true;

    const shouldAlert =
      data.price <= product.targetPrice &&
      data.price !== product.lastNotifiedPrice;

      return{
        priceChanged,
        shouldAlert
      }
  }
}
