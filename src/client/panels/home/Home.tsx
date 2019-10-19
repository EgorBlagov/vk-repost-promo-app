import * as React from 'react';

import { Panel, PanelHeader, HeaderButton } from '@vkontakte/vkui';
import { Icon28Settings } from '../../icons';

import { Repost } from './Repost';
import { Panels } from '../../logic/navigation';
import { ILaunchParams } from '../../../common/api';

export interface HomeProps {
	id: Panels;
	go: (to:Panels) => void;
	isMember: boolean;
	isReposted: boolean;
	onRefresh: () => void;
	fetching: boolean;
	notify: (x:string) => void;
	children: any;
	launchInfo: ILaunchParams;
}

export const Home = ({ id, go, launchInfo, isMember, isReposted, onRefresh, fetching, notify, children}: HomeProps) => {
	const left = launchInfo.isAdmin? <HeaderButton onClick={() => go(Panels.Configure)} style={{marginLeft: '6px'}}>{<Icon28Settings/>}</HeaderButton> : null;
	return <Panel id={id}>
		<PanelHeader left={left}>Бонус</PanelHeader>
		{launchInfo && launchInfo.groupId && <Repost
			fetching={fetching}
			onRefresh={onRefresh}
			isMember={isMember}
			isReposted={isReposted}
			notify={notify}
			promo='PROMO-TEST'
		/>}
		{children}
	</Panel>;
}
