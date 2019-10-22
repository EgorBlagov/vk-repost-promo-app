import * as React from 'react';
import { useEffect, useState } from 'react';

import { Panel, PanelHeader, PullToRefresh, Group, List, Div } from '@vkontakte/vkui';

import { Panels } from '../../logic/navigation';
import { ILaunchParams, IGroupConfig } from '../../../common/api';
import { AdminSettingsButton } from './AdminSettingsButton';
import { toMsg } from '../../../common/errors';
import { api } from '../../logic/api';
import { SubscribeLine } from './SubscribeLine';
import { RepostLine } from './RepostLine';
import { Promocode } from './Promocode';

export interface HomeProps {
	id: Panels;
	go: (to:Panels) => void;
	notify: (x: string, e: boolean) => void;
	children: any;
	launchInfo: ILaunchParams;
}

export const Home = ({ id, go, launchInfo, notify, children}: HomeProps) => {
	const [pullFetching, setPullFetching] = useState<boolean>(false);
	const [isMember, setIsMember] = useState<boolean>(undefined);
	const [groupConfig, setGroupConfig] = useState<IGroupConfig>(undefined);
	const [hasRepost, setHasRepost] = useState<boolean>(undefined);

	const fetchGroupConfig = async () => {
		try {
            const isGroupConfigured: boolean = await api.isGroupConfigured(launchInfo.groupId);
            if (isGroupConfigured) {
				const cfg: IGroupConfig = await api.getGroupConfig(launchInfo.groupId);
				setGroupConfig(cfg);
            }
        } catch (error) {
            notify(`Не удалось получить параметры: ${toMsg(error)}`, true);
        }
	}

	const onRefresh = async () => {
		if (groupConfig === undefined || launchInfo === undefined) {
			return;
		}

		setPullFetching(true);
		try {
			const isMember = await api.isMember(launchInfo.groupId);
			setIsMember(isMember);
			const hasRepost = await api.hasRepost(launchInfo.groupId, groupConfig.postId);
			setHasRepost(hasRepost);
		} catch (err) {
			notify(`Не удалось обновить: ${toMsg(err)}`, true);
		}

		setPullFetching(false);
	}

	useEffect(() => {
		fetchGroupConfig()
	}, []);

	useEffect(() => {
		window.addEventListener('focus', onRefresh);
		onRefresh();
		return () => window.removeEventListener('focus', onRefresh);
	}, [groupConfig])


	const renderContent = () => {
		if (groupConfig === undefined) {
			return <Group>
				<Div className='tool__error'>
					Администратор еще не настроил приложение в сообществе
				</Div> 
			</Group>
		} else {
			return <PullToRefresh onRefresh={onRefresh} isFetching={pullFetching}>
				<Group title={`Выполните задание и получите промокод!`} description="Потяните чтобы обновить">
					<List>
						<SubscribeLine
							groupId={launchInfo.groupId}
							isMember={isMember}
							notify={notify}
						/>
						<RepostLine
							groupId={launchInfo.groupId}
							hasRepost={hasRepost}
							postId={groupConfig.postId}
							notify={notify}
						/>
					</List>
				</Group>
				{isMember && hasRepost && <Group title="Ваш промокод">
					<Promocode
						groupId={launchInfo.groupId}
						notify={notify}
					/>
				</Group>}
			</PullToRefresh>
		}
	}

	return <Panel id={id}>
		<PanelHeader left={<AdminSettingsButton isAdmin={launchInfo.isAdmin} go={go}/>}>Бонус</PanelHeader>
		{renderContent()}
		{children}
	</Panel>;

}
