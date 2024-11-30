import { InventoryManager } from './inventory.js';
import { SalesManager } from './sales.js';
import { UI } from './ui.js';
import { AlertSystem } from './alerts.js';

const inventory = new InventoryManager();
const sales = new SalesManager();

function renderInventory() {
  const tbody = document.querySelector('#inventoryTable tbody');
  tbody.innerHTML = inventory.getItems()
    .map(item => UI.createItemRow(item))
    .join('');
}

function handleSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const quantity = document.getElementById('quantity').value;
  const price = document.getElementById('price').value;

  if (!name || !quantity || !price) {
    UI.showMessage('Por favor, preencha todos os campos', 'error');
    return;
  }

  const item = inventory.addItem(name, quantity, price);
  renderInventory();
  
  if (AlertSystem.checkLowStock(Number(quantity))) {
    UI.showMessage(`Item adicionado, mas atenção: estoque baixo (${quantity} unidades)`, 'warning');
  } else {
    UI.showMessage('Item adicionado com sucesso!', 'success');
  }
  
  event.target.reset();
}

window.handleDelete = (id) => {
  inventory.removeItem(id);
  renderInventory();
  UI.showMessage('Item removido com sucesso!', 'success');
};

window.handleIncrementQuantity = (id) => {
  const item = inventory.getItems().find(item => item.id === id);
  if (item) {
    inventory.updateItem(id, item.quantity + 1);
    renderInventory();
    
    if (AlertSystem.checkLowStock(item.quantity + 1)) {
      UI.showMessage(`Quantidade atualizada. Atenção: estoque baixo (${item.quantity + 1} unidades)`, 'warning');
    } else {
      UI.showMessage('Quantidade atualizada com sucesso!', 'success');
    }
  }
};

window.handleDecrementQuantity = (id) => {
  const item = inventory.getItems().find(item => item.id === id);
  if (item && item.quantity > 0) {
    inventory.updateItem(id, item.quantity - 1);
    renderInventory();
    
    if (AlertSystem.checkLowStock(item.quantity - 1)) {
      UI.showMessage(`Quantidade atualizada. Atenção: estoque baixo (${item.quantity - 1} unidades)`, 'warning');
    } else {
      UI.showMessage('Quantidade atualizada com sucesso!', 'success');
    }
  }
};

window.handleSaleQuantityChange = (id, value) => {
  const input = document.querySelector(`input[data-id="${id}"]`);
  const item = inventory.getItems().find(item => item.id === id);
  
  if (item && input) {
    const quantity = Math.min(Math.max(0, Number(value)), item.quantity);
    input.value = quantity;
    updateSaleTotal();
  }
};

window.showHistory = (itemId) => {
  const movements = inventory.getItemHistory(itemId);
  UI.showHistoryModal(movements);
};

window.showSalesHistory = () => {
  const allSales = sales.getSales();
  UI.showSalesHistoryModal(allSales);
};

window.handleNewSale = () => {
  const items = inventory.getItems();
  UI.showSaleModal(items, handleConfirmSale);
};

function handleConfirmSale(saleItems) {
  try {
    inventory.processSale(saleItems);
    const sale = sales.createSale(saleItems);
    renderInventory();
    UI.showMessage('Venda realizada com sucesso!', 'success');
    return true;
  } catch (error) {
    UI.showMessage(error.message, 'error');
    return false;
  }
}

function updateSaleTotal() {
  const total = Array.from(document.querySelectorAll('.sale-item'))
    .reduce((sum, row) => {
      const quantity = Number(row.querySelector('input').value);
      const price = Number(row.querySelector('input').dataset.price);
      return sum + (quantity * price);
    }, 0);

  document.getElementById('saleTotal').textContent = `R$ ${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderInventory();
  document.getElementById('inventoryForm')
    .addEventListener('submit', handleSubmit);
  document.getElementById('showSaleModal')
    .addEventListener('click', handleNewSale);
  document.getElementById('showSalesHistory')
    .addEventListener('click', showSalesHistory);
});