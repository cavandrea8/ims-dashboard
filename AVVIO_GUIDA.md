# Guida all'Avvio di IMS Dashboard

## Problema Risolto
L'errore "Failed to fetch" durante il login era causato dal backend non in esecuzione.

## Requisiti
- Node.js 18+
- MongoDB 7.0+

## Avvio Rapido (Sviluppo)

### 1. Avviare MongoDB
```bash
# Se MongoDB è installato localmente
mongod --dbpath /data/db --bind_ip localhost

# Oppure usa MongoDB Atlas (cloud gratuito)
# https://www.mongodb.com/cloud/atlas/register
```

### 2. Avviare il Backend
```bash
cd /workspaces/work/ims-dashboard/backend
npm install
npm run dev
```
Il backend sarà disponibile su: `http://localhost:5000`

### 3. Avviare il Frontend (nuovo terminale)
```bash
cd /workspaces/work/ims-dashboard
npm install
npm run dev
```
Il frontend sarà disponibile su: `http://localhost:3000`

## Script di Avvio Automatico

È stato creato uno script `start.sh` che avvia tutti i servizi:

```bash
./start.sh
```

## Configurazione MongoDB Atlas (Alternativa Cloud)

Se non vuoi installare MongoDB localmente:

1. Crea un account gratuito su [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crea un cluster gratuito (M0)
3. Ottieni il connection string
4. Aggiorna il file `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ims-dashboard?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=il-tuo-segreto-jwt-personalizzato
```

## Credenziali Demo
- Email: `admin@ims.com`
- Password: `password123`

## Risoluzione Problemi

### Errore "Failed to fetch"
- Assicurati che il backend sia in esecuzione su `http://localhost:5000`
- Verifica che MongoDB sia connesso
- Controlla i log del backend: `cat /tmp/backend.log`

### Porta 3000 già in uso
Il frontend userà automaticamente la porta 3001

### MongoDB non si avvia
- Verifica che la directory `/data/db` esista e abbia i permessi corretti
- Prova a eliminare il file di lock: `rm /data/db/mongod.lock`

## Struttura del Progetto
```
ims-dashboard/
├── backend/          # Server Express API
│   ├── config/       # Configurazione database
│   ├── middleware/   # Middleware (auth, etc.)
│   ├── models/       # Modelli Mongoose
│   ├── routes/       # Rotte API
│   └── server.js     # Entry point backend
├── src/              # Codice React frontend
├── api.js            # Client API
└── start.sh          # Script di avvio
```

## Porte Utilizzate
- **3000**: Frontend (Vite Dev Server)
- **5000**: Backend (Express API)
- **27017**: MongoDB
