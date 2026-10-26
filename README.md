# Aura: Smart Wealth & Discipline Engine

A modern, institutional-grade personal finance application designed to eliminate false spending confidence. Built with **React**, **Node.js/Express**, and packaged for mobile via **Capacitor Android**.

![Aura Architecture](https://img.shields.io/badge/Architecture-React%20%7C%20Node.js%20%7C%20Capacitor-0B3D2E?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20MVP-00A884?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-0F1F1B?style=for-the-badge)

---

## The Core Problem

Most conventional banking applications show account holders their gross liquid balance. Seeing a large number creates false confidence, leading users into the classic "wealthy on the 1st, broke by the 15th" cycle.

**Aura solves this by separating gross balance from uncommitted liquidity:**

$$\text{Safe-to-Spend} = \text{Liquid Balance} - \text{Committed Bills} - \text{Active Savings Targets}$$

---

## Key Features

### 1. Aura Safe-to-Spend Engine
- Computes uncommitted daily spending allowances in real time.
- Dynamic daily pace: spreads remaining safe liquidity across the remaining days of the month.
- Automatic recalibration: overspending on one day smoothly recalculates the remaining daily allowance without rigid lockouts or punitive UX.

### 2. Goal-Based Savings Vault
- Target Wealth Builder across Emergency, Rent, Tech, and Education categories.
- Automatic timeline pacing: computes weekly and monthly commitments based on 3, 6, or 12-month goals.
- Direct balance transfer: funds move directly from gross liquidity into target goal vaults with real-time insufficient balance protection.

### 3. Category Spending Guardrails
- Customizable spending limits across Food & Dining, Transport, Bills, Shopping, Subscriptions, and Health.
- Visual consumption bars with proactive warnings at the 80% mark and over-budget triggers at 100%.

### 4. Spending Ledger & Financial Activity
- Categorized income and expense logging.
- Automatic transaction synchronization with Safe-to-Spend allowances.
- Instant currency toggle between Nigerian Naira (NGN) and US Dollars (USD).

---

## Tech Stack

- **Frontend**: React 18, Vite, Custom CSS Design System
- **Backend**: Node.js, Express.js REST API
- **Mobile Container**: Capacitor Android (Native APK compilation)
- **Palette**: Deep Emerald (`#0B3D2E`), Vibrant Teal (`#00A884`), Charcoal Noir (`#0F1F1B`), Off-White (`#F8FAF7`)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dev-anna-life/aura-fintech.git
   cd aura-fintech
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server (concurrently runs Express API + Vite Frontend):
   ```bash
   npm run dev
   ```

4. Build production bundle and sync with Android:
   ```bash
   npm run build
   npx cap sync android
   ```

---

## Author

**Annastesia Amarachi Ugwuanyi**  
*Full-Stack Software Engineer*  
[LinkedIn Profile](https://linkedin.com) | [GitHub](https://github.com/dev-anna-life)
