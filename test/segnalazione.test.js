import { jest } from '@jest/globals';
import request from 'supertest';

// Mock del tokenChecker
jest.unstable_mockModule('../app/middlewares/tokenChecker.js', () => ({
  default: (req, res, next) => {
    req.loggedUser = { id: 'user123' };
    next();
  }
}));

// --- MOCK DEL MIDDLEWARE --- 
jest.unstable_mockModule('../app/middlewares/requireBody.js', () => ({
  default: (fields) => (req, res, next) => next()
}));

// --- MOCK DEI MODELLI MONGOOSE ---
jest.unstable_mockModule('../app/models/segnalazione.js', () => ({
  default: {
    find: jest.fn(() => ({
      sort: jest.fn(() => ({
        exec: jest.fn().mockResolvedValue([
          { _id: 's1', titolo: 'Segnalazione 1', stato: 'Validata' },
          { _id: 's2', titolo: 'Segnalazione 2', stato: 'Validata' }
        ])
      }))
    })),

    findById: jest.fn((id) => ({
      save: jest.fn().mockResolvedValue(true),
      _id: id,
      stato: 'In attesa',
      utente: 'user123'
    })),
    create: jest.fn((data) => Promise.resolve({ _id: 's3', ...data }))
  }
}));

jest.unstable_mockModule('../app/models/utente.js', () => ({
  default: {
    findById: jest.fn(() => ({
      punti: 50,
      save: jest.fn().mockResolvedValue(true)
    }))
  }
}));

jest.unstable_mockModule('../app/models/dipendente.js', () => ({
  default: {
    findById: jest.fn(() => ({
      _id: 'dip1',
      save: jest.fn().mockResolvedValue(true)
    }))
  }
}));

jest.unstable_mockModule('../app/models/iniziativa.js', () => ({
  default: {
    updateMany: jest.fn().mockResolvedValue(true)
  }
}));

// --- IMPORT ROUTER DOPO I MOCK ---
const { default: app } = await import('../app/app.js');

describe('API Segnalazioni', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /segnalazioni ritorna tutte le segnalazioni validate', async () => {
    const res = await request(app).get('/segnalazioni');

    console.log("GET res: ", res.body);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.segnalazioni)).toBe(true);
    expect(res.body.segnalazioni.length).toBe(2);
    expect(res.body.segnalazioni[0].stato).toBe('Validata');
  });

  it('POST /segnalazioni crea una nuova segnalazione', async () => {
    const payload = {
      titolo: 'Nuova segnalazione',
      descrizione: 'Test',
      posizione: 'Roma',
      tipo: 'Tipo1'
    };

    const res = await request(app).post('/segnalazioni').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.titolo).toBe(payload.titolo);
    expect(res.body.utente).toBe('user123');
  });
});