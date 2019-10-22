import * as React from 'react';
import { Spinner, Input } from '@vkontakte/vkui';

// augmentation

declare module '@vkontakte/vkui/dist/components/Spinner/Spinner' {
    interface SpinnerProps {
        className?: string;
        style?: React.CSSProperties;
    }
}

declare module '@vkontakte/vkui/dist/components/Input/Input' {
    interface InputProps {
        top?: React.ReactNode;
        name?: string;
        value?: string;
    }
}

// declaration of untyped
declare module '@vkontakte/vkui' {
    export interface SliderProps {
        top?: string;
        step?: number;
        min?: number;
        max?: number;
        value?: number;
        onChange?: (newValue: number) => void;
        bottom?: string;
    }
    export class Slider extends React.Component<SliderProps, any>{}

    export interface PanelProps {
        id: string;
    }
    export class Panel extends React.Component<PanelProps, any> {}

    export interface HeaderContextProps {
        opened: boolean;
        onClosed: () => void;
    }
    export class HeaderContext extends React.Component<HeaderContextProps, any>{}

    export interface PanelHeaderProps {
        right?: React.ReactNode;
        left?: React.ReactNode;
    }
    export class PanelHeader extends React.Component<PanelHeaderProps, any>{}

    export interface GroupProps {
        title?: string;
        description?: string;
        before?: React.ReactNode;
        size?: string;
    }
    export class Group extends React.Component<GroupProps, any>{}

        
    export interface ListProps {}
    export class List extends React.Component<ListProps, any>{}

    export interface LinkProps {
        href: string;
        target: string;
    }
    export class Link extends React.Component<LinkProps, any>{}

    export interface PullToRefreshProps {
        onRefresh: () => void;
        isFetching: boolean;
    }
    export class PullToRefresh extends React.Component<PullToRefreshProps, any>{}

    export interface PanelHeaderContentProps {
        status?: string;
        aside?: any;
        before?: any;
        onClick: () => void;
    }
    export class PanelHeaderContent extends React.Component<PanelHeaderContentProps, any>{}
}
