export const validationRules = {
    name: [
        { required: true, message: "Product name is required" },
        {
            min: 5,
            message: "Product name should be no less than 5 characters",
        },
        {
            max: 50,
            message: "Product name should contain no more than 50 characters",
        },
    ],
    description: [
        {
            required: true,
            message: "Product description is required",
        },
        {
            min: 20,
            message: "Product description should be no less than 20 characters",
        },
        {
            max: 200,
            message:
                "Product description should be no more than 200 characters",
        },
    ],
    price: [
        { required: true, message: "Product price is required" },
        {
            validator: (_: unknown, value: number) => {
                if (value < 0.01) {
                    return Promise.reject(
                        "Product price should be higher or equal to 0.01"
                    );
                }
                if (value > 10000) {
                    return Promise.reject(
                        "Product price should be lower lower or equal to 10000"
                    );
                }
                return Promise.resolve();
            },
        },
    ],
};
