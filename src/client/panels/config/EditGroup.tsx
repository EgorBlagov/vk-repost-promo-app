import * as React from 'react';
import * as _ from 'lodash';
import { useState, useEffect} from 'react';

import { platform, IOS, InfoRow, FormLayout, Input, FormStatus } from '@vkontakte/vkui';

import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Spinner from '@vkontakte/vkui/dist/components/Spinner/Spinner';
import Slider from '@vkontakte/vkui/dist/components/Slider/Slider';
import Link from '@vkontakte/vkui/dist/components/Link/Link';

import { IGroupConfig } from '../../../common/api';
import { EditGroupStatus } from './EditGroupStatus';

const osname = platform();

export interface EditGroupProps {
    groupId: number,
    config: IGroupConfig;
    saving: boolean;
    saveGroupParams: (newCfg: IGroupConfig)=>void;
    reset: ()=>void;
}

declare module '@vkontakte/vkui/dist/components/Spinner/Spinner' {
    interface SpinnerProps {
        className?: string;
    }
}

declare module '@vkontakte/vkui/dist/components/Input/Input' {
    interface InputProps {
        top?: React.ReactNode;
        name?: string;
        value?: string;
    }
}

const EditGroup = ({config, saveGroupParams, reset, groupId, saving}: EditGroupProps) => {
    const [promocode, setPromocode] = useState<string>(undefined);
    const [postUrl, setPostUrl] = useState<string>(undefined);
    const [hours, setHours] = useState<number>(undefined);

    useEffect(()=> {
        if (config !== undefined) {
            // TODO: attention here, maybe can cause rewritings
            setPromocode(config.promocode);
            setPostUrl(`https://vk.com/wall-${groupId}_${config.postId}`);
            setHours(config.hoursToGet);
        }
    }, [config]);

    const submit = () => {
        saveGroupParams({
            promocode,
            postId: extractPostId(postUrl),
            hoursToGet: hours
        });
    }

    const parsePostUrl = (url: string): string => {
        if (isPostUrlValid(url)) {
            return `https://vk.com/wall-${groupId}_${extractPostId(url)}`;
        } else {
            return url;
        }
    }

    const extractPostId = (url: string): number => {
        return parseInt(url.match(/wall-\d+_(\d+)$/)[1])
    }

    const isPostUrlValid = (url: string = postUrl): boolean => {
        if (url === undefined) {
            return false;
        }

        const match = url.match(new RegExp(`wall-${groupId}_(\\d+)$`));
        if (match === null) {
            return false;
        }

        return true;
    }

    const isPromocodeValid = (): boolean => !!promocode;

    const isEverythingValid = (): boolean => {
        return isPostUrlValid() && isPromocodeValid();
    }

    if (_.includes([config, promocode, postUrl, hours], undefined)) {
        return <Spinner className='edit-group__spinner' size="large"/>;
    } else {
        return <FormLayout>
            <EditGroupStatus
                isPromocodeValid = {isPromocodeValid()}
                isPostUrlValid = {isPostUrlValid()}
                groupId={groupId}
            />
            <Input
                type="text"
                top="Промокод"
                value={promocode}
                status={promocode ? 'valid': 'error'}
                onChange={(e) => setPromocode(e.currentTarget.value)}
            />
            <Input
                type="text"
                top={<>URL поста на <Link href={`https://vk.com/wall-${groupId}`} target='_blank'>стене сообщества</Link></>}
                status={isPostUrlValid() ? 'valid' : 'error'}
                value={postUrl}
                onChange={(e) => setPostUrl(parsePostUrl(e.currentTarget.value))}
            />
            <Slider
                top={`Минимальный порог: ${hours} ч.`}
                step={1}
                min={0}
                max={72}
                value={hours}
                onChange={newHours => setHours(newHours)}
                bottom="Сколько часов запись должна быть на стене для получения промокода"
            />
            <Div style={{display:'flex', justifyContent: 'space-between'}}>
                <Button size="l" level="secondary" onClick={reset}>Сбросить</Button>
                <Div style={{display: 'flex', padding: '0px'}}>
                    {saving && <Spinner size='small'/>}
                    <Button size="l" disabled={!isEverythingValid()} level="commerce" onClick={submit}>Сохранить</Button>
                </Div>
            </Div>
        </FormLayout>
    }
}

export default EditGroup;