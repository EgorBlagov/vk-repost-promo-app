
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

    }

    export default class PanelHeader extends React.Component<PanelHeaderProps, any>{}
}

declare module '@vkontakte/vkui/dist/components/Group/Group' {
    import * as React from 'react';
    export interface GroupProps {
        title: string;
        description?: string;
    }
    export default class Group extends React.Component<GroupProps, any>{}
}

declare module '@vkontakte/icons/dist/16/clear' {
    import * as React from 'react';
    export interface Icon16ClearProps {
        className: string;
    }
    export default class Icon16Clear extends React.Component<Icon16ClearProps, any>{}
}

declare module '@vkontakte/icons/dist/16/check_circle' {
    import * as React from 'react';
    export interface Icon16CheckCircleProps {
        className: string;
    }
    export default class Icon16CheckCircle extends React.Component<Icon16CheckCircleProps, any>{}
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
