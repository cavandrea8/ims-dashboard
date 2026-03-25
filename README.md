# IMS Dashboard - Sistema di Gestione Integrato

Dashboard React per la gestione dei sistemi ISO 9001, 14001 e 45001.

## Struttura Progetto

```
ims-dashboard/
├── index.html          # HTML principale
├── package.json        # Dipendenze e script
├── vite.config.js      # Configurazione Vite
├── tailwind.config.js  # Configurazione Tailwind CSS
├── postcss.config.js   # Configurazione PostCSS
└── src/
    ├── main.jsx        # Entry point React
    ├── App.jsx         # Componente principale dashboard
    └── index.css       # Stili Tailwind
```

## Comandi Disponibili

```bash
# Avvia server di sviluppo (http://localhost:3000)
npm run dev

# Build per produzione
npm run build

# Anteprima build produzione
npm run preview

# Deploy su Vercel
vercel
```

## Dipendenze

- **React 18** - Framework UI
- **Recharts** - Libreria grafici
- **Lucide React** - Icone
- **Framer Motion** - Animazioni
- **Tailwind CSS** - Stili

## 🚀 Deploy su Vercel

### Primo Deploy

```bash
# 1. Installa Vercel CLI globalmente
npm install -g vercel

# 2. Naviga nella cartella del progetto
cd ims-dashboard

# 3. Esegui il deploy
vercel
```

Al primo comando ti verrà chiesto di:
1. Accedere o creare un account Vercel (gratuito)
2. Confermare il progetto
3. Il deploy sarà pubblicato su `https://ims-dashboard-xxx.vercel.app`

### Condividi con il Collega

Dopo il deploy, ricevi un URL come:
```
https://ims-dashboard-xyz.vercel.app
```

Invia questo link al tuo collega: può accedere immediatamente, da qualsiasi dispositivo.

### Deploy Successivi

```bash
vercel --prod
```

---

## Avvio Rapido

```bash
cd ims-dashboard
npm install
npm run dev
```

Il server si avvierà su `http://localhost:3000`
