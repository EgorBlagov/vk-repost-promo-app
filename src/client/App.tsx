import * as React from 'react';

import { useState, useEffect } from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Div from '@vkontakte/vkui/dist/components/Div/Div';


import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';

import Repost from './components/Repost';
import api from './api';

import '@vkontakte/vkui/dist/vkui.css';
import './App.css';

export const App = () => {
	const [activePanel, setActivePanel] = useState('repost');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [fetchedMember, setIsMember] = useState(null);
	const [fetchedRepost, setIsRepost] = useState(null);
	const [snackbar, setSnackbar] = useState(null);
	const [fetching, setFetching] = useState(true);

	const onRefresh = async () => {
		setFetching(true);
		const user = await api.getUserInfo();
		setUser(user);
		const isMember = await api.isMember();
		setIsMember(isMember);
		const isRepost = await api.isRepost();
		setIsRepost(isRepost);
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

	
	const errorHandler = (errorReason: string) => {
		showSnackbar(true, `Ошибка: ${errorReason}`);
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
		onRefresh();
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
			<Repost
				id='repost'
				go={go}
				isMember={fetchedMember}
				isReposted={fetchedRepost}
				snackbar={snackbar}
				fetching={fetching}
				onRefresh={onRefresh}
				notify={(m)=>showSnackbar(false, m)}
			/>
		</View>
	);
}
