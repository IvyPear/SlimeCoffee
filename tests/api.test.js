const request = require('supertest');
const app = require('../server');

describe('Kiểm thử API', () => {
  it('Trang chủ phải trả về HTTP 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});