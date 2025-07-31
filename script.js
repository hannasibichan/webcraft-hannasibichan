let Totalexpense = 0;
let totalincome = parseFloat(localStorage.getItem('totalincome')) || 0;
let Totalbalance = 0;

// DOM elements
const incomeT = document.getElementById('incomeT');
const expanse = document.getElementById('expanse');
const balance = document.getElementById('balance');
const incomeform = document.getElementById('incomeform');
const form = document.getElementById('expanseform');
const table = document.getElementById('expansetable');
const clearBtn = document.getElementById('clearTable');

// Chart variables
let expenseLabels = [];
let expenseData = [];

let chartContext = null;
let expenseChart = null;

// 🧮 Update totals on screen
function updateSummary() {
  if (incomeT) incomeT.textContent = "Total Income: Rs. " + totalincome.toFixed(2);
  if (expanse) expanse.textContent = "Total Expense: Rs. " + Totalexpense.toFixed(2);
  Totalbalance = totalincome - Totalexpense;
  localStorage.setItem('totalbalance', Totalbalance);
  if (balance) balance.textContent = "Total Balance: Rs. " + Totalbalance.toFixed(2);
}

// 📊 Update chart based on localStorage
function updateChartFromStorage() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const categoryTotals = {};

  expenses.forEach(entry => {
    const category = entry.item || 'Other';
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += parseFloat(entry.price);
  });

  if (expenseChart) {
    expenseChart.data.labels = Object.keys(categoryTotals);
    expenseChart.data.datasets[0].data = Object.values(categoryTotals);
    expenseChart.update();
  }
}

// 💰 Income submission
if (incomeform) {
  incomeform.addEventListener('submit', function (e) {
    e.preventDefault();
    const incomevalue = parseFloat(document.getElementById('income').value);
    if (!isNaN(incomevalue)) {
      totalincome = incomevalue;
      localStorage.setItem('totalincome', totalincome);
      updateSummary();
      incomeform.reset();
    }
  });
}

// 💸 Expense submission
if (form && table) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const item = document.getElementById('item').value;
    const price = parseFloat(document.getElementById('price').value);
    if (isNaN(price)) return;

    const newRow = table.insertRow(-1);
    newRow.innerHTML = `
      <td>${date}</td>
      <td>${item}</td>
      <td>${price}</td>
      <td><button class="delete-btn">x</button></td>
    `;

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ date, item, price });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    Totalexpense += price;
    localStorage.setItem('totalexpense', Totalexpense);
    updateSummary();
    updateChartFromStorage();
    form.reset();
  });
}

// 🗑 Delete expense row
if (table) {
  table.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('delete-btn')) {
      const row = e.target.closest('tr');
      const price = parseFloat(row.cells[2].textContent);
      const item = row.cells[1].textContent;
      const date = row.cells[0].textContent;

      let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
      expenses = expenses.filter(
        exp => !(exp.date === date && exp.item === item && exp.price == price)
      );
      localStorage.setItem('expenses', JSON.stringify(expenses));

      Totalexpense -= price;
      localStorage.setItem('totalexpense', Totalexpense);
      row.remove();
      updateSummary();
      updateChartFromStorage();
    }
  });
}

// 🧹 Clear entire table and storage
if (clearBtn && table) {
  clearBtn.addEventListener('click', function () {
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }
    localStorage.removeItem('expenses');
    Totalexpense = 0;
    localStorage.setItem('totalexpense', 0);
    updateSummary();
    updateChartFromStorage();
  });
}

// 📦 On page load: load table and chart
window.onload = function () {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  // Load expense table
  if (table) {
    expenses.forEach(entry => {
      const newRow = table.insertRow(-1);
      newRow.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.item}</td>
        <td>${entry.price}</td>
        <td><button class="delete-btn">x</button></td>
      `;
      Totalexpense += parseFloat(entry.price);
    });
  } else {
    Totalexpense = parseFloat(localStorage.getItem('totalexpense')) || 0;
  }

  updateSummary();

  // Initialize chart if canvas is present
  const chartCanvas = document.getElementById('expanseChart');
  if (chartCanvas) {
    chartContext = chartCanvas.getContext('2d');
    expenseChart = new Chart(chartContext, {
      type: 'bar',
      data: {
        labels: expenseLabels,
        datasets: [{
          label: 'Expenses by Category',
          data: expenseData,
          backgroundColor: '#FF6384',
          borderColor: '#FF4C68',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    updateChartFromStorage(); // after chart is created
  }
};