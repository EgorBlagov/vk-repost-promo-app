import * as React from "react";

import { FormStatus } from "@vkontakte/vkui";
import { wallProcessor } from "../../logic/wall-processor";

export interface IEditGroupStatusProps {
    groupId: number;
    isPostUrlValid: boolean;
    isPromocodeValid: boolean;
}

export const EditGroupStatus = ({ groupId, isPostUrlValid, isPromocodeValid }: IEditGroupStatusProps) => {
    const getErrorMessage = () => {
        if (!isPromocodeValid) {
            return "Промокод не должен быть пустым";
        } else if (!isPostUrlValid) {
            return `Неправильный URL поста, поддерживаемые форматы: ${wallProcessor
                .getExamplePostUrls(groupId)
                .join(", ")}`;
        }

        return "";
    };

    return isPostUrlValid && isPromocodeValid ? (
        <FormStatus title="Все отлично">Данные можно сохранить</FormStatus>
    ) : (
        <FormStatus title="Ошибка ввода" state="error">
            {getErrorMessage()}
        </FormStatus>
    );
};
