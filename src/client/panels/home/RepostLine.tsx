import * as React from 'react';
import { Button, Cell, Link } from '@vkontakte/vkui';
import { wallProcessor } from '../../logic/wall-processor';
import { StatusIcon } from './StatusIcon';

interface IProps {
    hasRepost: boolean;
    groupId: number;
    postId: number;
    notify: (msg: string, isErrror: boolean) => void;
}

export const RepostLine = ({ hasRepost, groupId, postId, notify }: IProps) => {
    const openPostButton = <div style={{ display: 'flex' }}>
        <Button component="a" size="m" href={wallProcessor.generatePostUrl(groupId, postId)} target="_blank">Открыть</Button>
    </div>

    return <Cell
        before={<StatusIcon isOk={hasRepost}/>}
        asideContent={!hasRepost && openPostButton}
        multiline
    >
        Поделиться <Link href={wallProcessor.generatePostUrl(groupId, postId)} target="_blank">этой</Link> записью
    </Cell>
}
