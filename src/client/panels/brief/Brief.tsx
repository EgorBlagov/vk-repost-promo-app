import './Brief.css';

import * as React from 'react';
import { Div, Panel, Group, List, Cell, Button, PanelHeader } from "@vkontakte/vkui"

import { Panels } from '../../logic/navigation';
import { api } from '../../logic/api';

export interface BriefProps {
    id: Panels;
    children?: any;
}

export const Brief = ({id, children}: BriefProps) => {
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
                        Выдавай промокоды за репосты и подписку на свое сообщество
                    </Div>
                </Cell>
                <Cell className='tool__flex'>
                    <Button onClick={async () => api.install()}>Установить в сообщество</Button>
                </Cell>
            </List>
        </Group>
        {children}
    </Panel>
}
