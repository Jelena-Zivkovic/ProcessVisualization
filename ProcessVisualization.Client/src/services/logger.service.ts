import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
    error(err: string, origin:  string | null = null) {
        console.log("======================Error======================\n" + "Origin: " + origin + "\n" + this.dateAndTime() + "\nMessage: " + err);
    }

    warning(wrn: string, origin:  string | null = null) {
        console.log("======================Warning======================\n" + "Origin: " + origin + "\n" + this.dateAndTime() + "\nMessage: " + wrn);
    }

    info(inf: string, origin:  string | null = null) {
        console.log("======================Info======================\n" + "Origin: " + origin + "\n" + this.dateAndTime() + "\nMessage: " + inf);
    }

    errorObject(err: any, origin:  string | null = null) {
        console.log("======================Error======================\n" + "Origin: " + origin + "\n" + this.dateAndTime() + "\nObject: " + JSON.stringify(err, null, 2));
    }

    warningObject(wrn: any, origin:  string | null = null) {
        console.log("======================Error======================\n" + "Origin: " + origin + "\n" + this.dateAndTime() + "\nObject: " + JSON.stringify(wrn, null, 2));
    }

    infoObject(inf: any, origin:  string | null = null) {
        console.log("======================Error======================\n" + "Origin: " + origin + "\n" + this.dateAndTime() + "\nObject: " + JSON.stringify(inf, null, 2));
    }

    private dateAndTime():  string | null {
        let today = new Date();
        let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return "Date&Time: " + date + " " + time;
    }
}
