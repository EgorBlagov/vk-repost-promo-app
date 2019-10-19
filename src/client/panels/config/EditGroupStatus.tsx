import * as React from 'react';

import { FormStatus } from "@vkontakte/vkui";

import { WallProcessor } from '../../logic/wall-processor';

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
            return `Неправильный URL поста, поддерживаемые форматы: ${WallProcessor.getExamplePostUrls(groupId).join(', ')}`;
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
