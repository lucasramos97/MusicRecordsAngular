export class Music {
    id: number;
    title: string;
    artist: string;
    launchDate: string;
    duration: string;
    viewsNumber: number;
    feat: boolean;

    constructor() {
        this.title = null;
        this.artist = null;
        this.launchDate = null;
        this.duration = null;
        this.viewsNumber = null;
        this.feat = false;
    }
}