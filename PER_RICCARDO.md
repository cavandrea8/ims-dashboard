# 🎯 Procedura per Rendere il Sito Accessibile al Tuo Collega

## Situazione Attuale
- ✅ Frontend attivo localmente su http://localhost:3000
- ✅ Backend attivo localmente su http://localhost:5000
- ✅ MongoDB attivo localmente su mongodb://localhost:27017
- ❌ Non accessibile da internet

## Soluzione: Deploy su Vercel + Railway

### Cosa Serve
1. **Account GitHub** (ce l'hai già)
2. **Account Vercel** (gratis, login con GitHub)
3. **Account Railway** (gratis con $5 crediti/mese)
4. **MongoDB Atlas** (gratis, 512MB)

### Tempo Stimato: 15-20 minuti

---

## Passo-passo Dettagliato

### 1️⃣ MongoDB Atlas (5 min)

```
https://www.mongodb.com/cloud/atlas/register
```

1. Clicca "Start for Free"
2. Login con Google o GitHub
3. Clicca "Build a Database"
4. Scegli **M0 FREE** (Free Forever)
5. Provider: AWS, Region: Ireland (eu-west-1)
6. Clicca "Create"
7. **Database Access** (sidebar sinistra):
   - Click "Add New Database User"
   - Authentication: Password
   - Username: `ims_admin`
   - Password: (clicca "Autogenerate" e SALVALA)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
8. **Network Access** (sidebar sinistra):
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"
9. **Database** (sidebar sinistra):
   - Click "Connect" sul cluster
   - Scegli "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - **COPIA LA CONNECTION STRING**
   - Sostituisci `<password>` con la password generata

La stringa sarà simile a:
```
mongodb+srv://ims_admin:AbCdEfGhIjKlMnOp@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

---

### 2️⃣ Railway Backend (5 min)

```
https://railway.app
```

1. Login con GitHub
2. Click "New Project"
3. "Deploy from GitHub repo"
4. Cerca `work` o `ims-dashboard` e selezionalo
5. **IMPORTANTE**: Dopo il deploy iniziale, vai su **Settings** del servizio:
   - **Root Directory**: `ims-dashboard/backend`
   - **Start Command**: `npm start`
6. Vai su **Variables** e aggiungi:

| Name | Value |
|------|-------|
| `MONGODB_URI` | La connection string di MongoDB Atlas |
| `PORT` | `5000` |
| `FRONTEND_URL` | `https://vercel.app` (lo cambi dopo) |
| `JWT_SECRET` | `super-segreto-xyz-123` |

7. Torna su **Deployments** e clicca "Deploy" per riavviare

8. **Copia l'URL del backend** (in alto, tipo):
   ```
   https://ims-backend-production.up.railway.app
   ```

---

### 3️⃣ Vercel Frontend (5 min)

```
https://vercel.com
```

1. Login con GitHub
2. Click "Add New" → "Project"
3. Cerca `work` e importalo
4. **Configure Project**:
   - **Root Directory**: Click "Edit" → scrivi `ims-dashboard`
   - **Framework Preset**: Vite (dovrebbe rilevarlo automaticamente)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables** (click "Add"):
   - Name: `VITE_API_URL`
   - Value: `https://<tuo-backend-railway>/api`
   - (Sostituisci con l'URL di Railway dal passo 2)
6. Click **"Deploy"**
7. Attendi 1-2 minuti per il build
8. **Copia l'URL del sito** (tipo):
   ```
   https://ims-dashboard-abc123.vercel.app
   ```

---

### 4️⃣ Aggiorna Railway (2 min)

1. Torna su Railway
2. Vai su **Variables** del backend
3. Aggiorna `FRONTEND_URL` con l'URL di Vercel:
   ```
   FRONTEND_URL=https://ims-dashboard-abc123.vercel.app
   ```
4. Il deploy si riavvierà automaticamente

---

### 5️⃣ Inizializza Database (3 min)

Devi inserire l'utente admin nel database:

**Opzione A - Locale (più semplice):**
```bash
cd /workspaces/work/ims-dashboard/backend

# Crea/modifica .env con MongoDB Atlas
cat > .env << EOF
MONGODB_URI=mongodb+srv://ims_admin:PASSWORD@cluster0.abc123.mongodb.net/ims-dashboard
EOF

# Esegui il seed
npm run seed
```

**Opzione B - Railway CLI:**
```bash
npm i -g @railway/cli
railway login
cd ims-dashboard/backend
railway run npm run seed
```

---

## ✅ Fatto!

### Condividi con il tuo collega:

**URL del sito:**
```
https://ims-dashboard-abc123.vercel.app
```

**Credenziali:**
- Email: `admin@ims.com`
- Password: `password123`

---

## 🔒 Sicurezza (Importante!)

1. **Cambia il JWT_SECRET** su Railway con uno generato casualmente:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Cambia la password di admin** dopo il primo login

3. **Non condividere mai** il connection string di MongoDB

---

## 🆘 Risoluzione Problemi

### "Failed to fetch" su Vercel
- Controlla che `VITE_API_URL` sia corretto su Vercel
- Verifica che il backend sia attivo su Railway
- Controlla i log su Railway

### Errore CORS
- Assicurati che `FRONTEND_URL` su Railway sia esatto
- Non includere `/api` in `FRONTEND_URL`

### Login non funziona
- Esegui `npm run seed` per inizializzare il database
- Controlla i log del backend su Railway

---

## 📞 Supporto

Se hai problemi, leggi la guida completa: [DEPLOY_VERCEL_GUIDA.md](DEPLOY_VERCEL_GUIDA.md)
