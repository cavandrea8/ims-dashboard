# 🚀 Deploy Rapido - IMS Dashboard

Per permettere a te e al tuo collega di accedere al gestionale, segui questi passaggi:

## Opzione Veloce (5 minuti)

### 1. MongoDB Atlas (Database)
1. Vai su https://mongodb.com/cloud/atlas/register
2. Registrati con Google/GitHub
3. Crea cluster **FREE M0**
4. Crea utente database (username + password)
5. Network Access → "Allow from Anywhere"
6. Copia il connection string

### 2. Railway (Backend)
1. Vai su https://railway.app
2. Login con GitHub
3. "New Project" → "Deploy from GitHub"
4. Seleziona `workspaces/work`
5. **Settings** → imposta:
   - **Root Directory**: `ims-dashboard/backend`
   - **Start Command**: `npm start`
6. **Variables** → aggiungi:
```
MONGODB_URI=<incolla il tuo connection string di MongoDB>
PORT=5000
FRONTEND_URL=https://ims-dashboard.vercel.app
JWT_SECRET=super-segreto-123456
```
7. Copia l'URL del backend (es: `https://ims-backend-production.up.railway.app`)

### 3. Vercel (Frontend)
1. Vai su https://vercel.com
2. Login con GitHub
3. "Add New" → "Project"
4. Importa `workspaces/work`
5. **Settings** → **Root Directory**: `ims-dashboard`
6. **Settings** → **Environment Variables** → aggiungi:
```
VITE_API_URL=https://<tuo-backend-railway>/api
```
7. **Deploy**

### 4. Inizializza Database
Esegui localmente:
```bash
cd ims-dashboard/backend
# Aggiorna .env con MongoDB URI
npm run seed
```

## Fatto! 🎉

Il tuo collega può accedere a: `https://ims-dashboard.vercel.app`

**Credenziali:**
- Email: `admin@ims.com`
- Password: `password123`

---

## ⚠️ Importante

**Cambia la password dell'utente admin** dopo il primo accesso!

## Supporto

Per la guida dettagliata: [DEPLOY_VERCEL_GUIDA.md](DEPLOY_VERCEL_GUIDA.md)
