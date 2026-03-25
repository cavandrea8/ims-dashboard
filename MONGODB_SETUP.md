# Guida Configurazione MongoDB Atlas (Gratis)

MongoDB Atlas è un servizio cloud gratuito per MongoDB. Perfetto per il tuo gestionale IMS.

## Passo 1: Crea Account

1. Vai su https://www.mongodb.com/cloud/atlas/register
2. Clicca "Start for Free"
3. Registrati con email o account Google

## Passo 2: Crea Cluster

1. Dopo il login, clicca **"Build a Database"**
2. Scegli **"M0 Sandbox"** (FREE - 512MB)
3. Scegli provider e regione (consiglio AWS - Milan o Frankfurt per velocità)
4. Clicca **"Create Cluster"** (ci vogliono 3-5 minuti)

## Passo 3: Configura Accesso

### 3a. Crea Utente Database
1. Clicca **"Database Access"** nel menu a sinistra
2. **"+ Add New Database User"**
3. Scegli **"Password"** authentication
4. Username: `imsuser`
5. Password: `ims2024password` (o una tua sicura - **segnatela!**)
6. In basso, scegli **"Read and write to any database"**
7. Clicca **"Add User"**

### 3b. Autorizza IP
1. Clicca **"Network Access"** nel menu a sinistra
2. **"+ Add IP Address"**
3. Clicca **"Allow Access from Anywhere"** (0.0.0.0/0) per sviluppo
4. Clicca **"Confirm"**

## Passo 4: Ottieni Connection String

1. Clicca **"Database"** nel menu a sinistra
2. Clicca **"Connect"** sul tuo cluster
3. Scegli **"Connect your application"**
4. Copia la stringa di connessione, esempio:
   ```
   mongodb+srv://imsuser:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Sostituisci `<password>`** con la password che hai creato
6. **Sostituisci il nome database** con `ims-dashboard`

## Passo 5: Configura Backend

Modifica il file `backend/.env`:

```env
MONGODB_URI=mongodb+srv://imsuser:ims2024password@cluster0.abc123.mongodb.net/ims-dashboard?retryWrites=true&w=majority
```

Sostituisci con la TUA stringa di connessione!

## Passo 6: Test Connessione

```bash
cd backend
npm run seed
```

Se vedi "✅ Seed completato con successo!", MongoDB è configurato correttamente!

## Limiti Piano Gratuito

- **512 MB** storage
- **RAM condivisa**
- **Nessun costo** (sempre gratuito)

Per un sistema di gestione integrato, 512MB sono sufficienti per:
- Migliaia di documenti
- Centinaia di NC e azioni
- Anni di storico formazione

## Upgrade (Opzionale)

Se ti serve più spazio in futuro:
- Piano M10: ~$60/mese per 10GB
- Oppure esporta dati e importa su nuovo cluster
