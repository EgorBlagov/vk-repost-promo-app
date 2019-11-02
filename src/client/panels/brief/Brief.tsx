import "./Brief.css";

import { Button, Cell, Div, Group, List, Panel, PanelHeader } from "@vkontakte/vkui";
import * as React from "react";

import { toMsg } from "../../../common/utils";
import { api } from "../../logic/api";
import { Panels } from "../../logic/navigation";

export interface IBriefProps {
    id: Panels;
    children?: any;
    notify: (msg: string, isError: boolean) => void;
}

export const Brief = ({ id, children, notify }: IBriefProps) => {
    const onInstall = () => api.install().catch(err => notify(`Не удалось установить сервис: ${toMsg(err)}`, true));
    return (
        <Panel id={id}>
            <PanelHeader>Промокод за репост</PanelHeader>
            <Group>
                <List>
                    <Cell
                        multiline={true}
                        description={
                            <Div className="brief__description tool__flex">
                                Добавьте сервис в свое сообщество, настройте, и получите результат!
                            </Div>
                        }
                    >
                        <Div className="brief__header tool__flex">
                            Выдавайте промокоды за репосты и подписку на свое сообщество
                        </Div>
                    </Cell>
                    <Cell className="tool__flex">
                        <Button onClick={onInstall}>Установить в сообщество</Button>
                    </Cell>
                </List>
            </Group>
            {children}
        </Panel>
    );
};
