import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpCache {
    private cacheRequestMap: Object;
    /**
     * Returns a cached response, if any, or null if not present.
     */
    get(req: HttpRequest<any>): HttpResponse<any> | null {
        return this.cacheRequestMap[req.url] || null;
    }

    /**
     * Adds or updates the response in the cache.
     */
    put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
        this[req.url] = resp;
    }
}
