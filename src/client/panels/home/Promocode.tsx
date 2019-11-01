import { Button, Cell, Div, Spinner } from "@vkontakte/vkui";
import * as React from "react";
import { useEffect, useState } from "react";
import * as CopyToClipboard from "react-copy-to-clipboard";
import { toMsg } from "../../../common/utils";
import { api } from "../../logic/api";

interface IProps {
    notify: (msg: string, isError: boolean) => void;
}

export const Promocode = ({ notify }: IProps) => {
    const [promocode, setPromocode] = useState<string>(undefined);
    const onClickCopy = () => notify("Скопировано", false);
    const copyButton = (
        <CopyToClipboard text={promocode}>
            <Button size="m" onClick={onClickCopy}>
                Скопировать
            </Button>
        </CopyToClipboard>
    );

    useEffect(() => {
        api.getPromocode()
            .then(res => setPromocode(res.promocode))
            .catch(err => notify(toMsg(err), true));
    }, []);

    const renderContent = () => {
        if (promocode === undefined) {
            return <Spinner size="small" />;
        } else {
            return promocode;
        }
    };

    return (
        <Cell asideContent={copyButton}>
            <Div className="tool_success">{renderContent()}</Div>
        </Cell>
    );
};
