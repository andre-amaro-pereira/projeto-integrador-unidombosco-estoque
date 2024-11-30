import { StorageUtil } from './storage.js';
import { HistoryManager } from './history.js';

export class InventoryManager {
  constructor() {
    this.items = StorageUtil.getData('inventory') || [];
    this.history = new HistoryManager();
  }

  addItem(name, quantity, price) {
    const item = {
      id: Date.now(),
      name,
      quantity: Number(quantity),
      price: Number(price)
    };
    this.items.push(item);
    this.saveItems();
    
    this.history.addMovement(
      HistoryManager.TYPES.ENTRY,
      item,
      0,
      item.quantity
    );
    
    return item;
  }

  removeItem(id) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      this.history.addMovement(
        HistoryManager.TYPES.EXIT,
        item,
        item.quantity,
        0
      );
    }
    
    this.items = this.items.filter(item => item.id !== id);
    this.saveItems();
  }

  updateItem(id, quantity) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      const oldQuantity = item.quantity;
      item.quantity = Number(quantity);
      this.saveItems();
      
      this.history.addMovement(
        HistoryManager.TYPES.UPDATE,
        item,
        oldQuantity,
        item.quantity
      );
    }
  }

  processSale(saleItems) {
    const errors = [];
    const updates = [];

    // Validate all items first
    for (const saleItem of saleItems) {
      const item = this.items.find(i => i.id === saleItem.id);
      if (!item) {
        errors.push(`Produto "${saleItem.name}" não encontrado no estoque.`);
        continue;
      }
      if (item.quantity < saleItem.quantity) {
        errors.push(`Quantidade insuficiente de "${item.name}" em estoque.`);
        continue;
      }
      updates.push({
        item,
        newQuantity: item.quantity - saleItem.quantity
      });
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    // Process all updates
    for (const update of updates) {
      const { item, newQuantity } = update;
      this.history.addMovement(
        HistoryManager.TYPES.EXIT,
        item,
        item.quantity,
        newQuantity,
        'Venda'
      );
      item.quantity = newQuantity;
    }

    this.saveItems();
    return true;
  }

  saveItems() {
    StorageUtil.saveData('inventory', this.items);
  }

  getItems() {
    return this.items;
  }

  getItemHistory(itemId) {
    return this.history.getMovements(itemId);
  }

  getAllHistory() {
    return this.history.getMovements();
  }
}