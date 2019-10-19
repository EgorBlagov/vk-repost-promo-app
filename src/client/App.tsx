import '@vkontakte/vkui/dist/vkui.css';
import './App.css';

import * as React from 'react';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';

import { ScreenSpinner, Snackbar, View, Panel } from '@vkontakte/vkui';
import { Icon16CheckCircle, Icon16Clear } from './icons';

import { api } from './logic/api';
import { Panels } from './logic/navigation';
import { ILaunchParams } from '../common/api';

import { Brief } from './panels/brief/Brief';
import { Configuration } from './panels/config/Configuration';
import { Home } from './panels/home/Home';
import { toMsg } from '../common/errors';

export const App = () => {
	const [activePanel, setActivePanel] = useState<Panels>(Panels.Empty);
	const [popout, setPopout] = useState<React.ReactNode>(<ScreenSpinner size='large' />);
	const [fetching, setFetching] = useState<boolean>(true);
	const [fetchedMember, setIsMember] = useState<boolean>(null);
	const [fetchedRepost, setIsRepost] = useState<boolean>(null);
	const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
	const [fetchedLaunchInfo, setFetchedLaunchInfo] = useState<ILaunchParams>(undefined);

	const init = async () => {
		let launchInfo = undefined;
		try {
			launchInfo = await api.getLaunchInfo();
			setFetchedLaunchInfo(launchInfo);
		} catch (error) {
			showSnackbar(true, toMsg(error));
		}

		if (launchInfo !== undefined && launchInfo.groupId !== undefined) {
			window.onfocus = onRefresh;
			setActivePanel(Panels.Home);
			await onRefresh();
		} else {
			setActivePanel(Panels.Brief);
			setPopout(null);
			setFetching(false);
		}
	}

	const deinit = async () => {
		window.onfocus = undefined;
	}

	const onRefresh = async () => {
		setFetching(true);
		try {
			const isMember = await api.isMember();
			setIsMember(isMember);
			const isRepost = await api.isRepost();
			setIsRepost(isRepost);
		} catch (error) {
			showSnackbar(true, `Не удалось получить данные: ${toMsg(error)}`);
		}
		setPopout(null);
		setFetching(false);
	}

	const showSnackbar = (isError: boolean, message: string) => {
		const before = isError
			? <Icon16Clear className='tool__error' />
			: <Icon16CheckCircle className='tool__success'/>;

		setSnackbar(
			<Snackbar 
				layout='vertical'
				onClose={() => {setSnackbar(null); return {}}}
				before={before}
			>
				{message}
			</Snackbar>
		);
	}

	useEffect(() => {
		init();
		return () => deinit();
	}, []);

	const go = (to: Panels) => {
		setSnackbar(null);
		setActivePanel(to);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Panel id={Panels.Empty}/>
			<Brief id={Panels.Brief}
				notify={(m, e) => showSnackbar(e, m)}
			>
				{snackbar}
			</Brief>
			<Home
				id={Panels.Home}
				go={go}
				isMember={fetchedMember}
				isReposted={fetchedRepost}
				fetching={fetching}
				onRefresh={onRefresh}
				notify={(m) => showSnackbar(false, m)}
				launchInfo={fetchedLaunchInfo}
			>
				{snackbar}
			</Home>
			<Configuration
				id={Panels.Configure}
				go={go}
				launchInfo={fetchedLaunchInfo}
				notify={(m, e) => showSnackbar(e, m)}
			>
				{snackbar}
			</Configuration>
		</View>
	);
}
