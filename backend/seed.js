import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Document from './models/Document.js';
import NonConformity from './models/NonConformity.js';
import Action from './models/Action.js';
import Audit from './models/Audit.js';
import Training from './models/Training.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connesso per il seed');

    // Clear existing data
    await User.deleteMany({});
    await Document.deleteMany({});
    await NonConformity.deleteMany({});
    await Action.deleteMany({});
    await Audit.deleteMany({});
    await Training.deleteMany({});
    console.log('🗑️  Dati esistenti eliminati');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ims.com',
      password: 'password123',
      role: 'admin',
      department: 'Qualità'
    });

    // Create regular user
    const user = await User.create({
      name: 'Mario Rossi',
      email: 'mario@ims.com',
      password: 'password123',
      role: 'user',
      department: 'Produzione'
    });

    console.log('👥 Utenti creati');

    // Create Documents
    const documents = await Document.insertMany([
      {
        code: 'MAN-001',
        title: 'Manuale Sistema Integrato',
        type: 'Manuale',
        iso: 'Tutti',
        revision: '3.0',
        owner: 'Qualità',
        status: 'approved',
        description: 'Manuale del sistema di gestione integrato ISO 9001/14001/45001',
        createdBy: admin._id
      },
      {
        code: 'PRO-001',
        title: 'Procedure Audit Interni',
        type: 'Procedura',
        iso: '9001',
        revision: '2.1',
        owner: 'Qualità',
        status: 'approved',
        description: 'Procedura per la pianificazione ed esecuzione degli audit interni',
        createdBy: admin._id
      },
      {
        code: 'PRO-002',
        title: 'Gestione Rifiuti',
        type: 'Procedura',
        iso: '14001',
        revision: '1.5',
        owner: 'Ambiente',
        status: 'approved',
        description: 'Procedura per la corretta gestione e smaltimento dei rifiuti',
        createdBy: admin._id
      },
      {
        code: 'PRO-003',
        title: 'Valutazione Rischi SSL',
        type: 'Procedura',
        iso: '45001',
        revision: '2.0',
        owner: 'SSL',
        status: 'review',
        description: 'Procedura per la valutazione dei rischi per la salute e sicurezza',
        createdBy: admin._id
      },
      {
        code: 'IST-001',
        title: 'Istruzione Lavoro Produzione',
        type: 'Istruzione',
        iso: '9001',
        revision: '4.2',
        owner: 'Produzione',
        status: 'approved',
        description: 'Istruzioni operative per il reparto produzione',
        createdBy: admin._id
      },
      {
        code: 'REG-001',
        title: 'Registro Non Conformità',
        type: 'Registro',
        iso: 'Tutti',
        revision: '1.0',
        owner: 'Qualità',
        status: 'active',
        description: 'Registro per il tracciamento delle non conformità',
        createdBy: admin._id
      }
    ]);

    console.log('📄 Documenti creati');

    // Create Non-Conformities
    const nonConformities = await NonConformity.insertMany([
      {
        code: 'NC-2024-001',
        title: 'Documentazione obsoleta in produzione',
        description: 'Trovata documentazione non aggiornata presso il reparto produzione',
        iso: '9001',
        severity: 'major',
        status: 'open',
        owner: 'Produzione',
        deadline: new Date('2024-06-15'),
        source: 'audit',
        createdBy: admin._id
      },
      {
        code: 'NC-2024-002',
        title: 'Mancata formazione operatori',
        description: 'Alcuni operatori non hanno completato la formazione obbligatoria',
        iso: '45001',
        severity: 'minor',
        status: 'in_progress',
        owner: 'HR',
        deadline: new Date('2024-06-20'),
        source: 'inspection',
        createdBy: admin._id
      },
      {
        code: 'NC-2024-003',
        title: 'Smaltimento rifiuti non conforme',
        description: 'Rifiuti speciali non correttamente identificati',
        iso: '14001',
        severity: 'major',
        status: 'closed',
        owner: 'Ambiente',
        deadline: new Date('2024-06-05'),
        source: 'inspection',
        closedBy: admin._id,
        closedDate: new Date('2024-06-04'),
        createdBy: admin._id
      },
      {
        code: 'NC-2024-004',
        title: 'DPI non disponibili',
        description: 'Mancanza di dispositivi di protezione individuale nel magazzino',
        iso: '45001',
        severity: 'critical',
        status: 'open',
        owner: 'SSL',
        deadline: new Date('2024-06-12'),
        source: 'inspection',
        createdBy: admin._id
      },
      {
        code: 'NC-2024-005',
        title: 'Calibrazione strumenti scaduta',
        description: 'Strumenti di misura con calibrazione scaduta',
        iso: '9001',
        severity: 'minor',
        status: 'in_progress',
        owner: 'Manutenzione',
        deadline: new Date('2024-06-25'),
        source: 'audit',
        createdBy: admin._id
      }
    ]);

    console.log('⚠️  Non conformità create');

    // Create Actions
    const actions = await Action.insertMany([
      {
        code: 'AC-2024-001',
        title: 'Aggiornamento procedure qualità',
        description: 'Revisione completa delle procedure del sistema qualità',
        type: 'correttiva',
        priority: 'high',
        status: 'in_progress',
        progress: 65,
        deadline: new Date('2024-06-30'),
        owner: 'Qualità',
        createdBy: admin._id
      },
      {
        code: 'AC-2024-002',
        title: 'Formazione sicurezza operatori',
        description: 'Sessione formativa obbligatoria per tutti gli operatori',
        type: 'correttiva',
        priority: 'critical',
        status: 'open',
        progress: 0,
        deadline: new Date('2024-06-20'),
        owner: 'SSL',
        createdBy: admin._id
      },
      {
        code: 'AC-2024-003',
        title: 'Implementazione raccolta differenziata',
        description: 'Nuovo sistema di raccolta differenziata rifiuti',
        type: 'miglioramento',
        priority: 'medium',
        status: 'completed',
        progress: 100,
        deadline: new Date('2024-05-31'),
        owner: 'Ambiente',
        completedBy: admin._id,
        completedDate: new Date('2024-05-30'),
        createdBy: admin._id
      },
      {
        code: 'AC-2024-004',
        title: 'Revisione valutazione rischi',
        description: 'Aggiornamento documento valutazione rischi',
        type: 'preventiva',
        priority: 'high',
        status: 'in_progress',
        progress: 40,
        deadline: new Date('2024-07-15'),
        owner: 'SSL',
        createdBy: admin._id
      },
      {
        code: 'AC-2024-005',
        title: 'Digitalizzazione registri',
        description: 'Migrazione registri cartacei a formato digitale',
        type: 'miglioramento',
        priority: 'low',
        status: 'open',
        progress: 15,
        deadline: new Date('2024-08-30'),
        owner: 'IT',
        createdBy: admin._id
      }
    ]);

    console.log('✅ Azioni create');

    // Create Audits
    const audits = await Audit.insertMany([
      {
        code: 'AUD-2024-001',
        title: 'Audit Interno Qualità',
        type: 'interno',
        iso: '9001',
        auditor: 'Mario Rossi',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-16'),
        status: 'scheduled',
        departments: ['Produzione', 'Qualità'],
        createdBy: admin._id
      },
      {
        code: 'AUD-2024-002',
        title: 'Audit Fornitore ABC',
        type: 'fornitore',
        iso: '9001',
        auditor: 'Luca Bianchi',
        startDate: new Date('2024-06-20'),
        endDate: new Date('2024-06-20'),
        status: 'scheduled',
        departments: ['Acquisti'],
        createdBy: admin._id
      },
      {
        code: 'AUD-2024-003',
        title: 'Audit Ambientale Annuale',
        type: 'interno',
        iso: '14001',
        auditor: 'Anna Verdi',
        startDate: new Date('2024-05-10'),
        endDate: new Date('2024-05-12'),
        status: 'completed',
        departments: ['Produzione', 'Manutenzione'],
        conclusion: 'Audit completato con esito positivo. 3 opportunità di miglioramento identificate.',
        createdBy: admin._id
      },
      {
        code: 'AUD-2024-004',
        title: 'Audit SSL Reparto',
        type: 'interno',
        iso: '45001',
        auditor: 'Giuseppe Neri',
        startDate: new Date('2024-04-25'),
        endDate: new Date('2024-04-26'),
        status: 'completed',
        departments: ['Produzione'],
        conclusion: 'Situazione conforme. 2 osservazioni registrate.',
        createdBy: admin._id
      },
      {
        code: 'AUD-2024-005',
        title: 'Audit di Certificazione',
        type: 'esterno',
        iso: 'Tutti',
        auditor: 'Ente Certificatore',
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-09-18'),
        status: 'planned',
        departments: ['Tutti'],
        createdBy: admin._id
      }
    ]);

    console.log('📋 Audit creati');

    // Create Training Records
    const trainings = await Training.insertMany([
      {
        course: 'Sicurezza Generale',
        description: 'Formazione obbligatoria sulla sicurezza sul lavoro',
        type: 'sicurezza',
        participants: 45,
        date: new Date('2024-03-15'),
        duration: { hours: 4, minutes: 0 },
        trainer: 'Consulente Esterno',
        trainerType: 'esterno',
        location: 'Aula Formazione',
        status: 'completed',
        createdBy: admin._id
      },
      {
        course: 'Gestione Rifiuti',
        description: 'Formazione sulla corretta gestione dei rifiuti',
        type: 'ambiente',
        participants: 12,
        date: new Date('2024-04-10'),
        duration: { hours: 2, minutes: 0 },
        trainer: 'Resp. Ambiente',
        trainerType: 'interno',
        location: 'Sala Riunioni',
        status: 'completed',
        createdBy: admin._id
      },
      {
        course: 'Audit Interni',
        description: 'Formazione per auditor interni',
        type: 'qualita',
        participants: 8,
        date: new Date('2024-05-20'),
        duration: { hours: 8, minutes: 0 },
        trainer: 'Lead Auditor',
        trainerType: 'esterno',
        location: 'Aula Formazione',
        status: 'completed',
        createdBy: admin._id
      },
      {
        course: 'Emergenza e Primo Soccorso',
        description: 'Formazione addetti emergenza e primo soccorso',
        type: 'sicurezza',
        participants: 20,
        date: new Date('2024-06-25'),
        duration: { hours: 4, minutes: 0 },
        trainer: 'Croce Rossa',
        trainerType: 'esterno',
        location: 'Aula Formazione',
        status: 'scheduled',
        createdBy: admin._id
      }
    ]);

    console.log('🎓 Formazione creata');

    console.log('\n✅ Seed completato con successo!');
    console.log('\n📊 Riepilogo:');
    console.log(`   - Utenti: 2`);
    console.log(`   - Documenti: ${documents.length}`);
    console.log(`   - Non Conformità: ${nonConformities.length}`);
    console.log(`   - Azioni: ${actions.length}`);
    console.log(`   - Audit: ${audits.length}`);
    console.log(`   - Formazione: ${trainings.length}`);
    console.log('\n🔐 Credenziali:');
    console.log('   Admin: admin@ims.com / password123');
    console.log('   User:  mario@ims.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Errore nel seed:', error);
    process.exit(1);
  }
};

seedData();
