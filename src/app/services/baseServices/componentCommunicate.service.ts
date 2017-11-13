import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ComponentCommunicateService {

    // Observable string sources
    private emitSource = new Subject<any>();
    private boardcastSource = new Subject<any>();

    // Observable string streams
    emitObsr = this.emitSource.asObservable();
    boardObsr = this.boardcastSource.asObservable();

    // Service message commands
    $emit(event: any): void {
        this.emitSource.next(event);
    }

    $boardcast(event: any): void {
        this.boardcastSource.next(event);
    }
}
