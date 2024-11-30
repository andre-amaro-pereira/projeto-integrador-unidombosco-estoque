import { AlertSystem } from './alerts.js';
import { HistoryManager } from './history.js';

export class UI {
  static createItemRow(item) {
    const stockStatus = AlertSystem.getStockStatus(item.quantity);
    
    return `
      <tr data-id="${item.id}" class="${stockStatus.className}">
        <td>
          ${item.name}
          ${stockStatus.message ? `<div class="stock-warning">${stockStatus.message}</div>` : ''}
        </td>
        <td class="quantity-cell">
          <div class="quantity-controls">
            <button onclick="window.handleDecrementQuantity(${item.id})" class="quantity-btn" ${item.quantity <= 0 ? 'disabled' : ''}>
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-display">${item.quantity}</span>
            <button onclick="window.handleIncrementQuantity(${item.id})" class="quantity-btn">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </td>
        <td>R$ ${item.price.toFixed(2)}</td>
        <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
        <td>
          <button onclick="window.handleDelete(${item.id})" class="delete-btn" title="Excluir">
            <i class="fas fa-trash"></i>
          </button>
          <button onclick="window.showHistory(${item.id})" class="history-btn" title="Histórico">
            <i class="fas fa-history"></i>
          </button>
        </td>
      </tr>
    `;
  }

  static createHistoryRow(movement) {
    const date = new Date(movement.timestamp).toLocaleString('pt-BR');
    let quantityChange;
    
    switch (movement.type) {
      case HistoryManager.TYPES.ENTRY:
        quantityChange = `+${movement.newQuantity}`;
        break;
      case HistoryManager.TYPES.EXIT:
        quantityChange = `-${movement.oldQuantity - movement.newQuantity}`;
        break;
      case HistoryManager.TYPES.UPDATE:
        const difference = movement.newQuantity - movement.oldQuantity;
        quantityChange = `${difference >= 0 ? '+' : ''}${difference}`;
        break;
      default:
        quantityChange = `${movement.oldQuantity} → ${movement.newQuantity}`;
    }

    return `
      <tr>
        <td>${date}</td>
        <td>${movement.itemName}</td>
        <td>${movement.type}</td>
        <td>${quantityChange}</td>
        <td>R$ ${movement.currentPrice.toFixed(2)}</td>
      </tr>
    `;
  }

  static showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 3000);
  }

  static showHistoryModal(movements) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Histórico de Movimentações</h2>
        <table class="history-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
            </tr>
          </thead>
          <tbody>
            ${movements.map(m => UI.createHistoryRow(m)).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();
    
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    };
  }

  static showSaleModal(items, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Nova Venda</h2>
        <div class="sale-items">
          ${items.map(item => `
            <div class="sale-item">
              <span>${item.name}</span>
              <input type="number" 
                     class="sale-item-quantity" 
                     min="0" 
                     max="${item.quantity}"
                     value="0"
                     data-id="${item.id}"
                     data-price="${item.price}"
                     onchange="window.handleSaleQuantityChange(${item.id}, this.value)">
              <span>Disponível: ${item.quantity}</span>
              <span>R$ ${item.price.toFixed(2)}/un</span>
            </div>
          `).join('')}
        </div>
        <div class="sale-total">
          Total: <span id="saleTotal">R$ 0,00</span>
        </div>
        <div class="sale-actions">
          <button class="cancel-sale">Cancelar</button>
          <button class="confirm-sale">Confirmar Venda</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-sale');
    const confirmBtn = modal.querySelector('.confirm-sale');

    const close = () => modal.remove();

    closeBtn.onclick = close;
    cancelBtn.onclick = close;

    confirmBtn.onclick = () => {
      const saleItems = Array.from(modal.querySelectorAll('.sale-item'))
        .map(row => {
          const input = row.querySelector('input');
          const quantity = Number(input.value);
          if (quantity > 0) {
            return {
              id: Number(input.dataset.id),
              quantity,
              price: Number(input.dataset.price),
              name: row.querySelector('span').textContent
            };
          }
          return null;
        })
        .filter(item => item !== null);

      if (saleItems.length === 0) {
        UI.showMessage('Selecione pelo menos um item para venda', 'error');
        return;
      }

      if (onConfirm(saleItems)) {
        close();
      }
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        close();
      }
    };
  }

  static showSalesHistoryModal(sales) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Histórico de Vendas</h2>
        <table class="history-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Itens</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${sales.map(sale => `
              <tr>
                <td>${new Date(sale.timestamp).toLocaleString('pt-BR')}</td>
                <td>
                  ${sale.items.map(item => 
                    `${item.name} (${item.quantity}x R$ ${item.price.toFixed(2)})`
                  ).join('<br>')}
                </td>
                <td>R$ ${sale.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();
    
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    };
  }
}