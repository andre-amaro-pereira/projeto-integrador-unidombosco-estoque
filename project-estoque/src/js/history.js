export class HistoryManager {
  static TYPES = {
    ENTRY: 'entrada',
    EXIT: 'saída',
    UPDATE: 'atualização'
  };

  constructor() {
    this.movements = JSON.parse(localStorage.getItem('inventory_history')) || [];
  }

  addMovement(type, item, oldQuantity = null, newQuantity = null) {
    const movement = {
      id: Date.now(),
      type,
      itemId: item.id,
      itemName: item.name,
      timestamp: new Date().toISOString(),
      oldQuantity,
      newQuantity,
      currentPrice: item.price
    };

    this.movements.push(movement);
    this.saveMovements();
    return movement;
  }

  getMovements(itemId = null) {
    if (itemId) {
      return this.movements.filter(movement => movement.itemId === itemId);
    }
    return this.movements;
  }

  saveMovements() {
    localStorage.setItem('inventory_history', JSON.stringify(this.movements));
  }
}