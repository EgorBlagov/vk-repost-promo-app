import * as React from 'react';

import { PullToRefresh, Group, List, Button, Cell, Avatar, Div, Spinner, Link } from '@vkontakte/vkui';
import { Icon16Clear, Icon16CheckCircle } from '../../icons';

import * as CopyToClipboard from 'react-copy-to-clipboard';
import { api } from '../../logic/api';
import { wallProcessor } from '../../logic/wall-processor';

export interface RepostProps {
    onRefresh: () => void;
    fetching: boolean;
    isMember: boolean;
    isReposted: boolean;
    groupId: number;
    promo: string;
    notify: (x:string) => void;
}

export const Repost = ({onRefresh, fetching, isReposted, isMember, notify, groupId, promo}: RepostProps) => {
    const renderPromocode = () => {
		if (isMember && isReposted) {
			const aside = <CopyToClipboard text={promo}>
				<Button size="m" onClick={() => notify('Скопировано')}>Скопировать</Button>
			</CopyToClipboard>;
			
			return <Cell asideContent={aside}>
				<Div className='tool__success' id='promo'>{promo}</Div>
			</Cell>;
		} else {
			return <Div className='tool__error'>Условия не выполнены</Div>;
		}
	}
	const renderIcon = (ok?: boolean) => {
		if (ok === true) {
			return <Icon16CheckCircle className='tool__success'/>;
		} else if (ok === false) {
			return <Icon16Clear  className='tool__error'/>;
		} else {
			return <Avatar size={16}><Spinner size="small"/></Avatar>
		}
	}
    const renderSubscribe = () => {
        let aside = <div style={{ display: 'flex' }}>
            <Button size="m" onClick={async ()=> {
                console.log('sub');
                const res = await api.Subscribe();
                console.log(res);
            }}>Подписаться</Button>
        </div>

        if (isMember) {
            aside = null;
        }

        return <Cell
            before={renderIcon(isMember)}
            asideContent={aside}
			multiline
        >
            Подписаться на <Link href={wallProcessor.getGroupUrl(groupId)} target="_blank">наше</Link> сообщество
        </Cell> 
	};
	
	const renderRepost = () => {
		let aside = <div style={{ display: 'flex' }}>
			<Button component="a" size="m" href={api.url} target="_blank">Открыть</Button>
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
    
    return <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
        <Group title={`Выполните задание и получи бонус!`} description="Потяните чтобы обновить">
            <List>
                {renderSubscribe()}     
                {renderRepost()}
            </List>
        </Group>
        <Group title="Ваш промокод">
            {renderPromocode()}
        </Group>
    </PullToRefresh>
}
