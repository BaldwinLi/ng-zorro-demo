import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-credential-dialog',
    template: `
        <img [src]="imageUrl">
    `
})
export class CredentialDialogComponent {
    imageUrl: String;
}
