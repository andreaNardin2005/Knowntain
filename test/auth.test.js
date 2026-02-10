import { jest } from '@jest/globals'
import request from 'supertest'

// ==========================
// MOCK MODELLI MONGOOSE
// ==========================
jest.unstable_mockModule('../app/models/utente.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}))

jest.unstable_mockModule('../app/models/dipendente.js', () => ({
  default: {
    findOne: jest.fn()
  }
}))

// ==========================
// IMPORT DOPO I MOCK
// ==========================
const app = (await import('../app/app.js')).default
const Utente = (await import('../app/models/utente.js')).default
const Dipendente = (await import('../app/models/dipendente.js')).default

// ==========================
// TEST LOGIN
// ==========================
describe('POST /auth/login', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('login riuscito per utente', async () => {
    Utente.findOne.mockResolvedValue({
      _id: '123',
      email: 'test@test.it',
      password: 'password',
      ruolo: 'utente',
      nickname: 'tester',
      punti: 10,
      puntiTot: 100
    })

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.it',
        password: 'password',
        ruolo: 'utente'
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.role).toBe('utente')
    expect(res.body.profile).toEqual({
      nickname: 'tester',
      punti: 10,
      puntiTot: 100
    })
  })

  it('fallisce se utente non esiste', async () => {
    Utente.findOne.mockResolvedValue(null)

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'no@test.it',
        password: 'password',
        ruolo: 'utente'
      })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('fallisce se password errata', async () => {
    Utente.findOne.mockResolvedValue({
      _id: '123',
      email: 'test@test.it',
      password: 'giusta',
      ruolo: 'utente',
      nickname: 'tester',
      punti: 10,
      puntiTot: 100
    })

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.it',
        password: 'sbagliata',
        ruolo: 'utente'
      })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('login riuscito per dipendente', async () => {
    Dipendente.findOne.mockResolvedValue({
      _id: '456',
      email: 'dip@test.it',
      password: 'password',
      ruolo: 'dipendente',
      isAdmin: true
    })

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'dip@test.it',
        password: 'password',
        ruolo: 'dipendente'
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.role).toBe('dipendente')
    expect(res.body.profile).toEqual({
      isAdmin: true
    })
  })

  it('fallisce se body incompleto', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.it'
      })

    expect(res.status).toBe(400)
  })
})

// ==========================
// TEST REGISTER
// ==========================
describe('POST /auth/register', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('registrazione riuscita', async () => {
    Utente.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null)
    })

    Utente.create.mockResolvedValue({
      _id: '123',
      email: 'test@test.it',
      ruolo: 'utente',
      nickname: 'tester',
      punti: 0,
      puntiTot: 0
    })

    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@test.it',
        password: 'StrongPass1!',
        nome: 'Mario',
        cognome: 'Rossi',
        nickname: 'tester'
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.email).toBe('test@test.it')
    expect(res.body.profile).toEqual({
      nickname: 'tester',
      punti: 0,
      puntiTot: 0
    })
  })

  it('fallisce se email non valida', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'invalid-email',
        password: 'StrongPass1!',
        nome: 'Mario',
        cognome: 'Rossi',
        nickname: 'tester'
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/Email non valida/)
  })

  it('fallisce se password debole', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@test.it',
        password: 'weak',
        nome: 'Mario',
        cognome: 'Rossi',
        nickname: 'tester'
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/Password debole/)
  })

  it('fallisce se email o nickname già usati', async () => {
    Utente.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        email: 'test@test.it',
        nickname: 'tester'
      })
    })

    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@test.it',
        password: 'StrongPass1!',
        nome: 'Mario',
        cognome: 'Rossi',
        nickname: 'tester'
      })

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/già utilizzati/)
  })

  it('fallisce se mancano campi obbligatori', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@test.it',
        password: 'StrongPass1!'
      })

    expect(res.status).toBe(400)
  })
})