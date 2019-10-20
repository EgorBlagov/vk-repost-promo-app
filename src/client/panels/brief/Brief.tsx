import './Brief.css';

import * as React from 'react';
import { Div, Panel, Group, List, Cell, Button, PanelHeader } from "@vkontakte/vkui"

import { Panels } from '../../logic/navigation';
import { api } from '../../logic/api';
import { toMsg } from '../../../common/errors';

export interface BriefProps {
    id: Panels;
    children?: any;
    notify: (msg: string, isError: boolean) => void;
}

export const Brief = ({id, children, notify}: BriefProps) => {
    return <Panel id={id}>
        <PanelHeader>
            Промокод за репост
        </PanelHeader>
        <Group>
            <List>
                <Cell multiline
                    description={<Div className='brief__description tool__flex'>
                        Добавьте сервис в свое сообщество, настройте, и получите результат!
                        </Div>}>
                    <Div  className='brief__header tool__flex'>
                        Выдавайте промокоды за репосты и подписку на свое сообщество
                    </Div>
                </Cell>
                <Cell className='tool__flex'>
                    <Button onClick={() => api.install().catch(err => notify(`Не удалось установить сервис: ${toMsg(err)}`, true))}>Установить в сообщество</Button>
                </Cell>
            </List>
        </Group>
        {children}
    </Panel>
}
