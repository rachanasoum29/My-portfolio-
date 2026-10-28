# Luxury Editorial Portfolio & SaaS Admin Dashboard

A modular, full-stack ready React + Tailwind CSS portfolio application strictly split into two completely separate systems:
1. **Public Editorial Portfolio Website** (`src/components/PortfolioWebsite.jsx`)
2. **Standalone SaaS Admin Management Console** (`src/components/AdminPanel.jsx`)
3. Synchronized in real-time via `localStorage` (`src/data/sharedData.js`)

---

## 🏛 Technical Architecture & File Structure

```text
My-portfolio-/
├── index.html                       # HTML5 entry with Playfair, Bodoni Moda & Plus Jakarta fonts
├── package.json                     # Dependencies & scripts (React, Tailwind, Vite)
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Editorial theme tokens (cream, oxblood, sand)
├── vite.config.js                   # Vite dev server configuration
├── README.md                        # Project documentation
└── src/
    ├── index.css                    # Tailwind directives & luxury editorial scrollbars
    ├── main.jsx                     # React root mount
    ├── App.jsx                      # Top-level switcher & hash-router (#admin / #portfolio)
    ├── data/
    │   └── sharedData.js            # Storage keys, initial fallback data, and sync helpers
    └── components/
        ├── PortfolioWebsite.jsx     # High-fashion luxury editorial print portfolio
        ├── AdminPanel.jsx           # Standalone SaaS admin dashboard & PIN lock console
        └── sharedData.js            # Module proxy re-export for flexible imports
```

---

## 🎨 System 1: Public Editorial Portfolio Website

- **Aesthetic**: Luxury editorial print design inspired by high-fashion portfolios with Bodoni Moda / Playfair Display headlines and clean Plus Jakarta Sans body typography.
- **Color Palette**:
  - Warm Paper Ecru/Cream: `#F4EFE6`
  - Deep Oxblood / Burgundy Accents: `#460C14`
  - Neutral Sand Borders: `#E3DAC9`
- **Sections**:
  1. **Sticky Top Navigation**: Monogram brand badge, "Get In Touch" action, and discrete "Admin Portal" gateway button.
  2. **Hero Section**: Massive centered `PORTFOLIO` serif title, italic subtitle name, stacked uppercase `UX/UI WEB DESIGNER` role tag, and an overlapping arched cutout model portrait with depth gradient.
  3. **About Me Block**: Deep burgundy card container featuring an English biography, a geometric 5x5 checkerboard mosaic grid graphic, an architectural portrait frame, and a white pill capsule displaying software tool icons (Figma, Photoshop, Illustrator, After Effects, Tilda, Cinema 4D, Protopie).
  4. **Selected Works**: 6-item bento grid layout with aspect-square preview thumbnails, title, category tags, hover micro-interactions, and a case-study modal popup with live demo links.
  5. **Contact Modal & Dispatch**: Popup form (Name, Email, Message) saving directly to `localStorage` under the admin inbox key with immediate success toast.
  6. **Footer Banner**: Deep burgundy bar displaying contact channels (Telegram, Phone, Email).

---

## 🛠 System 2: Standalone SaaS Admin Dashboard

- **Security & PIN Protection**:
  - Gated with a PIN lock screen (Default PIN: `1234`).
  - Change PIN in Settings with custom credentials.
- **Dashboard Overview**:
  - Real-time KPI counters (Works count, Tools count, Total Inquiries, Unread notifications).
  - Public persona preview card.
  - Recent inquiries feed.
- **Works & Projects CRUD**:
  - Add, edit, preview, and delete project showcases.
  - Image preview, category tags, live demo links.
- **Profile & Bio Customizer**:
  - Real-time editing for name, title, headline, biography, contact handles, and image URLs.
  - Side-by-side visual preview cards.
- **Skills & Tools Stack**:
  - Manage the tools inside the white pill capsule.
  - Quick icon picker presets (❖ Figma, Ps Photoshop, Ai Illustrator, Ae After Effects, etc.).
- **Client Dispatch Inbox**:
  - Review all client messages sent from the public website contact popup.
  - Mark as read/unread, direct email reply button (`mailto:`), and message deletion.
- **Backup & Reset**:
  - Export full portfolio state as `.json`.
  - Restore state from `.json` backup.
  - Reset to initial factory defaults.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

- To access the public website: `http://localhost:3000/` or `http://localhost:3000/#portfolio`
- To access the admin console: `http://localhost:3000/#admin` (or click **⚙ Admin Portal** in the header)
- Default Admin PIN: **`1234`**
