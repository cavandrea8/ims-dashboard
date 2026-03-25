# IMS Dashboard Pro

Sistema di gestione integrato ISO 9001/14001/45001 completo e funzionante.

## 🚀 Caratteristiche

- ✅ **Gestionale Completo** - CRUD reale per tutti i moduli
- ✅ **Upload File** - Carica documenti, allegati, report
- ✅ **Database MongoDB** - Dati persistenti
- ✅ **API REST** - Backend Node.js/Express
- ✅ **Autenticazione** - Login utenti con JWT
- ✅ **Multi-utente** - Tu e il tuo collega potete lavorare insieme

## 📁 Struttura Progetto

```
ims-dashboard/
├── backend/              # Backend Node.js
│   ├── models/           # Modelli MongoDB
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, upload file
│   ├── uploads/          # File caricati
│   ├── config/           # Configurazione DB
│   ├── server.js         # Server Express
│   └── seed.js           # Dati iniziali
├── src/                  # Frontend React
│   ├── App.jsx           # Componente principale
│   ├── api.js            # Chiamate API
│   └── index.css         # Stili Tailwind
├── package.json          # Dipendenze frontend
└── README.md             # Questa guida
```

## 🛠️ Installazione

### 1. Backend

```bash
cd ims-dashboard/backend
npm install
```

Configura MongoDB:
- Modifica `backend/.env` con il tuo MongoDB URI
- Oppure usa MongoDB Atlas (gratis): https://www.mongodb.com/cloud/atlas

Popola il database con dati demo:
```bash
npm run seed
```

Avvia il backend:
```bash
npm run dev
```

### 2. Frontend

```bash
cd ims-dashboard
npm install
npm run dev
```

Il frontend si avvierà su http://localhost:3000

## 🔐 Credenziali Demo

Dopo aver eseguito `npm run seed` nel backend:

| Utente | Email | Password | Ruolo |
|--------|-------|----------|-------|
| Admin | admin@ims.com | password123 | admin |
| User | mario@ims.com | password123 | user |

## 📊 Moduli Disponibili

### Dashboard
- KPI in tempo reale
- Statistiche aggiornate
- Azioni rapide

### Documenti
- Carica documenti (PDF, DOC, DOCX, XLSX)
- Gestione revisioni
- Filtri per ISO e stato
- Download file

### Non Conformità
- Registra NC con gravità
- Traccia azioni correttive
- Monitora scadenze
- Allega documenti

### Azioni Correttive
- Crea azioni (correttive, preventive, miglioramento)
- Monitora avanzamento (%)
- Gestione priorità
- Commenti e allegati

### Audit
- Programma audit interni/esterni
- Gestisci finding e osservazioni
- Calendario audit
- Report e allegati

### Formazione
- Registro corsi
- Partecipanti e ore
- Materiali didattici
- Valutazioni e certificati

## 🌐 Deploy

### Backend (Render/Railway)

1. Crea account su https://render.com o https://railway.app
2. Collega il repository GitHub
3. Configura le variabili d'ambiente:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
4. Deploy automatico

### Frontend (Vercel)

1. Vai su https://vercel.com
2. Importa il repository
3. Imposta `VITE_API_URL` con l'URL del backend
4. Deploy

## 🔧 Tecnologie

| Frontend | Backend | Database |
|----------|---------|----------|
| React 18 | Node.js 18 | MongoDB |
| Tailwind CSS | Express | Mongoose ODM |
| Recharts | JWT Auth | Multer Upload |
| Framer Motion | CORS | bcrypt |

## 📝 Note

- I file caricati sono salvati in `backend/uploads/`
- Per produzione, configura uno storage cloud (AWS S3, Google Cloud Storage)
- Il backend deve essere avviato prima del frontend

## 🆘 Supporto

Per problemi o domande, apri una issue sul repository GitHub.
