import * as React from 'react';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';

import { Panel, PanelHeader, HeaderButton, Group } from '@vkontakte/vkui';

import { IAdminGroupConfig, ILaunchParams } from '../../../common/types';
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
    const [groupConfig, setGroupConfig] = useState<IAdminGroupConfig>(undefined);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const fetchConfigStatus = async () => {
        try {
            const isGroupConfigured: boolean = await api.isGroupConfigured();

            if (isGroupConfigured) {
                const cfg: IAdminGroupConfig = await api.getGroupConfig();
                setGroupConfig(cfg);
            } else {
                notify(`Промокод в этой группе еще не настроен`, true);
                setGroupConfig({
                    hoursToGet: 0,
                    postId: 0,
                    promocode: undefined
                });
            }
        } catch (error) {
            notify(toMsg(error), true);
        }
    }

    const saveGroupParams = async (groupConfig: IAdminGroupConfig) => {
        try {
            setIsSaving(true);
            const postExists = await api.checkWallPost(launchInfo.groupId, groupConfig.postId);
            if (!postExists) {
                notify(`Указанный пост не найден на стене сообщества`, true);
                return;
            }

            await api.saveGroupConfig(groupConfig);
            notify('Сохранено', false);
        } catch (err) {
            notify(`Не удалось сохранить: ${toMsg(err)}`, true);
        } finally {
            setIsSaving(false);
        }
    }

    useEffect(() => {
        fetchConfigStatus();
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
