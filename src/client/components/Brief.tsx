import * as React from 'react';
import { Div, Panel, Group, List, Cell, Button, PanelHeader } from "@vkontakte/vkui"
import './Brief.css'
import api from '../api';
import { Panels } from '../navigation';
export interface BriefProps {
    id: Panels;
    children?: any;
}

export const Brief = ({id, children}:BriefProps) => {
    return <Panel
        id={id}
    >
        <PanelHeader>
            Промокод за репост
        </PanelHeader>
        <Group>
            <List>
                <Cell multiline
                    description={<Div className='centered-panel brief__header__description'>
                        Добавьте сервис в свое сообщество, настройте, и получите результат!
                        </Div>}>
                    <Div  className='centered-panel brief__header'>
                        Выдавай промокоды за репосты и подписку на свое сообщество
                    </Div>
                </Cell>
                <Cell className='centered-panel'>
                    <Button onClick={async () => api.install()}>Установить в сообщество</Button>
                </Cell>
            </List>
        </Group>
        {children}
    </Panel>
}