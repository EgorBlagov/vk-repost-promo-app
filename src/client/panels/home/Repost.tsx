import * as React from 'react';
import PullToRefresh from '@vkontakte/vkui/dist/components/PullToRefresh/PullToRefresh';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import List from '@vkontakte/vkui/dist/components/List/List';

import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Spinner from '@vkontakte/vkui/dist/components/Spinner/Spinner';

import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';

import Link from '@vkontakte/vkui/dist/components/Link/Link';

import * as CopyToClipboard from 'react-copy-to-clipboard';
import { api } from '../../logic/api';

export interface RepostProps {
    onRefresh: ()=>void;
    fetching: boolean;
    isMember: boolean;
    isReposted: boolean;
    promo: string;
    notify: (x:string)=>void;
}
const Repost = ({onRefresh, fetching, isReposted, isMember, notify, promo}: RepostProps) => {
    const renderPromocode = ()  => {
		if (isMember && isReposted) {
			const aside = <CopyToClipboard text={promo}>
				<Button size="m" onClick={() => notify('Скопировано')}>Скопировать</Button>
			</CopyToClipboard>;
			
			return <Cell asideContent={aside}>
				<Div className='Success' id='promo'>{promo}</Div>
			</Cell>;
		} else {
			return <Div className='Error'>Условия не выполнены</Div>;
		}
	}
	const renderIcon = (ok?: boolean) => {
		if (ok === true) {
			return <Icon16CheckCircle className='Success'/>;
		} else if (ok === false) {
			return <Icon16Clear  className='Error'/>;
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
}

export default Repost;