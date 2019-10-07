import * as React from 'react';

export interface HelloProps {
    compiler: string;
}

export const Hello = (props: HelloProps) => (
    <h1>Hello BRO!: {props.compiler} should be reloaded by webpack</h1>
);