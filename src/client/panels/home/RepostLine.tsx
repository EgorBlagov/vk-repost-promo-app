import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Cell, Link, Div, Spinner } from '@vkontakte/vkui';
import { wallProcessor } from '../../logic/wall-processor';
import { StatusIcon } from './StatusIcon';
import { RepostInfo } from '../../logic/api';
import { useInterval } from '../../logic/useInterval';

interface IProps {
    repostInfo: RepostInfo;
    groupId: number;
    postId: number;
    getSecondsLeft: (postDate: number) => number;
}

export const RepostLine = ({ repostInfo, groupId, postId, getSecondsLeft }: IProps) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(undefined);

    const formatTime = (sec: number): string => {
        const hours: number = Math.floor(sec / 3600);
        const minutes: number = Math.floor((sec - (hours * 3600)) / 60);
        const seconds: number = sec - (hours * 3600) - (minutes * 60);

        let hoursS: string = hours.toString();
        let minutesS: string = minutes.toString();
        let secondsS: string = seconds.toString();

        if (hours < 10) {
            hoursS = `0${hours}`;
        }
        if (minutes < 10) {
            minutesS = `0${minutes}`;
        }
        if (seconds < 10) {
            secondsS = `0${seconds}`;
        }
        return `${hoursS}:${minutesS}:${secondsS}`;
    }

    useInterval(() => {
        if (repostInfo && repostInfo.reposted && getSecondsLeft(repostInfo.postDate) > 0) {
            setSecondsLeft(getSecondsLeft(repostInfo.postDate));
        }
    }, 1000);

    const renderAside = () => {
        if (repostInfo === undefined) {
            return null;
        }

        if (!repostInfo.reposted) {
            return <div style={{ display: 'flex' }}>
                <Button component="a" size="m" href={wallProcessor.generatePostUrl(groupId, postId)} target="_blank">Открыть</Button>
            </div>
        } else {
            if (getSecondsLeft(repostInfo.postDate) > 0) {
                const seconds = !!secondsLeft ? formatTime(secondsLeft) : <Spinner style={{marginLeft: '10px'}} size='small'/>;
                return <Div style={{display: 'flex', alignItems: 'center', padding: '0px'}}>осталось {seconds} </Div>;
            } else {
                return null;
            }
        }
    }

    return <Cell
        before={<StatusIcon isOk={repostInfo && repostInfo.reposted && getSecondsLeft(repostInfo.postDate) <= 0} />}
        asideContent={renderAside()}
        multiline
    >
        Поделиться <Link href={wallProcessor.generatePostUrl(groupId, postId)} target="_blank">этой</Link> записью
    </Cell>
}
