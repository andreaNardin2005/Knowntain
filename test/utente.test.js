import { jest } from '@jest/globals';
import request from 'supertest';

// Mock del TokenChecker
jest.unstable_mockModule('../app/middlewares/tokenChecker.js', () => ({
  default: (req, res, next) => {
    req.loggedUser = { id: 'user123' };
    next();
  }
}));

// Mock del modulo utente
jest.unstable_mockModule('../app/models/utente.js', () => ({
  default: {
    findById: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'test@test.it',
        nickname: 'tester',
        toObject() { return { _id:'user123', email:'test@test.it', nickname:'tester' }; }
      })
    }))
  }
}));

// Mock della segnalazione
jest.unstable_mockModule('../app/models/segnalazione.js', () => ({
  default: {
    find: jest.fn(() => ({
      sort: jest.fn(() => ({
        exec: jest.fn().mockResolvedValue([
          {
            _id: 's1',
            titolo: 'Segn 1',
            toObject() {
              return { _id: 's1', titolo: 'Segn 1' };
            }
          }
        ])
      }))
    }))
  }
}));

// Import della app
const { default: app } = await import('../app/app.js');

// Test del profilo
describe('GET /utenti/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ritorna utente e segnalazioni', async () => {
    //console.log('Utente.findById:', await Utente.findById(fakeUser._id).select());
    //console.log('Segnalazioni:', await Segnalazione.find(fakeUser._id).exec());

    const res = await request(app).get('/utenti/me');

    expect(res.status).toBe(200);
    expect(res.body.profilo.email).toBe('test@test.it');
    expect(res.body.profilo.password).toBeUndefined();
    expect(res.body.profilo.segnalazioni).toHaveLength(1);
    expect(res.body.profilo.segnalazioni[0].titolo).toBe('Segn 1');
  });
});