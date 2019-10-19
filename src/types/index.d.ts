declare module '@vkontakte/vkui/dist/components/Panel/Panel' {
    import * as React from 'react';

    export interface PanelProps {
        id: string;
    }

    export default class Panel extends React.Component<PanelProps, any> {}
}

declare module '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader' {
    import * as React from 'react';
    export interface PanelHeaderProps {
        right?: React.ReactNode;
        left?: React.ReactNode;
    }

    export default class PanelHeader extends React.Component<PanelHeaderProps, any>{}
}
declare module '@vkontakte/vkui/dist/components/HeaderContext/HeaderContext' {
    import * as React from 'react';
    export interface HeaderContextProps {
        opened: boolean;
        onClosed: ()=>void;
    }

    export default class HeaderContext extends React.Component<HeaderContextProps, any>{}
}

declare module '@vkontakte/vkui/dist/components/Group/Group' {
    import * as React from 'react';
    export interface GroupProps {
        title?: string;
        description?: string;
        before?: React.ReactNode;
        size?: string;
    }
    export default class Group extends React.Component<GroupProps, any>{}
}

declare module '@vkontakte/vkui/dist/components/Slider/Slider' {
    import * as React from 'react';
    export interface SliderProps {
        top?: string;
        step?: number;
        min?: number;
        max?: number;
        value?: number;
        onChange?: (newValue: number)=>void;
        bottom?: string;
    }

    export default class Slider extends React.Component<SliderProps, any>{}
}

declare module '@vkontakte/icons/dist/16/clear' {
    import * as React from 'react';
    export interface Icon16ClearProps {
        className?: string;
    }
    export default class Icon16Clear extends React.Component<Icon16ClearProps, any>{}
}

declare module '@vkontakte/icons/dist/16/check_circle' {
    import * as React from 'react';
    export interface Icon16CheckCircleProps {
        className?: string;
    }
    export default class Icon16CheckCircle extends React.Component<Icon16CheckCircleProps, any>{}
}

declare module '@vkontakte/icons/dist/28/chevron_back' {
    import * as React from 'react';

    export interface Icon28ChervonBackProps {
        className?: string;
    }
    export default class Icon28ChervonBack extends React.Component<Icon28ChervonBackProps, any>{}
}

declare module '@vkontakte/icons/dist/28/settings' {
    import * as React from 'react';
    export interface Icon28SettingsProps {
        className?: string;
    }
    export default class Icon28Settings extends React.Component<Icon28SettingsProps, any>{}
}

declare module '@vkontakte/icons/dist/24/back' {
    import * as React from 'react';

    export interface Icon24BackProps {
        className?: string;
    }
    export default class Icon24Back extends React.Component<Icon24BackProps, any>{}
}

declare module '@vkontakte/vkui/dist/components/List/List' {
    import * as React from 'react';
    export interface ListProps {

    }
    export default class List extends React.Component<ListProps, any>{}
}

declare module '@vkontakte/vkui/dist/components/Link/Link' {
    import * as React from 'react';
    export interface LinkProps {
        href: string;
        target: string;
    }
    export default class Link extends React.Component<LinkProps, any>{}
}

declare module '@vkontakte/vkui/dist/components/PullToRefresh/PullToRefresh' {
    import * as React from 'react';
    export interface PullToRefreshProps {
        onRefresh: ()=>void;
        isFetching: boolean;
    }
    export default class PullToRefresh extends React.Component<PullToRefreshProps, any>{}
}

declare module '@vkontakte/vkui/dist/components/PanelHeaderContent/PanelHeaderContent' {
    import * as React from 'react';
    export interface PanelHeaderContentProps {
        status?: string;
        aside?: any;
        before?: any;
        onClick: ()=>void;
    }
    export default class PanelHeaderContent extends React.Component<PanelHeaderContentProps, any>{}
}
