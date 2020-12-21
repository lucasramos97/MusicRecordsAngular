
export class ValidatorUtils {

    private emailRegex: RegExp;

    constructor() {
        this.emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
    }

    isNotEmail(email: string): boolean {
        return !this.emailRegex.test(email);
    }

    isNotLaunchDateValid(launchDate: string): boolean {
        let launchDateSplit = launchDate.split('/');
        let day = Number.parseInt(launchDateSplit[0]);
        let month = Number.parseInt(launchDateSplit[1]) - 1;
        let year = Number.parseInt(launchDateSplit[2]);
        let date = new Date();
        date.setDate(day);
        date.setMonth(month);
        date.setFullYear(year);
        return day !== date.getDate() || month !== date.getMonth() || year !== date.getFullYear();
    }

}