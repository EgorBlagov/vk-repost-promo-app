export namespace WallProcessor {
    export function getExamplePostUrls(groupId: number): string[] {
        return [
            `https://vk.com/wall-${groupId}_1234`,
            `wall-${groupId}_1234`,
            `https://vk.com/wall-${groupId}?w=wall-${groupId}_1233`
        ];
    }

    export function generatePostUrl(groupId: number, postId: number): string {
        return `https://vk.com/wall-${groupId}_${postId}`;
    }

    export function normalizePostUrl(groupId: number, url: string): string {
        if (isPostUrlValid(groupId, url)) {
            return generatePostUrl(groupId, extractPostId(url));
        } else {
            return url;
        }
    }

    export function extractPostId(url: string): number {
        return parseInt(url.match(/wall-\d+_(\d+)$/)[1])
    }

    export function isPostUrlValid(groupId: number, url: string): boolean {
        if (url === undefined) {
            return false;
        }

        const match = url.match(new RegExp(`wall-${groupId}_(\\d+)$`));
        if (match === null) {
            return false;
        }

        return true;
    }
}
