import * as React from 'react';
import * as _ from 'lodash';
import { useState, useEffect} from 'react';

import { platform, IOS } from '@vkontakte/vkui';

import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Spinner from '@vkontakte/vkui/dist/components/Spinner/Spinner';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import List from '@vkontakte/vkui/dist/components/List/List';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import PullToRefresh from '@vkontakte/vkui/dist/components/PullToRefresh/PullToRefresh';

import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';

import api from '../api';
import EditGroup from './EditGroup';
import { Panels } from '../navigation';
import { IGroupConfig, LaunchParams, IGroupConfiguredResult, IGroupConfigResult } from '../../common/api';

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
    
    const fetchConfigStatus = async () => {
        const response = await fetch(`/api/groups/${launchInfo.group_id}/available`);
        const groupAvailableStatus: IGroupConfiguredResult = await response.json();

        if (groupAvailableStatus.isConfigured) {
            const response = await fetch(`/api/groups/${launchInfo.group_id}`);
            const json: IGroupConfigResult = await response.json();
            setGroupConfig(json.config);
        } else {
            notify('Промокод в этой группе еще не настроен', true);
            setGroupConfig({
                hoursToGet: 0,
                postId: 0,
                promocode: 'введите промокод'
            });
        }
    }

    const saveGroupParams = () => {
        fetch(`/api/groups/${launchInfo.group_id}`, {
            method: 'PUT',
            body: JSON.stringify(groupConfig), // data can be `string` or {object}!
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((res) => {
            if (res.status === 500) {
                res.json().then(json => {
                    notify(`Не удалось сохранить параметры: ${JSON.stringify(json.error)}`, true);
                });
            } else {
                notify('Сохранено', false)}
            }
        ).catch(err => notify(`Не удалось сохранить параметры: ${err}`, true));
    }

    useEffect(() => {
        fetchConfigStatus()
            .catch(err => notify(`Не удалось получить статус: ${err}`, true));
    }, []);

    const renderContent = () => {
        if (groupConfig === undefined) {
            return <Spinner size="large"/>
        } else {
            return (
                <Group>
                    <Div>{`промокод: ${groupConfig.promocode}`}</Div>
                    <Button onClick={() => saveGroupParams()}>Сохранить</Button>
                </Group>
            );
        }
    }

	return <Panel id={id}>
		<PanelHeader
            left={<HeaderButton onClick={()=>go(Panels.Home)}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
        >Настройка</PanelHeader>
        {renderContent()}
        {children}
	</Panel>;
}

export default Configuration;