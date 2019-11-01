import { HeaderButton } from "@vkontakte/vkui";
import * as React from "react";
import { Icon28Settings } from "../../external";

import { Panels } from "../../logic/navigation";

export interface IAdminSettingsButtonProps {
    isAdmin: boolean;
    go: (to: Panels) => void;
}

export const AdminSettingsButton = ({ isAdmin, go }: IAdminSettingsButtonProps) => {
    const onClickBack = () => go(Panels.Configure);

    return isAdmin ? (
        <HeaderButton onClick={onClickBack} style={{ marginLeft: "6px" }}>
            <Icon28Settings />
        </HeaderButton>
    ) : null;
};
