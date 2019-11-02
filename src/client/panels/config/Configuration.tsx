import * as _ from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";

import { Group, HeaderButton, Panel, PanelHeader } from "@vkontakte/vkui";

import { IAdminGroupConfig, ILaunchParams } from "../../../common/types";
import { toMsg } from "../../../common/utils";
import { api } from "../../logic/api";
import { Panels } from "../../logic/navigation";

import { CrossPlatformBack } from "../../utils/CrossPlatformBack";
import { EditGroup } from "./EditGroup";

export interface IConfigurationProps {
    id: Panels;
    go: (to: Panels) => void;
    children: any;
    launchInfo: ILaunchParams;
    notify: (message: string, isError: boolean) => void;
}

export const Configuration = ({ id, go, children, launchInfo, notify }: IConfigurationProps) => {
    const [groupConfig, setGroupConfig] = useState<IAdminGroupConfig>(undefined);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const fetchConfigStatus = async () => {
        try {
            const isGroupConfigured: boolean = await api.isGroupConfigured();

            if (isGroupConfigured) {
                const cfg: IAdminGroupConfig = await api.getGroupConfig();
                setGroupConfig(cfg);
            } else {
                notify(`Промокод в этой группе еще не настроен`, true);
                setGroupConfig({
                    hoursToGet: 0,
                    postId: 0,
                    promocode: "Введите промокод",
                });
            }
        } catch (error) {
            notify(toMsg(error), true);
        }
    };

    const saveGroupParams = async (cfg: IAdminGroupConfig) => {
        try {
            setIsSaving(true);
            const postExists = await api.checkWallPost(launchInfo.groupId, cfg.postId);
            if (!postExists) {
                notify(`Указанный пост не найден на стене сообщества`, true);
                return;
            }

            await api.saveGroupConfig(cfg);
            notify("Сохранено", false);
        } catch (err) {
            notify(`Не удалось сохранить: ${toMsg(err)}`, true);
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchConfigStatus();
    }, []);

    const goHome = () => go(Panels.Home);
    const resetGroup = () =>
        fetchConfigStatus().catch(err => notify(`Не удалось сбросить статус: ${toMsg(err)}`, true));

    return (
        <Panel id={id}>
            <PanelHeader left={<HeaderButton onClick={goHome}>{<CrossPlatformBack />}</HeaderButton>}>
                Настройка
            </PanelHeader>
            <Group>
                <EditGroup
                    config={groupConfig}
                    saveGroupParams={saveGroupParams}
                    reset={resetGroup}
                    groupId={launchInfo.groupId}
                    saving={isSaving}
                />
            </Group>
            {children}
        </Panel>
    );
};
