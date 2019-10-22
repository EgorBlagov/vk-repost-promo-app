class WallProcessor {
    public getExamplePostUrls(groupId: number): string[] {
        return [
            `https://vk.com/wall-${groupId}_1234`,
            `wall-${groupId}_1234`,
            `https://vk.com/wall-${groupId}?w=wall-${groupId}_1233`
        ];
    }

    public generatePostUrl(groupId: number, postId: number): string {
        return `https://vk.com/wall-${groupId}_${postId}`;
    }

    public normalizePostUrl(groupId: number, url: string): string {
        if (this.isPostUrlValid(groupId, url)) {
            return this.generatePostUrl(groupId, this.extractPostId(url));
        } else {
            return url;
        }
    }

    public extractPostId(url: string): number {
        return parseInt(url.match(/wall-\d+_(\d+)$/)[1])
    }

    public isPostUrlValid(groupId: number, url: string): boolean {
        if (url === undefined) {
            return false;
        }

        const match = url.match(new RegExp(`wall-${groupId}_(\\d+)$`));
        if (match === null) {
            return false;
        }

        return true;
    }

    public getGroupUrl(groupId: number): string {
        return `https://vk.com/public${groupId}`;
    }

    public getWallUrl(groupId: number): string {
        return `https://vk.com/wall-${groupId}`;
    }
}

export const wallProcessor: WallProcessor = new WallProcessor();
