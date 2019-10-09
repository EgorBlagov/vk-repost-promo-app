import * as React from 'react';
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

import * as CopyToClipboard from 'react-copy-to-clipboard';

import './Repost.css';

import api from '../api';

export interface RepostProps {
	id: string;
	go: (to:string)=>void;
	isMember: boolean;
	isReposted: boolean;
	snackbar: React.Component;
	onRefresh: ()=>void;
	fetching: boolean;
	notify: (x:string)=>void;
}

const Repost = ({ id, go, isMember, isReposted, snackbar, onRefresh, fetching, notify }: RepostProps) => {
	const promo = 'TY-OBYEBOS';
	const renderPromocode = ()  => {
		if (isMember && isReposted) {
			const aside = <CopyToClipboard text={promo}>
				<Button size="m" onClick={() => notify('Скопировано')}>Скопировать</Button>
			</CopyToClipboard>;
			
			return <Cell asideContent={aside}>
				<Div className='Done' id='promo'>{promo}</Div>
			</Cell>;
		} else {
			return <Div className='NotDone'>Условия не выполнены</Div>;
		}
	}
	const renderIcon = (ok?: boolean) => {
		if (ok === true) {
			return <Icon16CheckCircle className='Done'/>;
		} else if (ok === false) {
			return <Icon16Clear  className='NotDone'/>;
		} else {
			return <Avatar size={16}><Spinner size="small"/></Avatar>
		}
	}
    const renderSubscribe = () => {
        let aside = <div style={{ display: 'flex' }}>
            <Button size="m" onClick={()=> api.Subscribe()}>Подписаться</Button>
        </div>

        if (isMember) {
            aside = null;
        }

        return <Cell
            before={renderIcon(isMember)}
            asideContent={aside}
			multiline
        >
            Подписаться на <Link href={api.groupUrl} target="_blank">наше</Link> сообщество
        </Cell> 
	};
	
	const renderRepost = () => {
		let aside = <div style={{ display: 'flex' }}>
			<Button component="a" size="m" href={api.url}>Открыть</Button>
        </div>

        if (isReposted) {
			aside = null;
		}
		
		return <Cell
			before={renderIcon(isReposted)}
			asideContent={aside}
			multiline
		>
			Поделиться <Link href={api.url} target="_blank">этой</Link> записью
		</Cell>
	}

	return <Panel id={id}>
		<PanelHeader>Бонус</PanelHeader>
		<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
			<Group title={`Выполни задание и получи бонус!`} description="Потяни чтобы обновить">
				<List>
					{renderSubscribe()}     
					{renderRepost()}     
				</List>
			</Group>
			<Group title="Твой промокод">
				{renderPromocode()}
			</Group>
		</PullToRefresh>
		
		{snackbar}
	</Panel>;
}

export default Repost;