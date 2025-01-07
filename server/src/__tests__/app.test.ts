import request from 'supertest';
import { app } from '../App';

describe('API Tests', () => {
    it('should return the list of products when calling GET /api/products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    describe('GET /api/products/:id', () => {
        it('should return a single product when a valid ID is provided', async () => {
            const response = await request(app).get('/api/products/0');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name');
            expect(response.body).toHaveProperty('price');
            expect(response.body).toHaveProperty('description');
        });

        it('should return 404 if the product is not found', async () => {
            const response = await request(app).get('/api/products/100000');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Product not found');
        });
    });

    describe('PATCH /api/products/:id', () => {
        it('should update a product with valid fields', async () => {
            const validProductUpdate = {
                name: 'Updated Name',
                description: 'This is a valid updated description with enough length',
                price: 99.99
            };

            const response = await request(app)
                .patch('/api/products/0')
                .send(validProductUpdate);


            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(validProductUpdate);
        });

        it('should return 400 if the input fields are invalid', async () => {
            const invalidProductUpdate = {
                name: 'ort',
                description: 'Too short',
                price: 100000
            };

            const response = await request(app)
                .patch('/api/products/0')
                .send(invalidProductUpdate);

            expect(response.status).toBe(400);
            expect(Array.isArray(response.body.errors)).toBe(true);
            const errorMessages = response.body.errors.map((err: any) => err.msg);
            expect(errorMessages).toEqual([
                'Name length should be between 5 and 50 characters',
                'Description length should be between 20 and 200 characters',
                'Price should be a number between 0.01 and 200']);
        });

        it('should return 404 if the product is not found', async () => {
            const validProductUpdate = {
                name: 'Updated Name',
                description: 'This is a valid description, more than 20 chars',
                price: 10
            };

            const response = await request(app)
                .patch('/api/products/9999')
                .send(validProductUpdate);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Product not found' });
        });
    });
});