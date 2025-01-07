import { Button, Flex, Form, Input, InputNumber } from "antd";
import { useCallback, useState } from "react";
import { ProductType } from "../../types/ProductType.ts";
import { validationRules } from "./validationRules.ts";
import ErrorWithRetryButton from "../../components/ErrorWithRetryButton/ErrorWithRetryButton.tsx";

type ErrorType = { fieldId: string; errors: string[] };

type ErrorsStateType = { [key in keyof ProductType]?: ErrorType };

export default function ProductUpdateForm({
    product,
    onSuccessfulUpdate,
}: {
    product: ProductType;
    onSuccessfulUpdate: (product: ProductType) => void;
}) {
    const [errors, setErrors] = useState<ErrorsStateType>({});
    const [unknownError, setUnknownError] = useState<string | null>(null);

    const onSubmit = useCallback(async (values: ProductType) => {
        try {
            const updatedResponse = await fetch(
                `http://localhost:3000/api/products/${product.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }
            );
            if (updatedResponse.status === 200) {
                const updatedValues = await updatedResponse.json();
                onSuccessfulUpdate(updatedValues);
            } else if (updatedResponse.status === 400) {
                const { errors } = (await updatedResponse.json()) as {
                    errors: { path: string; msg: string }[];
                };
                const normalizedErrors = errors.reduce<ErrorsStateType>(
                    (result, error) => {
                        result[error.path as keyof ProductType] = {
                            fieldId: error.path,
                            errors: [error.msg],
                        };
                        return result;
                    },
                    {}
                );
                setErrors(normalizedErrors);
            } else {
                setUnknownError("Something went wrong");
            }
        } catch (error) {
            setUnknownError("Something went wrong");
        }
    }, []);

    const clearErrors = useCallback(() => {
        setErrors((oldValue) => {
            if (Object.keys(oldValue).length === 0) return oldValue;
            return {};
        });
    }, []);

    const clearAllErrors = useCallback(() => {
        setErrors({});
        setUnknownError(null);
    }, []);

    if (unknownError) {
        return (
            <ErrorWithRetryButton
                errorText={unknownError}
                onReset={clearAllErrors}
                buttonLabel="Reset Form"
            />
        );
    }

    return (
        <Form
            onFinish={onSubmit}
            layout="vertical"
            initialValues={product}
            onChange={clearErrors}
            onReset={clearErrors}
        >
            {Object.values(errors).map((error) => (
                <Form.ErrorList
                    key={error.fieldId}
                    fieldId={error.fieldId}
                    errors={error.errors}
                />
            ))}
            <Form.Item label="Name" name="name" rules={validationRules.name}>
                <Input />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={validationRules.description}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Price" name="price" rules={validationRules.price}>
                <InputNumber />
            </Form.Item>
            <Form.Item>
                <Flex gap="middle">
                    <Button type="default" htmlType="reset">
                        Reset
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Confirm
                    </Button>
                </Flex>
            </Form.Item>
        </Form>
    );
}
