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

const osname = platform();

export interface ConfigurationProps {
	id: string;
    go: (to:string)=>void;
    children: any;
    launchInfo: any;

}

const Configuration = ({ id, go, children, launchInfo }: ConfigurationProps) => {
    const renderOpenFromGroup = () => {
        return <Group title="Информация">
            <Div>
                Для настройки приложения установите его в свое сообщество и откройте из сообщества
            </Div>
        </Group>
    }

    const renderContent = () => {
        if (!launchInfo.is_admin) {
            return renderOpenFromGroup();
        } else {
            return <EditGroup/>
        }
    }

	return <Panel id={id}>
		<PanelHeader
            left={<HeaderButton onClick={()=>go('home')}>{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}</HeaderButton>}
        >Настройка</PanelHeader>
        {renderContent()}
        {children}
	</Panel>;
}

export default Configuration;