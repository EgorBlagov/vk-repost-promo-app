import * as React from 'react';
import * as _ from 'lodash';

import { useState, useEffect } from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';

import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';

import Home from './panels/home/Home';
import Configuration from './panels/config/Configuration';
import api from './logic/api';

import '@vkontakte/vkui/dist/vkui.css';
import './App.css';
import { Brief } from './panels/brief/Brief';
import { LaunchParams } from '../common/api';
import { Panels } from './logic/navigation';

export const App = () => {
	const [activePanel, setActivePanel] = useState<Panels>(Panels.Empty);
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState<React.ReactNode>(<ScreenSpinner size='large' />);
	const [fetching, setFetching] = useState<boolean>(true);
	const [fetchedMember, setIsMember] = useState<boolean>(null);
	const [fetchedRepost, setIsRepost] = useState<boolean>(null);
	const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
	const [ownedGroups, setOwnedGroups] = useState<number[]>([]);
	const [fetchedLaunchInfo, setFetchedLaunchInfo] = useState<LaunchParams>(undefined);

	const init = async () => {
		const launchInfo = await api.getLaunchInfo();
		setFetchedLaunchInfo(launchInfo);
		if (launchInfo.groupId !== undefined) {
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
		
		const user = await api.getUserInfo();
		setUser(user);
		const isMember = await api.isMember();
		setIsMember(isMember);
		const isRepost = await api.isRepost();
		setIsRepost(isRepost);
		const ownedGroups = await api.getOwnedGroups();
		setOwnedGroups(ownedGroups);
		setPopout(null);
		setFetching(false);
	}

	const showSnackbar = (isError: boolean, message: string) => {
		let before = <Icon16CheckCircle className='Success'/>;
		
		if (isError) {
			before = <Icon16Clear className='Error' />;
		}

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

	
	const errorHandler = ({error, critical}: {error: string, critical: boolean}) => {
		showSnackbar(true, `Ошибка: ${error}`);
	}

	const listener = (type: string, data: any) => {
		if (type === 'VKWebAppUpdateConfig') {
			const schemeAttribute = document.createAttribute('scheme');
			schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
			document.body.attributes.setNamedItem(schemeAttribute);
		}
		if (type === 'VKWebAppJoinGroupResult') {
			setIsMember(data.result);
		}
		if (type === 'VKWebAppJoinGroupFailed ') {
			setIsMember(false);
		}
	};

	useEffect(() => {
		api.addListener('event', listener);
		api.addListener('error', errorHandler);
		init();
		return () => {
			api.removeListener('event', listener);
			api.removeListener('error', errorHandler);
			deinit();
		};
	// eslint-disable-next-line
	}, []);

	const go = (to: Panels) => {
		setSnackbar(null);
		setActivePanel(to);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Panel id={Panels.Empty}/>
			<Brief id={Panels.Brief}>
				{snackbar}
			</Brief>
			<Home
				id={Panels.Home}
				go={go}
				isMember={fetchedMember}
				isReposted={fetchedRepost}
				fetching={fetching}
				onRefresh={onRefresh}
				notify={(m)=>showSnackbar(false, m)}
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
