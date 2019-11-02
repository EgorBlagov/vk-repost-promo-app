import { TimeProcessor } from "../common/time-processor";
import { TRepostInfo } from "../common/types";

export namespace PromocodeProcessor {
    export function canObtainPromocode(isMember: boolean, repostInfo: TRepostInfo, hoursToGet: number) {
        return isMember && repostInfo.reposted && TimeProcessor.isTimePassed(repostInfo.postDate, hoursToGet);
    }
}
