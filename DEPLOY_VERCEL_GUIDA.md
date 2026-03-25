# Guida al Deploy su Vercel + Railway

## Panoramica
- **Frontend**: Vercel (gratuito)
- **Backend**: Railway (gratuito con limiti mensili)
- **Database**: MongoDB Atlas (gratuito - M0 tier)

## Passo 1: MongoDB Atlas (Database Cloud)

1. Vai su https://www.mongodb.com/cloud/atlas/register
2. Crea un account gratuito
3. Crea un cluster **M0 (Free)**
4. Crea un utente database (Database Access → Add New Database User)
   - Username: `ims_admin`
   - Password: (scegli una password sicura e salvala)
5. Configura l'accesso di rete (Network Access → Add IP Address)
   - Clicca "Allow Access from Anywhere" (0.0.0.0/0)
6. Ottieni il connection string:
   - Clicca "Connect" sul cluster
   - Scegli "Connect your application"
   - Copia il connection string (sembra: `mongodb+srv://ims_admin:<password>@cluster0.xxxxx.mongodb.net/`)

## Passo 2: Deploy Backend su Railway

1. Vai su https://railway.app e crea un account (usa GitHub)
2. Clicca "New Project" → "Deploy from GitHub repo"
3. Connetti il repository `ims-dashboard`
4. Configura il servizio:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   
5. Aggiungi le variabili d'ambiente (Variables):
```
MONGODB_URI=mongodb+srv://ims_admin:LA_TUA_PASSWORD@cluster0.xxxxx.mongodb.net/ims-dashboard?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=https://iltuosito.vercel.app
JWT_SECRET=super-segreto-jwt-cambia-questo-valore
NODE_ENV=production
```

6. Railway deployerà automaticamente il backend
7. Dopo il deploy, copia l'URL del tuo backend (es: `https://ims-backend-production.up.railway.app`)

## Passo 3: Deploy Frontend su Vercel

1. Vai su https://vercel.com e crea un account (usa GitHub)
2. Clicca "Add New" → "Project"
3. Importa il repository `ims-dashboard`
4. Configura il build:
   - **Framework Preset**: Vite
   - **Root Directory**: `ims-dashboard`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Aggiungi le variabili d'ambiente (Settings → Environment Variables):
```
VITE_API_URL=https://iltuosito-production.up.railway.app/api
```
*(Sostituisci con l'URL del tuo backend Railway)*

6. Clicca "Deploy"

## Passo 4: Aggiorna il Backend con l'URL di Vercel

1. Torna su Railway
2. Aggiorna la variabile `FRONTEND_URL` con l'URL del tuo sito Vercel
   - Es: `https://ims-dashboard-xyz.vercel.app`
3. Il backend si riavvierà automaticamente

## Passo 5: Inizializza il Database

Dopo il primo deploy, devi inizializzare il database con l'utente admin:

1. Vai su Railway → Il tuo progetto → Deployments
2. Clicca sul deployment attivo
3. Vai su "Settings" → "Deployments"
4. Clicca sui tre puntini → "View Logs"
5. Per eseguire il seed, hai due opzioni:

**Opzione A - Esegui localmente:**
```bash
cd backend
# Aggiorna .env con il MongoDB URI di Atlas
MONGODB_URI=mongodb+srv://...
npm run seed
```

**Opzione B - Esegui su Railway (con SSH):**
- Installa Railway CLI: `npm i -g @railway/cli`
- `railway login`
- `railway run npm run seed`

## Passo 6: Test del Login

1. Vai sul tuo sito Vercel: `https://ims-dashboard-xyz.vercel.app`
2. Login con:
   - Email: `admin@ims.com`
   - Password: `password123`

## Risoluzione Problemi

### Errore "Failed to fetch" su Vercel
- Verifica che `VITE_API_URL` sia impostato correttamente su Vercel
- Controlla che il backend sia attivo su Railway
- Verifica i log del backend su Railway

### Errore CORS
- Assicurati che `FRONTEND_URL` su Railway sia l'URL corretto di Vercel
- Il backend deve avere l'URL esatto (senza trailing slash)

### Database vuoto
- Esegui il seed come descritto nel Passo 5
- Verifica che il connection string di MongoDB sia corretto

## Costi

| Servizio | Piano | Costo |
|----------|-------|-------|
| Vercel | Hobby | Gratis |
| Railway | Standard | $5/mese (dopo $5 crediti gratuiti) |
| MongoDB Atlas | M0 | Gratis |

## Variabili d'Ambiente Riepilogo

### Backend (Railway):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ims-dashboard
PORT=5000
FRONTEND_URL=https://tuosito.vercel.app
JWT_SECRET=cambia-questo-con-una-stringa-sicura
NODE_ENV=production
```

### Frontend (Vercel):
```env
VITE_API_URL=https://tuo-backend-production.up.railway.app/api
```

## Sicurezza

⚠️ **Importante**: Cambia il `JWT_SECRET` con una stringa casuale sicura prima di andare in produzione!

Genera un segreto sicuro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
