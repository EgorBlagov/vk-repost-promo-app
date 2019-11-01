import { Div, Spinner } from "@vkontakte/vkui";
import * as React from "react";
import { Icon16CheckCircle, Icon16Clear } from "../../external";
import "./StatusIcon.css";

interface IProps {
    isOk?: boolean;
}

export const StatusIcon = ({ isOk }: IProps) => {
    if (isOk === true) {
        return <Icon16CheckCircle className="tool__success" />;
    } else if (isOk === false) {
        return <Icon16Clear className="tool__error" />;
    } else {
        return (
            <Div className="status-icon__spinner">
                <Spinner size="small" />
            </Div>
        );
    }
};
