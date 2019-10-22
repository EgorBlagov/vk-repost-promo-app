import * as React from 'react';
import { HeaderButton } from '@vkontakte/vkui';
import { Icon28Settings } from '../../external';

import { Panels } from '../../logic/navigation';

export interface AdminSettingsButtonProps {
    isAdmin: boolean;
    go: (to:Panels) => void;
}

export const AdminSettingsButton = ({isAdmin, go}: AdminSettingsButtonProps) => {
    return isAdmin
    ? <HeaderButton onClick={() => go(Panels.Configure)} style={{marginLeft: '6px'}}>
        <Icon28Settings/>
    </HeaderButton>
    : null;
}
