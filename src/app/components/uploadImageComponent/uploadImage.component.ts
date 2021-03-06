import { Component, Input, Output, OnInit, OnChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Lang } from '../../../assets/i18n/i18n';
import { AppRequestService } from '../../services/baseServices/appRequest.service';
import { NzMessageService } from 'ng-zorro-antd';

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
export class UploadImageComponent implements OnInit, OnChanges {
    files: FileHolder[] = [];
    previewTitle: String = Lang['preview_image_title'];
    previewUrl: String = '';
    loading: Boolean = false;
    @Input() url: String = '';
    @Input() headers: Array<Object>;
    @Input() style: any;
    @Input() maxFileCount: Number = 10;
    @Input() extensions: Array<String>;
    @Input() buttonCaption: String = Lang['upload_image'];
    @Input() dropBoxMessage: String = Lang['drop_image_here'];
    @Input() clearButtonCaption: String = Lang['form_empty'];
    @Input() customClass: String = '';
    @Input() customStyle: Object;
    @Input() preview: Boolean = false;
    @Input() maxFileSize: Number;
    @Input() uploadedFiles: Array<Object> = [];
    @Input() fileTooLargeMessage: String = Lang['file_too_large'];
    @Input() readonly: Boolean = false;
    @Input() disabledPreview: Boolean = false;

    fileCounter: number;

    startLoading: Boolean = false;

    constructor(
        private modalService: NzModalService,
        private appReq: AppRequestService,
        private nms: NzMessageService
    ) {
        this.fileCounter = 0;
    }

    @Input() onBeforeUpload(metadata: any) {
        // metadata.abort = true
        // metadata.url = 'http://somewhereelse.com'
        this.fileCounter = this.fileCounter + 1;
        return metadata;
    }

    @Input() onUploadFinished(event: any): void {
        this.uploadedFiles.push({ src: event.file });
    }

    @Input() onRemoved(event: any): void {
        const index = this.uploadedFiles.indexOf(event.file);
        if (index > -1) {
            this.uploadedFiles.splice(index, 1);
        }
    }

    @Input() onUploadStateChanged(state: boolean): void { }

    processUploadedFiles() {
        const scope = this;
        scope.uploadedFiles.forEach(e => {
            const data: any = e;

            let fileBlob: Blob,
                file: File,
                fileUrl: string;

            if (data instanceof Object) {
                if (typeof data.ossKey !== 'undefined') {
                    scope.loading = true;
                    scope.appReq.getOssKey(data.ossKey).subscribe(
                        success => {
                            scope.loading = false;
                            fileUrl = (success.ossKey && success.url) || './assets/image/default.png';
                            fileBlob = (success.blob) ? success.blob : new Blob([success]);
                            file = new File([fileBlob], data.fileName);
                            scope.files.push(new FileHolder(fileUrl, file));
                        },
                        error => {
                            scope.loading = false;
                            fileUrl = './assets/image/default.png';
                            fileBlob = (data.blob) ? data.blob : new Blob([data]);
                            file = new File([fileBlob], data.fileName);
                            scope.files.push(new FileHolder(fileUrl, file));
                            scope.nms.error('ossKey查询失败');
                        }
                    );
                } else {
                    fileUrl = data.url || './assets/image/default.png';
                    fileBlob = (data.blob) ? data.blob : new Blob([data]);
                    file = new File([fileBlob], data.fileName);
                    scope.files.push(new FileHolder(fileUrl, file));
                }
            } else {
                fileUrl = data;
                fileBlob = new Blob([fileUrl]);
                file = new File([fileBlob], fileUrl);
                scope.files.push(new FileHolder(fileUrl, file));
            }
        });
    }

    showPreviewModel(titleTpl, contentTpl, url: String = './assets/image/default.png'): void {
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

    ngOnChanges(changes: any) {
        this.files = [];
        if (this.uploadedFiles && this.uploadedFiles.length > 0) {
            this.processUploadedFiles();
        } else {
            this.files.push(new FileHolder('./assets/image/default.png', new File([new Blob([null])], 'default.png')));
        }
    }

    ngOnInit() {
    }
}
