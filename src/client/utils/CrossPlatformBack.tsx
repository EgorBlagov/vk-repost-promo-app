import * as React from 'react';

import { platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

export const CrossPlatformBack = () => platform() === IOS? <Icon28ChevronBack/> : <Icon24Back />;
