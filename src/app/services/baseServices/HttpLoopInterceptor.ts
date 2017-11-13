import { Injectable } from '@angular/core';
import {
    HttpHeaders,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpCache } from './httpCache';

@Injectable()
export class HttpLoopInterceptor implements HttpInterceptor {
    private cacheOpened: Boolean = false;
    constructor(private cache: HttpCache) { }
    set setOpenCache(val: Boolean) {
        this.cacheOpened = val;
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const started = Date.now();
        /**
         *set header
         */
        // const authReq = req.clone({headers: req.headers.set('field', 'value')});

        /**
         *set request cache
         */
        if (this.cacheOpened && req.method === 'GET') {
            const cachedResponse = this.cache.get(req);
            if (cachedResponse) {
                // A cached response exists. Serve it instead of forwarding
                // the request to the next handler.
                return Observable.of(cachedResponse);
            }
        }
        // req.headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

        return next.handle(req).do(event => {
            if (event instanceof HttpResponse) {
                // const elapsed = Date.now() - started;
                // console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
                if (event instanceof HttpResponse) {
                    // Update the cache.
                    this.cache.put(req, event);
                }
            }
        });
    }
}
