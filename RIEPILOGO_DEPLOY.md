# 📋 Riepilogo Deploy IMS Dashboard

## File Creati

| File | Descrizione |
|------|-------------|
| `DEPLOY_README.md` | Guida rapida per il deploy |
| `PER_RICCARDO.md` | Istruzioni dettagliate passo-passo |
| `DEPLOY_VERCEL_GUIDA.md` | Guida completa per Vercel + Railway |
| `setup-deploy.sh` | Script di configurazione automatica |
| `backend/.env.example` | Template variabili backend |
| `.env.example` | Template variabili frontend |

## Comandi Utili

### Locale (Sviluppo)
```bash
# Avvia MongoDB
mongod --dbpath /data/db --bind_ip localhost

# Avvia Backend (terminale 1)
cd ims-dashboard/backend
node server.js

# Avvia Frontend (terminale 2)
cd ims-dashboard
npm run dev
```

### Inizializza Database
```bash
cd ims-dashboard/backend
npm run seed
```

### Deploy
```bash
# Configura le variabili d'ambiente
./setup-deploy.sh

# Oppure segui la guida PER_RICCARDO.md
```

## Variabili d'Ambiente

### Backend (Railway)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ims-dashboard
PORT=5000
FRONTEND_URL=https://tuosito.vercel.app
JWT_SECRET=super-segreto
NODE_ENV=production
```

### Frontend (Vercel)
```env
VITE_API_URL=https://tuo-backend-production.up.railway.app/api
```

## URL Dopo il Deploy

| Servizio | URL | Note |
|----------|-----|------|
| Frontend | `https://xxx.vercel.app` | Da Vercel |
| Backend | `https://xxx.up.railway.app` | Da Railway |
| MongoDB | `mongodb+srv://...` | Da Atlas |

## Checklist Deploy

- [ ] Account MongoDB Atlas creato
- [ ] Cluster M0 (FREE) attivo
- [ ] Utente database creato
- [ ] Network Access: 0.0.0.0/0
- [ ] Connection string copiato
- [ ] Account Railway creato
- [ ] Backend deployato su Railway
- [ ] Variabili backend configurate
- [ ] URL backend copiato
- [ ] Account Vercel creato
- [ ] Frontend deployato su Vercel
- [ ] Variabile VITE_API_URL configurata
- [ ] URL frontend copiato
- [ ] FRONTEND_URL aggiornato su Railway
- [ ] Seed del database eseguito
- [ ] Login testato
- [ ] Password admin cambiata

## Costi Mensili

| Servizio | Piano | Costo |
|----------|-------|-------|
| Vercel | Hobby | €0 |
| Railway | Standard | ~€5 (dopo crediti gratuiti) |
| MongoDB Atlas | M0 | €0 |
| **Totale** | | **~€5/mese** |

## Credenziali Demo

```
Email: admin@ims.com
Password: password123
```

⚠️ **Cambia la password dopo il primo accesso!**

---

## Prossimi Passi

1. Leggi `PER_RICCARDO.md` per la procedura dettagliata
2. Esegui il deploy seguendo i passaggi
3. Condividi l'URL con il tuo collega
4. Cambia le password di default

**Tempo stimato totale: 15-20 minuti**
