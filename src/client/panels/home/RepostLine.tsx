import { Button, Cell, Div, Link, Spinner } from "@vkontakte/vkui";
import * as React from "react";
import { useState } from "react";
import { TimeProcessor } from "../../../common/time-processor";
import { TRepostInfo } from "../../../common/types";
import { useInterval } from "../../logic/hooks";
import { wallProcessor } from "../../logic/wall-processor";
import { StatusIcon } from "./StatusIcon";

interface IProps {
    repostInfo: TRepostInfo;
    groupId: number;
    postId: number;
    hoursToGet: number;
}

export const RepostLine = ({ repostInfo, groupId, postId, hoursToGet }: IProps) => {
    const [secondsLeft, setSecondsLeft] = useState<string>(undefined);

    useInterval(() => {
        if (repostInfo && repostInfo.reposted && !TimeProcessor.isTimePassed(repostInfo.postDate, hoursToGet)) {
            setSecondsLeft(TimeProcessor.getTimeLeft(repostInfo.postDate, hoursToGet));
        }
    }, 1000);

    const renderAside = () => {
        if (repostInfo === undefined) {
            return null;
        }

        if (!repostInfo.reposted) {
            return (
                <div style={{ display: "flex" }}>
                    <Button
                        component="a"
                        size="m"
                        href={wallProcessor.generatePostUrl(groupId, postId)}
                        target="_blank"
                    >
                        Открыть
                    </Button>
                </div>
            );
        } else {
            if (!TimeProcessor.isTimePassed(repostInfo.postDate, hoursToGet)) {
                const seconds = !!secondsLeft ? secondsLeft : <Spinner style={{ marginLeft: "10px" }} size="small" />;
                return <Div style={{ display: "flex", alignItems: "center", padding: "0px" }}>осталось {seconds} </Div>;
            } else {
                return null;
            }
        }
    };

    return (
        <Cell
            before={
                <StatusIcon
                    isOk={
                        repostInfo && repostInfo.reposted && TimeProcessor.isTimePassed(repostInfo.postDate, hoursToGet)
                    }
                />
            }
            asideContent={renderAside()}
            multiline={true}
        >
            Поделиться{" "}
            <Link href={wallProcessor.generatePostUrl(groupId, postId)} target="_blank">
                этой
            </Link>{" "}
            записью
        </Cell>
    );
};
