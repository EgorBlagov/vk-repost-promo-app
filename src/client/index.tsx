import * as React from 'react';
import * as ReactDOM from 'react-dom';
import connect from '@vkontakte/vk-connect';

import { App } from './App';

connect.send('VKWebAppInit');

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);
