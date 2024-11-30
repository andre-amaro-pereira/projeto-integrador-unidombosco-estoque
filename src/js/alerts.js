export class AlertSystem {
  static LOW_STOCK_THRESHOLD = 5;

  static checkLowStock(quantity) {
    return quantity <= this.LOW_STOCK_THRESHOLD;
  }

  static getStockStatus(quantity) {
    if (this.checkLowStock(quantity)) {
      return {
        className: 'low-stock',
        message: `Estoque baixo! Apenas ${quantity} unidade${quantity === 1 ? '' : 's'}`
      };
    }
    return {
      className: '',
      message: ''
    };
  }
}