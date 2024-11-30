import Chart from 'chart.js/auto';

export class ChartManager {
  constructor() {
    this.chart = null;
  }

  initChart() {
    const ctx = document.getElementById('movementChart');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  updateChart(movements) {
    if (!this.chart) {
      this.initChart();
    }

    const groupedData = this.groupMovementsByItem(movements);
    const datasets = this.createDatasets(groupedData);
    const allDates = this.getAllDates(movements);

    this.chart.data.labels = allDates.map(date => 
      new Date(date).toLocaleDateString('pt-BR')
    );
    this.chart.data.datasets = datasets;
    this.chart.update();
  }

  groupMovementsByItem(movements) {
    const grouped = {};
    
    movements.forEach(movement => {
      if (!grouped[movement.itemId]) {
        grouped[movement.itemId] = {
          name: movement.itemName,
          movements: []
        };
      }
      grouped[movement.itemId].movements.push(movement);
    });

    return grouped;
  }

  getAllDates(movements) {
    const dates = [...new Set(movements.map(m => 
      new Date(m.timestamp).toLocaleDateString('pt-BR')
    ))];
    return dates.sort((a, b) => new Date(a) - new Date(b));
  }

  createDatasets(groupedData) {
    const colors = [
      '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e74c3c',
      '#1abc9c', '#34495e', '#16a085', '#27ae60', '#2980b9'
    ];

    return Object.entries(groupedData).map(([itemId, data], index) => {
      const color = colors[index % colors.length];
      
      const quantities = this.calculateQuantityOverTime(data.movements);
      
      return {
        label: data.name,
        data: quantities,
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0.4,
        fill: true
      };
    });
  }

  calculateQuantityOverTime(movements) {
    let currentQuantity = 0;
    const quantities = [];

    movements.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    movements.forEach(movement => {
      if (movement.type === 'entrada') {
        currentQuantity = movement.newQuantity;
      } else if (movement.type === 'saída') {
        currentQuantity = movement.newQuantity;
      } else if (movement.type === 'atualização') {
        currentQuantity = movement.newQuantity;
      }
      quantities.push(currentQuantity);
    });

    return quantities;
  }
}