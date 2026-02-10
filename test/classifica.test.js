import { jest } from '@jest/globals';
import request from 'supertest';

// Mock del tokenChecker
jest.unstable_mockModule('../app/middlewares/tokenChecker.js', () => ({
  default: (req, res, next) => {
    req.loggedUser = { id: 'user123' };
    next();
  }
}));

// Mock del modulo utente
jest.unstable_mockModule('../app/models/utente.js', () => ({
  default: {
    find: jest.fn(() => ({
      select: jest.fn(() => ({
        sort: jest.fn(() => ({
          lean: jest.fn().mockResolvedValue([
            { nickname: 'Alice', punti: 120 },
            { nickname: 'Bob', punti: 110 },
            { nickname: 'Charlie', punti: 90 }
          ])
        }))
      }))
    }))
  }
}));

// Import dell'applicazione
const { default: app } = await import('../app/app.js');

// testing della classifca
describe('GET /classifica', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ritorna la classifica top 50 con posizione', async () => {
    const res = await request(app).get('/classifica');

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.utentiTop)).toBe(true);

    // Controllo nickname e punti
    expect(res.body.utentiTop[0].nickname).toBe('Alice');
    expect(res.body.utentiTop[0].punti).toBe(120);

    // Controllo posizione crescente
    expect(res.body.utentiTop[0].posizione).toBe(1);
    expect(res.body.utentiTop[1].posizione).toBe(2);

    // Limite top 50
    expect(res.body.utentiTop.length).toBeLessThanOrEqual(50);
  });
});