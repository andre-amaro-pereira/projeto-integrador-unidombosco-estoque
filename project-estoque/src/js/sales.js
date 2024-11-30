export class SalesManager {
  constructor() {
    this.sales = JSON.parse(localStorage.getItem('sales')) || [];
  }

  createSale(items) {
    const sale = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      items: items,
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    this.sales.push(sale);
    this.saveSales();
    return sale;
  }

  getSales() {
    return this.sales;
  }

  saveSales() {
    localStorage.setItem('sales', JSON.stringify(this.sales));
  }
}