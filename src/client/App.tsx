import * as React from 'react';
import * as _ from 'lodash';

import { useState, useEffect } from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Div from '@vkontakte/vkui/dist/components/Div/Div';


import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';

import Home from './components/Home';
import Configuration from './components/Configuration';
import api from './api';

import '@vkontakte/vkui/dist/vkui.css';
import './App.css';

export const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [fetching, setFetching] = useState(true);
	const [fetchedMember, setIsMember] = useState(null);
	const [fetchedRepost, setIsRepost] = useState(null);
	const [snackbar, setSnackbar] = useState(null);
	const [ownedGroups, setOwnedGroups] = useState([]);
	const [editedGroup, setEditedGroup] = useState(undefined);
	const [fetchedLaunchInfo, setFetchedLaunchInfo] = useState(undefined);

	const init = async () => {
		const launchInfo = await api.getLaunchInfo();
		setFetchedLaunchInfo(launchInfo);
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
		window.onfocus = onRefresh;
		init().then(() => onRefresh());
		return () => {
			api.removeListener('event', listener);
			api.removeListener('error', errorHandler);
			window.onfocus = null;
		};
	// eslint-disable-next-line
	}, []);

	const go = (to: string) => {
		setActivePanel(to);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Home
				id='home'
				go={go}
				isMember={fetchedMember}
				isReposted={fetchedRepost}
				fetching={fetching}
				onRefresh={onRefresh}
				notify={(m)=>showSnackbar(false, m)}
				isOwner={!_.isEmpty(ownedGroups)}
				launchInfo={fetchedLaunchInfo}
			>
				{snackbar}
			</Home>
			<Configuration
				id='config'
				go={go}
				launchInfo={fetchedLaunchInfo}
			>
				{snackbar}
			</Configuration>
		</View>
	);
}
