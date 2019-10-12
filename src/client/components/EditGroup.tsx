import * as React from 'react';
import * as _ from 'lodash';
import { useState, useEffect} from 'react';

import { platform, IOS, InfoRow } from '@vkontakte/vkui';

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

const osname = platform();

export interface EditGroupProps {

}

const EditGroup = ({  }: EditGroupProps) => {
    const renderEditGroup = () => {
        return <List>
            <Group>
                
            </Group>
        </List>
    }

	return renderEditGroup();
}

export default EditGroup;