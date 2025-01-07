import { Button, Flex } from "antd";

export default function ErrorWithRetryButton({
    errorText,
    onReset,
    buttonLabel,
}: {
    errorText: string;
    onReset: () => void;
    buttonLabel: string;
}) {
    return (
        <Flex vertical>
            <h3 style={{ color: "red" }}>{errorText}</h3>
            <Button type="primary" htmlType="reset" onClick={onReset}>
                {buttonLabel}
            </Button>
        </Flex>
    );
}
