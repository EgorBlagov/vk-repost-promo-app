import * as React from 'react';
import { useEffect, useState } from 'react';

import { Panel, PanelHeader, PullToRefresh, Group, List, Div, Cell, Button } from '@vkontakte/vkui';

import { Panels } from '../../logic/navigation';
import { ILaunchParams, IUserStatus, IGroupRequirement } from '../../../common/types';
import { AdminSettingsButton } from './AdminSettingsButton';
import { toMsg } from '../../../common/errors';
import { api } from '../../logic/api';
import { SubscribeLine } from './SubscribeLine';
import { RepostLine } from './RepostLine';
import { Promocode } from './Promocode';
import { TimeProcessor } from '../../../common/time-processor';
import { safeGet, isOk } from '../../../common/utils';

export interface HomeProps {
	id: Panels;
	go: (to:Panels) => void;
	notify: (x: string, e: boolean) => void;
	children: any;
	launchInfo: ILaunchParams;
}

export const Home = ({ id, go, launchInfo, notify, children}: HomeProps) => {
	const [pullFetching, setPullFetching] = useState<boolean>(false);
	const [groupRequirement, setGroupRequirement] = useState<IGroupRequirement>(undefined);
	const [userStatus, setUserStatus] = useState<IUserStatus>(undefined);
	const [tokenReceived, setTokenReceived] = useState<boolean>(false);

	const fetchGroupConfig = async () => {
		try {
            const isGroupConfigured: boolean = await api.isGroupConfigured();
            if (isGroupConfigured) {
				const cfg = await api.getGroupRequirement();
				setGroupRequirement(cfg);
            }
        } catch (error) {
            notify(`Не удалось получить параметры: ${toMsg(error)}`, true);
        }
	}

	const tryAuthorize = () => {
		const call = async () => {
			if (!api.hasToken) {
				await api.obtainToken();
			}

			setTokenReceived(api.hasToken);
		}

		call().catch(err => `Не удалось получить доступ: ${toMsg(err)}`);
	}

	const onRefresh = async () => {
		if (!isOk(groupRequirement) || !isOk(launchInfo) || !tokenReceived) {
			return;
		}

		setPullFetching(true);
		try {
			const status = await api.getUserStatus();
			setUserStatus(status);
		} catch (err) {
			notify(`Не удалось обновить: ${toMsg(err)}`, true);
		}

		setPullFetching(false);
	}

	useEffect(() => {
		tryAuthorize();
		fetchGroupConfig()
	}, []);

	useEffect(() => {
		window.addEventListener('focus', onRefresh);
		onRefresh();
		return () => window.removeEventListener('focus', onRefresh);
	}, [groupRequirement, tokenReceived])


	const hasRepost = userStatus && userStatus.repost.reposted && TimeProcessor.isTimePassed(userStatus.repost.postDate, groupRequirement.hoursToGet);
	const renderContent = () => {
		if (!tokenReceived) {
			return <Group>
				<Cell asideContent={<Button onClick={() => tryAuthorize()}>Авторизация</Button>}>
					Приложению необходим доступ для работы
				</Cell>
			</Group>
		}

		if (groupRequirement === undefined) {
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
							isMember={safeGet(userStatus, u => u.member)}
							notify={notify}
							onRefresh={onRefresh}
						/>
						<RepostLine
							groupId={launchInfo.groupId}
							repostInfo={safeGet(userStatus, u => u.repost)}
							postId={groupRequirement.postId}
							hoursToGet={groupRequirement.hoursToGet}
						/>
					</List>
				</Group>
				{safeGet(userStatus, u => u.member) && hasRepost && <Group title="Ваш промокод"> 
					<Promocode
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
