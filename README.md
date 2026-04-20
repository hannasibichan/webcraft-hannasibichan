# SpendSmart — Track. Analyze. Save.

SpendSmart is a high-performance, private expense tracking application built with a modern Neo-Brutalist aesthetic. It allows you to log income, categorized expenses, and visualize your financial health with real-time analytics—all without ever creating an account.

![SpendSmart Dashboard Mockup](https://images.unsplash.com/photo-1554224155-1696413575b8?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **Privacy First:** 100% client-side. Your financial data is stored locally in your browser and never touches a server.
- **Smart Dashboard:** Log income and expenses in seconds. Automatic balance calculation and transaction history.
- **Visual Analytics:** Beautiful Chart.js integration showing category breakdowns and budget-vs-spent ratios.
- **Fully Responsive:** Optimized for everything from small mobile screens to large desktop monitors.
- **Zero Friction:** No sign-up, no login, no subscriptions. Start tracking in under 10 seconds.
- **Neo-Brutalist Design:** A bold, modern interface featuring high-contrast colors, sharp typography, and smooth transitions.

## 🚀 Pages

1. **[Landing Page](index.html):** A professional introduction to the product featuring interactive "Numbers" and "Bento" style feature highlights.
2. **[Dashboard](app.html):** The core tracking area to set income, log expenses, and manage your transaction list.
3. **[Analytics](summary.html):** A deep-dive visualization page with bar charts and doughnut charts for financial insights.

## 🛠️ Technologies Used

- **Frontend:** HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+)
- **Charts:** [Chart.js](https://www.chartjs.org/)
- **Typography:** Sora, Inter, and JetBrains Mono (via Google Fonts)
- **Icons:** Material Symbols Outlined
- **Storage:** Browser `localStorage` API

## 📦 Getting Started

To run SpendSmart locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/hannasibichan/webcraft-hannasibichan.git
   ```
2. Navigate to the project folder.
3. Open `index.html` in any modern web browser.
4. (Optional) Run a local server for the best experience:
   ```bash
   npx serve
   ```

## 📂 Project Structure

```text
├── index.html        # Modern Landing Page
├── app.html          # Main Dashboard
├── summary.html      # Analytics & Charts
├── style.css         # Global Design System (App)
├── home.css          # Landing Page Specific Styles
├── script.js        # Core Transaction & Chart Logic
└── README.md
```

## 🔒 Privacy Note
SpendSmart uses your browser's `localStorage` to save data. Clearing your browser data or formatted storage will reset your dashboard. We recommend exporting your data regularly (feature coming soon!).

---
Built with ❤️ by [Hanna Sibichan](https://github.com/hannasibichan)
