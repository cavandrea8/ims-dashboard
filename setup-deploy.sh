#!/bin/bash

# Script di configurazione per il deploy su Vercel + Railway
echo "=== IMS Dashboard - Configurazione Deploy ==="
echo ""

# Chiedi all'utente le informazioni necessarie
read -p "Hai già un account MongoDB Atlas? (y/n): " has_mongo
if [ "$has_mongo" != "y" ]; then
    echo ""
    echo "1️⃣  Vai su https://www.mongodb.com/cloud/atlas/register"
    echo "2️⃣  Crea un account gratuito"
    echo "3️⃣  Crea un cluster M0 (Free)"
    echo "4️⃣  Crea un utente database"
    echo "5️⃣  Ottieni il connection string"
    echo ""
    read -p "Premi Invio quando hai finito..."
fi

echo ""
echo "Inserisci il MongoDB connection string:"
read -p "> " MONGODB_URI

echo ""
echo "Generazione JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✅ JWT Secret generato: $JWT_SECRET"

echo ""
echo "Inserisci l'URL del frontend Vercel (lo avrai dopo il deploy su Vercel):"
read -p "> " FRONTEND_URL

# Crea il file .env per il backend
cat > backend/.env << EOF
MONGODB_URI=$MONGODB_URI
PORT=5000
FRONTEND_URL=$FRONTEND_URL
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
EOF

echo ""
echo "✅ File backend/.env creato!"
echo ""
echo "=== Prossimi Passi ==="
echo ""
echo "1️⃣  Deploy Backend su Railway:"
echo "   - Vai su https://railway.app"
echo "   - New Project → Deploy from GitHub"
echo "   - Seleziona questo repository"
echo "   - Imposta Root Directory: backend"
echo "   - Aggiungi le variabili d'ambiente (il file .env è già pronto)"
echo ""
echo "2️⃣  Deploy Frontend su Vercel:"
echo "   - Vai su https://vercel.com"
echo "   - Add New → Project"
echo "   - Importa il repository"
echo "   - Imposta Root Directory: ims-dashboard"
echo "   - Aggiungi variabile: VITE_API_URL=<URL backend Railway>/api"
echo ""
echo "3️⃣  Esegui il seed del database:"
echo "   cd backend && npm run seed"
echo ""
echo "📖 Per la guida completa, leggi: DEPLOY_VERCEL_GUIDA.md"
echo ""
