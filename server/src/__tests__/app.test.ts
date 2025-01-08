import request from "supertest";
import { app } from "../App";

function generateRandomString(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }

    return result;
}

describe("GET /api/products", () => {
    it("should return the list of products when calling GET /api/products", async () => {
        const response = await request(app).get("/api/products");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const firstProduct = response.body[0];
        expect(firstProduct.id).toBeGreaterThanOrEqual(0);
        expect(firstProduct.name).toBeTruthy();
        expect(firstProduct.description).toBeTruthy();
        expect(firstProduct.price).toBeGreaterThanOrEqual(0.01)
    });
});

describe("GET /api/products/:id", () => {
    it("should return a single product when a valid ID is provided", async () => {
        const response = await request(app).get("/api/products/0");
        expect(response.status).toBe(200);
        const product = response.body;

        expect(product.id).toBeGreaterThanOrEqual(0);
        expect(product.name).toBeTruthy();
        expect(product.description).toBeTruthy();
        expect(product.price).toBeGreaterThanOrEqual(0.01)
    });

    it("should return 404 if the product is not found", async () => {
        const response = await request(app).get("/api/products/100000");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Product not found");
    });
});

describe("PATCH /api/products/:id", () => {
    it("should update a product with valid fields", async () => {
        const validProductUpdate = {
            name: "Updated Name",
            description: "This is a valid updated description with enough length",
            price: 99.99,
        };

        const response = await request(app)
            .patch("/api/products/0")
            .send(validProductUpdate);


        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(validProductUpdate);
    });

    it("should return 400 if the input fields are invalid", async () => {
        const invalidProductUpdate = {
            name: "ort",
            description: "Too short",
            price: 100000,
        };

        const response = await request(app)
            .patch("/api/products/0")
            .send(invalidProductUpdate);

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        const errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual([
            "Name length should be between 5 and 50 characters",
            "Description length should be between 20 and 200 characters",
            "Price should be a number between 0.01 and 10000"]);
    });

    it("should return 404 if the product is not found", async () => {
        const validProductUpdate = {
            name: "Updated Name",
            description: "This is a valid description, more than 20 chars",
            price: 10,
        };

        const response = await request(app)
            .patch("/api/products/9999")
            .send(validProductUpdate);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Product not found" });
    });


    it("should update a product with valid one field", async () => {
        let response = await request(app)
            .patch("/api/products/0")
            .send({ name: "Updated Name"})

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("Updated Name");

        response = await request(app)
            .patch("/api/products/0")
            .send({ description: "This is a valid updated description with enough length"})

        expect(response.status).toBe(200);
        expect(response.body.description).toEqual("This is a valid updated description with enough length");

        response = await request(app)
            .patch("/api/products/0")
            .send({ price: 10})

        expect(response.status).toBe(200);
        expect(response.body.price).toEqual(10);

    })

    it("should handle edge cases on price field", async () => {
        let response = await request(app)
            .patch("/api/products/0")
            .send({ price: 0.01 })

        expect(response.status).toBe(200);
        expect(response.body.price).toEqual(0.01);

        response = await request(app)
            .patch("/api/products/0")
            .send({ price: 10000 })

        expect(response.status).toBe(200);
        expect(response.body.price).toEqual(10000);

        response = await request(app)
            .patch("/api/products/0")
            .send({ price: 0 })

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        let errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Price should be a number between 0.01 and 10000"]);

        response = await request(app)
            .patch("/api/products/0")
            .send({ price: 10001 })

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Price should be a number between 0.01 and 10000"]);
    })

    it("should handle incorrect field type on price field", async () => {
        let response = await request(app)
            .patch("/api/products/0")
            .send({ price: '{price: 100}'})

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        let errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Price should be a number between 0.01 and 10000"]);
    })

    it("should handle edge cases on name field", async () => {
        let name = generateRandomString(5)
        let response = await request(app)
            .patch("/api/products/0")
            .send({ name })

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(name);

        name = generateRandomString(50)

        response = await request(app)
            .patch("/api/products/0")
            .send({ name })

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(name);


        name = generateRandomString(4)

        response = await request(app)
            .patch("/api/products/0")
            .send({ name })

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        let errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Name length should be between 5 and 50 characters"]);

        name = generateRandomString(51)

        response = await request(app)
            .patch("/api/products/0")
            .send({ name })

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Name length should be between 5 and 50 characters"]);
    })

    it("should handle incorrect field type on name field", async () => {
        let response = await request(app)
            .patch("/api/products/0")
            .send({ name: 10000})

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        let errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Name should be a string"]);
    })

    it("should handle edge cases on description field", async () => {
        let description = generateRandomString(20)
        let response = await request(app)
            .patch("/api/products/0")
            .send({ description })

        expect(response.status).toBe(200);
        expect(response.body.description).toEqual(description);

        description = generateRandomString(200)

        response = await request(app)
            .patch("/api/products/0")
            .send({ description })

        expect(response.status).toBe(200);
        expect(response.body.description).toEqual(description);


        description = generateRandomString(19)

        response = await request(app)
            .patch("/api/products/0")
            .send({ description })

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        let errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Description length should be between 20 and 200 characters"]);

        description = generateRandomString(201)

        response = await request(app)
            .patch("/api/products/0")
            .send({ description })

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Description length should be between 20 and 200 characters"]);

    })

    it("should handle incorrect field type on description field", async () => {
        let response = await request(app)
            .patch("/api/products/0")
            .send({ description: 100000000.0000000000000000})

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        let errorMessages = response.body.errors.map((err: any) => err.msg);
        expect(errorMessages).toEqual(["Description length should be between 20 and 200 characters", "Description should be a string"]);
    })
});