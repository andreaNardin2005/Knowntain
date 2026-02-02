/**
 * https://www.npmjs.com/package/supertest
 */
import request from 'supertest';
import app from '../app/app.js';

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET /health should return 200', () => {
  return request(app)
    .get('/health')
    .expect(200);
});