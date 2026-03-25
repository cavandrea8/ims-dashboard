# IMS Dashboard Backend

Backend per il sistema di gestione integrato ISO 9001/14001/45001.

## Requisiti

- Node.js 18+
- MongoDB (locale o MongoDB Atlas)

## Installazione

```bash
cd backend
npm install
```

## Configurazione

Copia il file `.env.example` in `.env` e modifica le variabili:

```bash
cp .env.example .env
```

Modifica `.env`:
- `MONGODB_URI`: URI di connessione a MongoDB
- `JWT_SECRET`: Chiave segreta per i token JWT
- `PORT`: Porta del server (default: 5000)

## Avvio

### Sviluppo (con auto-reload)

```bash
npm run dev
```

### Produzione

```bash
npm start
```

## Seed Database

Popola il database con dati di esempio:

```bash
npm run seed
```

Credenziali create:
- **Admin**: admin@ims.com / password123
- **User**: mario@ims.com / password123

## API Endpoints

### Auth
- `POST /api/auth/register` - Registra utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/profile` - Profilo utente (protetto)

### Documents
- `GET /api/documents` - Lista documenti
- `GET /api/documents/:id` - Dettaglio documento
- `POST /api/documents` - Crea documento (con upload file)
- `PUT /api/documents/:id` - Aggiorna documento
- `DELETE /api/documents/:id` - Elimina documento

### Non-Conformities
- `GET /api/nonconformities` - Lista NC
- `POST /api/nonconformities` - Crea NC
- `PUT /api/nonconformities/:id` - Aggiorna NC
- `DELETE /api/nonconformities/:id` - Elimina NC

### Actions
- `GET /api/actions` - Lista azioni
- `POST /api/actions` - Crea azione
- `PUT /api/actions/:id` - Aggiorna azione
- `DELETE /api/actions/:id` - Elimina azione
- `POST /api/actions/:id/comments` - Aggiungi commento

### Audits
- `GET /api/audits` - Lista audit
- `POST /api/audits` - Crea audit
- `PUT /api/audits/:id` - Aggiorna audit
- `DELETE /api/audits/:id` - Elimina audit

### Training
- `GET /api/training` - Lista corsi
- `POST /api/training` - Crea corso
- `PUT /api/training/:id` - Aggiorna corso
- `DELETE /api/training/:id` - Elimina corso

## Upload File

I file vengono salvati in `backend/uploads/` e sono accessibili tramite:
```
http://localhost:5000/uploads/[tipo]/[nome-file]
```

## Struttura Database

### Collezioni
- `users` - Utenti del sistema
- `documents` - Documenti
- `nonconformities` - Non conformità
- `actions` - Azioni correttive/preventive
- `audits` - Audit
- `trainings` - Formazione

## Sicurezza

- Password hashate con bcrypt
- Token JWT per autenticazione
- CORS configurato per il frontend
