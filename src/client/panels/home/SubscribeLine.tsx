import * as React from 'react';
import { Cell, Button, Link } from '@vkontakte/vkui';
import { StatusIcon } from './StatusIcon';
import { api } from '../../logic/api';
import { toMsg } from '../../../common/errors';
import { wallProcessor } from '../../logic/wall-processor';

interface IProps {
    isMember: boolean;
    groupId: number;
    notify: (msg: string, isErrror: boolean) => void;
}

export const SubscribeLine = ({ isMember, groupId, notify }: IProps) => {
    const onClickSubscribe = () => {
        api.Subscribe(groupId)
            .catch(err => notify(`Не удалось подписаться: ${toMsg(err)}`, true));
    }

    const subscribeButton = <div style={{ display: 'flex' }}>
        <Button size="m" onClick={onClickSubscribe}>Подписаться</Button>
    </div>

    return <Cell
        before={<StatusIcon isOk={isMember}/>}
        asideContent={!isMember && subscribeButton}
        multiline
    >
        Подписаться на <Link href={wallProcessor.getGroupUrl(groupId)} target="_blank">наше</Link> сообщество
    </Cell> 
}