import * as React from 'react';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';

import { Panel, PanelHeader, HeaderButton, Group } from '@vkontakte/vkui';

import { IGroupConfig, ILaunchParams } from '../../../common/api';
import { api } from '../../logic/api';
import { Panels } from '../../logic/navigation';
import { toMsg } from '../../../common/errors';

import { CrossPlatformBack } from '../../utils/CrossPlatformBack';
import { EditGroup } from './EditGroup';

export interface ConfigurationProps {
	id: Panels;
    go: (to: Panels) => void;
    children: any;
    launchInfo: ILaunchParams;
    notify: (message: string, isError: boolean) => void;
}

export const Configuration = ({ id, go, children, launchInfo, notify }: ConfigurationProps) => {
    const [groupConfig, setGroupConfig] = useState<IGroupConfig>(undefined);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const fetchConfigStatus = async () => {
        const isGroupConfigured: boolean = await api.isGroupConfigured(launchInfo.groupId);

        if (isGroupConfigured) {
            const cfg: IGroupConfig = await api.getGroupConfig(launchInfo.groupId);
            setGroupConfig(cfg);
        } else {
            notify(`Промокод в этой группе еще не настроен`, true);
            setGroupConfig({
                hoursToGet: 0,
                postId: 0,
                promocode: undefined
            });
        }
    }

    const saveGroupParams = async (groupConfig: IGroupConfig) => {
        try {
            setIsSaving(true);
            const postExists = await api.checkWallPost(launchInfo.groupId, groupConfig.postId);
            if (!postExists) {
                notify(`Указанный пост не найден на стене сообщества`, true);
                return;
            }

            await api.saveGroupParams(launchInfo.groupId, groupConfig);
            notify('Сохранено', false);
        } catch (err) {
            notify(`Не удалось сохранить: ${toMsg(err)}`, true);
        } finally {
            setIsSaving(false);
        }
    }

    useEffect(() => {
        fetchConfigStatus()
            .catch(err => notify(`Не удалось получить статус: ${toMsg(err)}`, true));
    }, []);

	return <Panel id={id}>
		<PanelHeader
            left={<HeaderButton onClick={() => go(Panels.Home)}>{<CrossPlatformBack/>}</HeaderButton>}
        >Настройка</PanelHeader>
        <Group>
            <EditGroup 
                config={groupConfig}
                saveGroupParams={saveGroupParams}
                reset={() => fetchConfigStatus().catch(err => notify(`Не удалось сбросить статус: ${toMsg(err)}`, true))}
                groupId={launchInfo.groupId}
                saving={isSaving}
            />
        </Group>
        {children}
	</Panel>;
}
