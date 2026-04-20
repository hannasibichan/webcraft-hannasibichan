/* ════════════════════════════════════════
   SpendSmart — script.js
   Works with both index.html (dashboard)
   and summary.html (analytics)
   ════════════════════════════════════════ */

let Totalexpense = 0;
let totalincome = parseFloat(localStorage.getItem('totalincome')) || 0;
let Totalbalance = 0;

// DOM elements
const incomeT = document.getElementById('incomeT');
const expanse = document.getElementById('expanse');
const balance = document.getElementById('balance');
const incomeform = document.getElementById('incomeform');
const form = document.getElementById('expanseform');
// Support both old (#expansetable) and new (#table-body) structures
const tableBody = document.getElementById('table-body') || document.getElementById('expansetable');
const clearBtn = document.getElementById('clearTable');

// Chart vars (summary page)
let expenseLabels = [];
let expenseData = [];
let chartContext = null;
let expenseChart = null;

// ── Update summary numbers ──
function updateSummary() {
    if (incomeT) incomeT.textContent = 'Rs. ' + totalincome.toFixed(2);
    if (expanse) expanse.textContent = 'Rs. ' + Totalexpense.toFixed(2);
    Totalbalance = totalincome - Totalexpense;
    localStorage.setItem('totalbalance', Totalbalance);
    if (balance) balance.textContent = 'Rs. ' + Totalbalance.toFixed(2);
}

// ── Build a table row ──
function buildRow(date, item, price) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${date}</td>
        <td>${item}</td>
        <td>Rs. ${parseFloat(price).toFixed(2)}</td>
        <td><button class="delete-btn" title="Delete">✕</button></td>
    `;
    return tr;
}

// ── Chart update ──
function updateChartFromStorage() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const categoryTotals = {};
    expenses.forEach(entry => {
        const cat = entry.item || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(entry.price);
    });
    if (expenseChart) {
        expenseChart.data.labels = Object.keys(categoryTotals);
        expenseChart.data.datasets[0].data = Object.values(categoryTotals);
        expenseChart.update();
    }
    // expose globally so summary.html can style it
    window.expenseChart = expenseChart;
}

// ── Income form ──
if (incomeform) {
    incomeform.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = parseFloat(document.getElementById('income').value);
        if (!isNaN(val) && val >= 0) {
            totalincome = val;
            localStorage.setItem('totalincome', totalincome);
            updateSummary();
            incomeform.reset();
        }
    });
}

// ── Expense form ──
if (form && tableBody) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const item = document.getElementById('item').value.trim();
        const price = parseFloat(document.getElementById('price').value);
        if (!date || !item || isNaN(price) || price < 0) return;

        tableBody.appendChild(buildRow(date, item, price));

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

// ── Delete row (event delegation) ──
if (tableBody) {
    tableBody.addEventListener('click', function (e) {
        if (!e.target.classList.contains('delete-btn')) return;
        const row = e.target.closest('tr');
        // price is in td[2], strip "Rs. " prefix
        const price = parseFloat(row.cells[2].textContent.replace(/[^0-9.-]/g, ''));
        const item = row.cells[1].textContent;
        const date = row.cells[0].textContent;

        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = expenses.filter(exp =>
            !(exp.date === date && exp.item === item && parseFloat(exp.price) === price)
        );
        localStorage.setItem('expenses', JSON.stringify(expenses));

        Totalexpense -= price;
        if (Totalexpense < 0) Totalexpense = 0;
        localStorage.setItem('totalexpense', Totalexpense);
        row.remove();
        updateSummary();
        updateChartFromStorage();
    });
}

// ── Clear all ──
if (clearBtn && tableBody) {
    clearBtn.addEventListener('click', function () {
        if (!confirm('Clear all expense records? This cannot be undone.')) return;
        tableBody.innerHTML = '';
        localStorage.removeItem('expenses');
        Totalexpense = 0;
        localStorage.setItem('totalexpense', 0);
        updateSummary();
        updateChartFromStorage();
    });
}

// ── On page load ──
window.onload = function () {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    if (tableBody) {
        // Clear existing rows (except header if it's a <table> not <tbody>)
        if (tableBody.tagName === 'TBODY') {
            tableBody.innerHTML = '';
        }
        expenses.forEach(entry => {
            tableBody.appendChild(buildRow(entry.date, entry.item, entry.price));
            Totalexpense += parseFloat(entry.price);
        });
    } else {
        Totalexpense = parseFloat(localStorage.getItem('totalexpense')) || 0;
    }

    updateSummary();

    // Chart (summary page)
    // Chart (summary page)
    const chartCanvas = document.getElementById('expanseChart');
    if (chartCanvas) {
        chartContext = chartCanvas.getContext('2d');
        expenseChart = new Chart(chartContext, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Category Spend',
                    data: [],
                    backgroundColor: ['#3b82f6', '#10d98e', '#f43f5e', '#f59e0b', '#a78bfa', '#06d6a0', '#fb7185'],
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#6b7a9e', font: { family: 'JetBrains Mono', size: 12 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#6b7a9e', font: { family: 'JetBrains Mono' } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6b7a9e', font: { family: 'JetBrains Mono' } }
                    }
                }
            }
        });
        window.expenseChart = expenseChart;
        updateChartFromStorage();
    }
};