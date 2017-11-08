import { Component, Input, Output, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Lang } from '../../../assets/i18n/i18n';

export class FileHolder {
    public pending: Boolean = false;
    public serverResponse: { status: number, response: any };

    constructor(public src: string, public file: File) {
    }
}
@Component({
    selector: 'app-upload-image',
    templateUrl: './uploadImageTemplate.html',
    styleUrls: ['./uploadImage.css']
})
export class UploadImageComponent implements OnInit {
    private files: FileHolder[] = [];
    private previewTitle: String = Lang['preview_image_title'];
    private previewUrl: String = '';
    @Input() private url: String = '';
    @Input() private headers: Array<Object>;
    @Input() private maxFileCount: Number = 10;
    @Input() private extensions: Array<String>;
    @Input() private buttonCaption: String = Lang['upload_image'];
    @Input() private dropBoxMessage: String = Lang['drop_image_here'];
    @Input() private clearButtonCaption: String = Lang['form_empty'];
    @Input() private customClass: String = '';
    @Input() private customStyle: Object;
    @Input() private preview: Boolean = false;
    @Input() private maxFileSize: Number;
    @Input() private uploadedFiles: Array<Object> = [];
    @Input() private fileTooLargeMessage: String = Lang['file_too_large'];
    @Input() private readonly: Boolean = false;
    @Input() private disabledPreview: Boolean = false;

    private fileCounter: number;

    private startLoading: Boolean = false;

    constructor(private modalService: NzModalService) {
        this.fileCounter = 0;
    }

    @Input() private onBeforeUpload(metadata: any) {
        // metadata.abort = true
        // metadata.url = 'http://somewhereelse.com'
        this.fileCounter = this.fileCounter + 1;
        return metadata;
    }

    @Input() private onUploadFinished(event: any): void {
        this.uploadedFiles.push({ src: event.file });
    }

    @Input() private onRemoved(event: any): void {
        const index = this.uploadedFiles.indexOf(event.file);
        if (index > -1) {
            this.uploadedFiles.splice(index, 1);
        }
    }

    @Input() onUploadStateChanged(state: boolean): void { }

    private processUploadedFiles() {
        for (let i = 0; i < this.uploadedFiles.length; i++) {
            const data: any = this.uploadedFiles[i];

            let fileBlob: Blob,
                file: File,
                fileUrl: string;

            if (data instanceof Object) {
                fileUrl = data.url || './assets/image/default.png';
                fileBlob = (data.blob) ? data.blob : new Blob([data]);
                file = new File([fileBlob], data.fileName);
            } else {
                fileUrl = data;
                fileBlob = new Blob([fileUrl]);
                file = new File([fileBlob], fileUrl);
            }

            this.files.push(new FileHolder(fileUrl, file));
        }
    }

    private showPreviewModel(titleTpl, contentTpl, url: String = './assets/image/default.png'): void {
        if (this.disabledPreview) {
            return;
        }
        this.previewUrl = url;
        this.modalService.open({
            title: titleTpl,
            content: contentTpl,
            maskClosable: false,
            footer: false,
            style: {
                width: 'max-content',
                height: 'max-content'
            }
        });
    }

    ngOnInit() {
        if (this.uploadedFiles.length > 0) {
            this.processUploadedFiles();
        }
    }
}
