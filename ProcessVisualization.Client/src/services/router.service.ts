import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class RouterService {

    constructor(private router: Router, private location: Location) {}

    navigate(page: string, param: any = null) {
      this.router.navigate(["/" + page]);
    }

    back() {
        this.location.path();
        this.location.back();
    }
}
