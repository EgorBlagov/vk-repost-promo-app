export namespace TimeProcessor {
    export function formatTime(sec: number): string {
        const hours: number = Math.floor(sec / 3600);
        const minutes: number = Math.floor((sec - (hours * 3600)) / 60);
        const seconds: number = sec - (hours * 3600) - (minutes * 60);

        let hoursS: string = hours.toString();
        let minutesS: string = minutes.toString();
        let secondsS: string = seconds.toString();

        if (hours < 10) {
            hoursS = `0${hours}`;
        }
        if (minutes < 10) {
            minutesS = `0${minutes}`;
        }
        if (seconds < 10) {
            secondsS = `0${seconds}`;
        }
        return `${hoursS}:${minutesS}:${secondsS}`;
    }

    export function getTimeLeft(postDate: number, hoursToGet: number): string {
        return formatTime(getSecondsLeft(postDate, hoursToGet));
    }

    function currentSeconds(): number { 
        return Math.floor(Date.now() / 1000);
    }
    
    function getSecondsLeft(postDate: number, hoursToGet: number): number {
        return (postDate + hoursToGet * 60 * 60 - currentSeconds());
    }
    
    export function isTimePassed(postDate: number, hoursToGet: number): boolean {
        return getSecondsLeft(postDate, hoursToGet) <= 0;
    }
}
