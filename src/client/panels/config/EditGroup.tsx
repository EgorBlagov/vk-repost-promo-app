import * as React from 'react';
import * as _ from 'lodash';
import { useState, useEffect } from 'react';

import { Button, FormLayout, Input, Div, Spinner, Slider, Link } from '@vkontakte/vkui';

import { IGroupConfig } from '../../../common/api';
import { wallProcessor } from '../../logic/wall-processor';

import { EditGroupStatus } from './EditGroupStatus';

export interface EditGroupProps {
    groupId: number,
    config: IGroupConfig;
    saving: boolean;
    saveGroupParams: (newCfg: IGroupConfig) => void;
    reset: () => void;
}

export const EditGroup = ({config, saveGroupParams, reset, groupId, saving}: EditGroupProps) => {
    const [promocode, setPromocode] = useState<string>(undefined);
    const [postUrl, setPostUrl] = useState<string>(undefined);
    const [hours, setHours] = useState<number>(undefined);

    useEffect(()=> {
        if (config !== undefined) {
            setPromocode(config.promocode);
            setPostUrl(wallProcessor.generatePostUrl(groupId, config.postId));
            setHours(config.hoursToGet);
        }
    }, [config]);

    const submit = () => {
        saveGroupParams({
            promocode,
            postId: wallProcessor.extractPostId(postUrl),
            hoursToGet: hours
        });
    }


    const isPromocodeValid = (): boolean => !!promocode;
    const isPostUrlValid = (): boolean => wallProcessor.isPostUrlValid(groupId, postUrl);

    const isEverythingValid = (): boolean => {
        return isPostUrlValid() && isPromocodeValid();
    }

    if (_.includes([config, promocode, postUrl, hours], undefined)) {
        return null;
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
                top={<>URL поста на <Link href={wallProcessor.getWallUrl(groupId)} target='_blank'>стене сообщества</Link></>}
                status={isPostUrlValid() ? 'valid' : 'error'}
                value={postUrl}
                onChange={(e) => setPostUrl(wallProcessor.normalizePostUrl(groupId, e.currentTarget.value))}
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
