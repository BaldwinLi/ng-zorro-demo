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
import { trim, isObject, endsWith, assign } from 'lodash';
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
  constructor(private http: HttpClient, private util: UtilService) { }

  getRequestObservable(
    url: string,
    method: string,
    body?: any,
    headers?: Object,
    urlParams?: Object,
    retry?: number): Observable<any> {
    if (!!this.http[method]) {
      const hasBody = ['post', 'put', 'patch'].includes(method);
      let request = hasBody ? this.http[method](url, body || {}, {
        params: this.getUrlParams(urlParams),
        headers: this.getHeaders(headers)
      }) : this.http[method](url, {
        params: this.getUrlParams(urlParams),
        headers: this.getHeaders(headers)
      });
      if (!!retry) {
        request = request.retry(retry);
      }
      return request.map(this.extractData.bind(this)).catch(this.handleError);
    } else {
      console.error('Except Get/Post/put/delete/patch/head/options request, other requests doesn\'t support momentarily.');
    }
  }

  private extractData(res: HttpResponse<any> | any) {
    const body = this.util.formatUnavailableValueToString(res.data);
    return body || {};
  }

  private handleError(error: HttpResponse<any> | any) {
    if (error.status === 0) {
      window.location.reload();
      return Observable.create((obsr) => {
        obsr.next();
      });
    }
    let body = '';
    try {
      const arr = JSON.parse(error.data);
      for (const e in arr) {
        if (e) {
          body += (arr[e] + '-');
        }
      }
    } catch (e) {
      body = error.data;
    }
    return Observable.create((obsr) => {
      obsr.error(body);
    });
  }

  private getHeaders(headers: any): HttpHeaders {
    const _headers = new HttpHeaders();
    _headers.set('Content-Type', 'application/json;charset=UTF-8');
    for (const e in headers) {
      if (e) {
        _headers.set(e, headers[e]);
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
}

