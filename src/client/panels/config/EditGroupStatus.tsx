import * as React from 'react';

import { FormStatus } from "@vkontakte/vkui";


export interface EditGroupStatusProps {
    groupId: number;
    isPostUrlValid: boolean;
    isPromocodeValid: boolean;
}

export const EditGroupStatus = ({groupId, isPostUrlValid, isPromocodeValid }: EditGroupStatusProps ) => {
    const getErrorMessage = () => {
        if (!isPromocodeValid) {
            return 'Промокод не должен быть пустым';
        } else if (!isPostUrlValid) {
            return `Неправильный URL поста, поддерживаемые форматы: https://vk.com/wall-${groupId}_1234, wall-${groupId}_1234, https://vk.com/wall-${groupId}?w=wall-${groupId}_1233`;
        }
        return '';
    };

    return isPostUrlValid && isPromocodeValid
    ? <FormStatus title="Все отлично">
        Данные можно сохранить
    </FormStatus>
    : <FormStatus title="Ошибка ввода" state="error">
        {getErrorMessage()}
    </FormStatus>
}
