import * as React from 'react';

import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Spinner from '@vkontakte/vkui/dist/components/Spinner/Spinner';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderContext from '@vkontakte/vkui/dist/components/HeaderContext/HeaderContext';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Icon28Settings from '@vkontakte/icons/dist/28/settings';
import Group from '@vkontakte/vkui/dist/components/Group/Group';

import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';

import List from '@vkontakte/vkui/dist/components/List/List';
import Link from '@vkontakte/vkui/dist/components/Link/Link';

import * as CopyToClipboard from 'react-copy-to-clipboard';

import api from '../api';
import Repost from './Repost';

export interface HomeProps {
	id: string;
	go: (to:string)=>void;
	isMember: boolean;
	isReposted: boolean;
	onRefresh: ()=>void;
	fetching: boolean;
	notify: (x:string)=>void;
	isOwner: boolean;
	children: any;
	launchInfo: any;
}

const Home = ({ id, go, launchInfo, isMember, isReposted, onRefresh, fetching, notify, isOwner, children}: HomeProps) => {
	return <Panel id={id}>
		<PanelHeader>Бонус</PanelHeader>
		{launchInfo && launchInfo.group_id && <Repost
			fetching={fetching}
			onRefresh={onRefresh}
			isMember={isMember}
			isReposted={isReposted}
			notify={notify}
			promo='PROMO-TEST'
		/>}
		{isOwner && 
			<CellButton onClick={ () => go("config") }>
				Настройки в сообществе...
			</CellButton>
		}
		{children}
	</Panel>;
}

export default Home;