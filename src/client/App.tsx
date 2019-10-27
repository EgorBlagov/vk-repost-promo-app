import '@vkontakte/vkui/dist/vkui.css';
import './App.css';

import * as React from 'react';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';

import { ScreenSpinner, Snackbar, View, Panel } from '@vkontakte/vkui';
import { Icon16CheckCircle, Icon16Clear } from './external';

import { api } from './logic/api';
import { Panels } from './logic/navigation';
import { ILaunchParams } from '../common/types';

import { Brief } from './panels/brief/Brief';
import { Configuration } from './panels/config/Configuration';
import { Home } from './panels/home/Home';
import { toMsg } from '../common/errors';

export const App = () => {
	const [activePanel, setActivePanel] = useState<Panels>(Panels.Empty);
	const [isFetching, setIsFetching] = useState<boolean>(true);
	const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
	const [fetchedLaunchInfo, setFetchedLaunchInfo] = useState<ILaunchParams>(undefined);

	const init = async () => {
		try {
			const launchInfo = await api.getLaunchInfo();
			setFetchedLaunchInfo(launchInfo);
			if (launchInfo !== undefined && launchInfo.groupId !== undefined) {
				setActivePanel(Panels.Home);
			} else {
				setActivePanel(Panels.Brief);
			}
			setIsFetching(false);
		} catch (error) {
			showSnackbar(toMsg(error), true);
		}
	}

	const deinit = async () => {
	}

	const showSnackbar = (message: string, isError: boolean) => {
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
		<View activePanel={activePanel} popout={isFetching && <ScreenSpinner size={"large"}/>}>
			<Panel id={Panels.Empty}/>
			<Brief id={Panels.Brief}
				notify={showSnackbar}
			>
				{snackbar}
			</Brief>
			<Home
				id={Panels.Home}
				go={go}
				notify={showSnackbar}
				launchInfo={fetchedLaunchInfo}
			>
				{snackbar}
			</Home>
			<Configuration
				id={Panels.Configure}
				go={go}
				launchInfo={fetchedLaunchInfo}
				notify={showSnackbar}
			>
				{snackbar}
			</Configuration>
		</View>
	);
}
