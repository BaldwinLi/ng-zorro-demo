import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
    selector: 'app-upload-file',
    templateUrl: './uploadFileTemplate.html'
})
export class SimpleDemoComponent {
    public uploader: FileUploader = new FileUploader({ url: URL });
    public hasBaseDropZoneOver: Boolean = false;
    public hasAnotherDropZoneOver: Boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }
}
