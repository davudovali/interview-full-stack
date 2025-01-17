import express = require("express");
import cors = require("cors");
import { Express, Request, Response } from "express";
import { productsList } from "./productsList";
import { checkSchema, validationResult } from 'express-validator';

const app: Express = express();

app.use(cors());
app.use(express.json());

const validatePatchRequest = checkSchema({
    name: {optional: true,
        isLength: {
            options: { min: 5, max: 50},
            errorMessage: 'Name length should be between 5 and 50 characters'
        },
        isString: {errorMessage: 'Name should be a string'},
        trim: true,
        escape: true,
    },
    description: {optional: true,
        isLength: {
            options: { min: 20, max: 200 },
            errorMessage: 'Description length should be between 20 and 200 characters'
        },
        isString: {errorMessage: 'Description should be a string'},
        trim: true,
        escape: true,
    },
    price: {optional: true,
        isFloat: {errorMessage: 'Price should be a number between 0.01 and 10000', options: {min: 0.01, max: 10000}}
    }
})

app.use(cors());

app.use(express.json());

app.get('/api/products', (req, res) => {
    let result = [...productsList]
    res.json(result);
});

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productsList[productId];

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.patch('/api/products/:id', validatePatchRequest, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty() === false) {
        return res.status(400).json({ errors: errors.array() });
    }

    const productId = parseInt(req.params.id);
    const product = productsList[productId];

    if (product) {
        (['name', 'price', 'description'] ).forEach((fieldId) => {
            if (req.body[fieldId]) {
                product[fieldId] = req.body[fieldId];
            }
        })
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello from Flink!" });
});


// Export the app object for testing purposes
export { app };