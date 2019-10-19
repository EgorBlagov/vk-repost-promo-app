import * as React from 'react';
import * as _ from 'lodash';
import { useState, useEffect} from 'react';

import { platform, IOS } from '@vkontakte/vkui';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';

import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import api from '../../logic/api';
import EditGroup from './EditGroup';
import { Panels } from '../../logic/navigation';
import { IGroupConfig, LaunchParams, IGroupConfiguredResult, IGroupConfigResult } from '../../../common/api';

const osname = platform();

export interface ConfigurationProps {
	id: Panels;
    go: (to: Panels) => void;
    children: any;
    launchInfo: LaunchParams;
    notify: (message: string, isError: boolean) => void;
}

const Configuration = ({ id, go, children, launchInfo, notify }: ConfigurationProps) => {
    const [groupConfig, setGroupConfig] = useState<IGroupConfig>(undefined);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const fetchConfigStatus = async () => {
        const groupAvailableStatus: IGroupConfiguredResult = await api.isGroupConfigured(launchInfo.groupId);

        if (groupAvailableStatus.isConfigured) {
            const cfg: IGroupConfig = await api.getGroupConfig(launchInfo.groupId);
            setGroupConfig(cfg);
        } else {
            notify(`Промокод в этой группе еще не настроен`, true);
            setGroupConfig({
                hoursToGet: 0,
                postId: 0,
                promocode: 'введите промокод'
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
            notify(`Не удалось сохранить: ${err}`, true);
        } finally {
            setIsSaving(false);
        }
    }

    useEffect(() => {
        fetchConfigStatus()
            .catch(err => notify(`Не удалось получить статус: ${err}`, true));
    }, []);

    const renderContent = () => {
        
    }

	return <Panel id={id}>
		<PanelHeader
            left={<HeaderButton onClick={()=>go(Panels.Home)}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
        >Настройка</PanelHeader>
        <Group>    
            <EditGroup 
                config={groupConfig}
                saveGroupParams={saveGroupParams}
                reset={()=>fetchConfigStatus().catch(err => notify(`Не удалось сбросить статус: ${err}`, true))}
                groupId={launchInfo.groupId}
                saving={isSaving}
            />
        </Group>
        {children}
	</Panel>;
}

export default Configuration;