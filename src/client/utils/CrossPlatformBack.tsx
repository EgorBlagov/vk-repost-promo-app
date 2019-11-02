import * as React from "react";

import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import { IOS, platform } from "@vkontakte/vkui";

export const CrossPlatformBack = () => (platform() === IOS ? <Icon28ChevronBack /> : <Icon24Back />);
