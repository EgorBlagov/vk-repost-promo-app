import * as React from 'react';
import { useState, useEffect } from 'react'
import { Cell, Div, Spinner, Button } from '@vkontakte/vkui';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { api } from '../../logic/api';
import { toMsg } from '../../../common/errors';

interface IProps {
    notify: (msg: string, isError: boolean) => void;
    groupId: number;
}

export const Promocode = ({ groupId, notify }: IProps) => {
    const [promocode, setPromocode] = useState<string>(undefined);
    const copyButton = <CopyToClipboard text={promocode}>
        <Button size="m" onClick={() => notify('Скопировано', false)}>Скопировать</Button>
    </CopyToClipboard>

    useEffect(() => {
        api.getPromocode(groupId)
            .then(res => setPromocode(res.promocode))
            .catch(err => notify(toMsg(err), true));
    }, []);

    const renderContent = () => {
        if (promocode === undefined) {
            return <Spinner size='small'/>
        } else {
            return promocode;
        }
    }

    return <Cell asideContent={copyButton}>
        <Div className='tool_success'>{renderContent()}</Div>
    </Cell>
}
