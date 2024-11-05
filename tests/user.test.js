const request = require('supertest');
const { app } = require('../server');
const mongoose = require('mongoose');
const User = require('./models/User');

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User API', () => {
    let userId;

    test('should create a new user', async () => {
        const response = await request(app).post('/api/users').send({
            name: 'John Doe',
            email: 'john@example.com',
            age: 30
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('John Doe');
        userId = response.body._id;
    });

    test('should get list of users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('should update an existing user', async () => {
        const response = await request(app).put(`/api/users/${userId}`).send({
            age: 31
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.age).toBe(31);
    });
});
