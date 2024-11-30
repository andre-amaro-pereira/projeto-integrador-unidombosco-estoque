# Sistema de Controle de Estoque

Um sistema simples e eficiente para gerenciamento de estoque, desenvolvido com HTML, CSS e JavaScript puro. Os dados são persistidos localmente usando localStorage.

## Funcionalidades

- Gerenciamento completo de produtos (CRUD)
- Sistema de alertas para estoque baixo
- Histórico de movimentações
- Registro de vendas
- Interface responsiva e intuitiva

## Estrutura do Projeto

### Módulos Principais

#### `InventoryManager` (inventory.js)
- `addItem(name, quantity, price)`: Adiciona novo item ao estoque
- `removeItem(id)`: Remove item do estoque
- `updateItem(id, quantity)`: Atualiza quantidade do item
- `processSale(saleItems)`: Processa uma venda
- `getItems()`: Retorna todos os itens
- `getItemHistory(itemId)`: Retorna histórico de um item
- `getAllHistory()`: Retorna todo histórico de movimentações

#### `SalesManager` (sales.js)
- `createSale(items)`: Registra nova venda
- `getSales()`: Retorna histórico de vendas
- `saveSales()`: Salva vendas no localStorage

#### `AlertSystem` (alerts.js)
- `checkLowStock(quantity)`: Verifica se estoque está baixo (≤ 5 unidades)
- `getStockStatus(quantity)`: Retorna status e mensagem do estoque

#### `UI` (ui.js)
- `createItemRow(item)`: Cria linha da tabela de produtos
- `createHistoryRow(movement)`: Cria linha do histórico
- `showMessage(message, type)`: Exibe mensagens ao usuário
- `showHistoryModal(movements)`: Modal de histórico
- `showSaleModal(items, onConfirm)`: Modal de vendas
- `showSalesHistoryModal(sales)`: Modal de histórico de vendas

#### `StorageUtil` (storage.js)
- `saveData(key, data)`: Salva dados no localStorage
- `getData(key)`: Recupera dados do localStorage

### Tipos de Movimentação

- `ENTRY`: Entrada de produtos
- `EXIT`: Saída (vendas)
- `UPDATE`: Atualização manual

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Vite (Bundler)
- LocalStorage (Persistência)
- Font Awesome (Ícones)

## Recursos

- Interface moderna e responsiva
- Feedback visual para ações do usuário
- Sistema de alertas para estoque baixo
- Histórico detalhado de movimentações
- Gestão completa de vendas

## Boas Práticas Implementadas

- Modularização do código
- Separação de responsabilidades
- Uso de classes e métodos específicos
- Persistência de dados
- Feedback constante ao usuário
- Validações de entrada