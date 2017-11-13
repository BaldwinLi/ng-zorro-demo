import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
    `,
    styleUrls: ['../assets/css/custom.css'],
})
export class AppComponent implements OnInit {
    constructor(private router: Router) {

    }
    ngOnInit() {
        if (!sessionStorage.getItem('token')) {
            this.router.navigate(['login']);
        }
    }
}
