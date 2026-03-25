# Guida Deploy Completo

Pubblica il tuo gestionale IMS online gratuitamente!

## 📋 Panoramica

- **Frontend**: Vercel (gratis, illimitato)
- **Backend**: Railway (gratis, $5 credito/mese)
- **Database**: MongoDB Atlas (gratis, 512MB)

---

## Passo 1: MongoDB Atlas

Segui la guida in `MONGODB_SETUP.md` per creare il database cloud.

**Importante**: Salva la connection string!

---

## Passo 2: Deploy Backend su Railway

### 2a. Crea Account Railway

1. Vai su https://railway.app
2. Login con GitHub

### 2b. Crea Nuovo Progetto

1. Clicca **"New Project"**
2. Scegli **"Deploy from GitHub repo"**
3. Seleziona il repository `ims-dashboard`

### 2c. Configura Variabili d'Ambiente

Nel pannello Railway, vai su **"Variables"** e aggiungi:

```
MONGODB_URI=mongodb+srv://... (la tua stringa Atlas)
JWT_SECRET=super-secret-key-cambia-questa-stringa
PORT=5000
FRONTEND_URL=https://ims-dashboard-inky.vercel.app (il tuo URL Vercel)
NODE_ENV=production
```

### 2d. Deploy

Railway deploya automaticamente! 

1. Attendi che il build completi (~2 minuti)
2. Clicca **"Generate Domain"** per avere un URL pubblico
3. Copia l'URL (es: `https://ims-backend-production.up.railway.app`)

### 2e. Test API

Apri nel browser:
```
https://ims-backend-production.up.railway.app/api/health
```

Dovresti vedere: `{"status":"ok","message":"IMS Dashboard API is running"}`

---

## Passo 3: Deploy Frontend su Vercel

### 3a. Aggiorna API URL

Modifica `ims-dashboard/.env`:

```env
VITE_API_URL=https://ims-backend-production.up.railway.app/api
```

### 3b. Commit e Push

```bash
cd /workspaces/work/ims-dashboard
git add .
git commit -m "Update API URL for production"
git push
```

### 3c. Deploy su Vercel

Vercel deploya automaticamente quando fai push su GitHub!

1. Vai su https://vercel.com/dashboard
2. Trova il progetto `ims-dashboard`
3. Il deploy è automatico (aspetta 1-2 minuti)

### 3d. Test Frontend

Apri il tuo URL Vercel:
```
https://ims-dashboard-inky.vercel.app
```

Login con:
- Email: admin@ims.com
- Password: password123

---

## ✅ Fatto!

Ora il tuo gestionale è online e accessibile da:
- **Tu**: https://ims-dashboard-inky.vercel.app
- **Il tuo collega**: Stesso URL, condividete il database!

---

## 🔄 Aggiornamenti

Ogni volta che modifichi il codice:

```bash
# Fai le modifiche...

git add .
git commit -m "Descrizione modifiche"
git push
```

- **Vercel**: Deploy automatico (~1 minuto)
- **Railway**: Deploy automatico (~2 minuti)

---

## 📊 Monitoraggio

### Railway (Backend)
- https://railway.app/project
- Vedi log, utilizzo risorse, riavvia il servizio

### Vercel (Frontend)
- https://vercel.com/dashboard
- Vedi analytics, deploy history

### MongoDB Atlas (Database)
- https://cloud.mongodb.com
- Vedi dati, collezioni, backup

---

## 🆘 Risoluzione Problemi

### Il frontend non si connette al backend?

Controlla che `VITE_API_URL` nel file `.env` sia corretto:
```env
VITE_API_URL=https://tuo-backend.railway.app/api
```

Poi rideploy:
```bash
git add . && git commit -m "Fix API URL" && git push
```

### Il backend è down?

Railway piano free:
- Il servizio va in sleep dopo inattività
- Al primo request si riattiva (~30 secondi)
- Oppure upgrade a $5/mese per sempre attivo

### Errori di CORS?

Assicurati che `FRONTEND_URL` nel backend sia corretto:
```env
FRONTEND_URL=https://ims-dashboard-inky.vercel.app
```

---

## 💰 Costi

| Servizio | Piano | Costo |
|----------|-------|-------|
| Vercel | Hobby | $0 |
| Railway | Trial | $5 credito/mese |
| MongoDB Atlas | M0 | $0 |

**Totale**: $0/mese (o $5/mese se vuoi backend sempre attivo)
