import { Button, Cell, Link } from "@vkontakte/vkui";
import * as React from "react";
import { toMsg } from "../../../common/utils";
import { api } from "../../logic/api";
import { wallProcessor } from "../../logic/wall-processor";
import { StatusIcon } from "./StatusIcon";

interface IProps {
    isMember: boolean;
    groupId: number;
    notify: (msg: string, isErrror: boolean) => void;
    onRefresh: () => void;
}

export const SubscribeLine = ({ isMember, groupId, notify, onRefresh }: IProps) => {
    const onClickSubscribe = () => {
        api.Subscribe(groupId)
            .then(onRefresh)
            .catch(err => notify(`Не удалось подписаться: ${toMsg(err)}`, true));
    };

    const subscribeButton = (
        <div style={{ display: "flex" }}>
            <Button size="m" onClick={onClickSubscribe}>
                Подписаться
            </Button>
        </div>
    );

    return (
        <Cell before={<StatusIcon isOk={isMember} />} asideContent={!isMember && subscribeButton} multiline={true}>
            Подписаться на{" "}
            <Link href={wallProcessor.getGroupUrl(groupId)} target="_blank">
                наше
            </Link>{" "}
            сообщество
        </Cell>
    );
};
