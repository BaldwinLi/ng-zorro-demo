/**
 * http请求底层类，封装了所有http请求方法，统一定义了请求方法getRequestObservable
 * 统一定义了成功回调处理函数extractData
 * 统一定义了Response失败回调函数handleError
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import {
// trim,
// isObject,
// endsWith,
// assign } from 'lodash';
// import {
//   Http,
//   Headers,
//   RequestOptions
// } from '@angular/http';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UtilService } from './util.service';

@Injectable()
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    // private http: Http,
    private util: UtilService,
    private router: Router
  ) { }

  getRequestObservable(
    url: string,
    method: string,
    body?: any,
    headers?: Object,
    urlParams?: Object,
    // options?: RequestOptions,
    retry?: number): Observable<any> {
    if (!this.isClient(url) && !sessionStorage.getItem('token')) {
      this.router.navigate(['login']);
    }
    const hasBody = ['post', 'put', 'patch'].includes(method);
    let request;
    if (!!this.httpClient[method]) {
      request = hasBody ? this.httpClient[method](url, body || {}, {
        params: this.getUrlParams(urlParams),
        headers: this.getHeaders(headers)
      }) : this.httpClient[method](url, {
        params: this.getUrlParams(urlParams),
        headers: this.getHeaders(headers)
      });
      if (!!retry) {
        request = request.retry(retry);
      }
    } else {
      console.error('Except Get/Post/put/delete/patch/head/options request, other requests doesn\'t support momentarily.');
    }
    return request.map(this.extractData.bind(this)).catch(this.handleError);
  }

  private extractData(res: HttpResponse<any> | any) {
    return res || {};
  }

  private handleError(error: HttpResponse<any> | any) {
    if (error.status === 0) {
      window.location.reload();
      return Observable.create((obsr) => {
        obsr.next();
      });
    }
    return Observable.create((obsr) => {
      obsr.error(error);
    });
  }

  // private getOptions(headers?: any, options?: any): RequestOptions {
  //   let _options: RequestOptions;
  //   if (options) {
  //     _options = new RequestOptions(options);
  //   } else {
  //     _options = new RequestOptions({ headers: new Headers(assign({ 'Content-Type': 'application/json;charset=UTF-8' }, headers)) });
  //   }
  //   return _options;
  // }

  private getHeaders(headers: any): HttpHeaders {
    let _headers = new HttpHeaders();
    if (!headers || typeof headers['Content-Type'] === 'undefined') {
      _headers = _headers.set('Content-Type', 'application/json;charset=UTF-8');
    }
    if (!headers || typeof headers['Authorization'] === 'undefined') {
      _headers = _headers.set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
    }

    for (const e in headers) {
      if (e && headers[e]) {
        _headers = _headers.set(e, headers[e]);
      }
    }
    return _headers;
  }

  private getUrlParams(params: any): HttpParams {
    const urlParams = new HttpParams();
    for (const e in params) {
      if (e) {
        urlParams.set(e, params[e]);
      }
    }
    return urlParams;
  }

  // private buildUrlParams(params: any) {
  //   let paramStr = '';
  //   if (params) {
  //     paramStr += '?';
  //     for (const e in params) {
  //       if (!!params[e] || params[e] === 0) {
  //         paramStr += (e + '=' + params[e] + '&');
  //       }
  //     }
  //     paramStr = paramStr !== '?' ? trim(paramStr, '&') : '';
  //   }

  //   return paramStr;
  // }

  private isClient(url: string) {
    return ['/oauth/token', '/common-api/sys-user/chgpassword'].every(e => {
      return url.indexOf(e) === -1;
    });
  }
}

