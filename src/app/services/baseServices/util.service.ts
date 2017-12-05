import { Injectable } from '@angular/core';
import { padStart, isObject, isArray, uniqueId } from 'lodash';
import { saveAs } from 'file-saver';
import { FormGroup } from '@angular/forms';

type AOA = Array<Array<any>>;

function s2ab(s: string): ArrayBuffer {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

@Injectable()
export class UtilService {

  constructor() { }

  private data: AOA = [[], []];
  private wopts: any = { bookType: 'xlsx', type: 'binary' };
  private fileName: String = 'SheetJS.xlsx';

  getPageData(data: Array<any>, page: number, pageSize: number): any {
    const rowsCount = data.length;
    const currentPageRows = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {
      rowsCount,
      currentPageRows
    };
  }

  formatISOToStr(str: string): string {
    const arr = str.split('T');
    if (arr.length < 2) {
      console.error('formatISOToStr\'s params must be ISO format.');
      return;
    }
    const time_arr = arr[1].split('.');
    const arr_date = arr[0].split('-');
    const arr_time = time_arr[0].split(':');
    return arr_date[0] + arr_date[1] + arr_date[2] + arr_time[0] + arr_time[1] + arr_time[2];
  }
  getDateFormate(date: Date): string {
    const year = date.getFullYear().toString();
    const month_cache = date.getMonth() + 1;
    const month = month_cache < 10 ? padStart(month_cache.toString(), 2, '0') : month_cache.toString();
    const day_cache = date.getDate();
    const day = day_cache < 10 ? padStart(day_cache.toString(), 2, '0') : day_cache.toString();
    const hour_cache = date.getHours();
    const hour = hour_cache < 10 ? padStart(hour_cache.toString(), 2, '0') : hour_cache.toString();
    const minute_cache = date.getMinutes();
    const minute = minute_cache < 10 ? padStart(minute_cache.toString(), 2, '0') : minute_cache.toString();
    const second_cache = date.getSeconds();
    const second = second_cache < 10 ? padStart(second_cache.toString(), 2, '0') : second_cache.toString();
    return year + month + day + hour + minute + second;
  }

  formatTimestamp(timestamp: number, format): string {
    const date = new Date(timestamp);
    let o = { 
      "M+" : date.getMonth()+1, //month 
      "d+" : date.getDate(), //day 
      "h+" : date.getHours(), //hour 
      "m+" : date.getMinutes(), //minute 
      "s+" : date.getSeconds(), //second 
      "q+" : Math.floor((date.getMonth()+3)/3), //quarter 
      "S" : date.getMilliseconds() //millisecond 
      }
      if(/(y+)/i.test(format)) { 
      format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      }
      for(var k in o) { 
      if(new RegExp("("+ k +")").test(format)) { 
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
      } 
      } 
      return format; 
  }

  formatUnavailableValueToString(object: any): any {
    if (isArray(object)) {
      object = object.map(v => {
        return this.formatUnavailableValueToString(v);
      });
    } else if (isObject(object)) {
      for (const e in object) {
        if (object[e] !== 0) {
          object[e] = this.formatUnavailableValueToString(object[e]);
        }
      }
    }
    return object === 0 ? object : (object || '');
  }

  get uuid() {
    return Date.now() + uniqueId();
  }

  get getCurrentLocalDate() {
    const date = new Date();
    date.setHours(date.getHours() + 8);
    return date;
  }

  onFileChange(evt: any, callback: Function) {
    /* wire up file reader */
    const target: DataTransfer = (<DataTransfer>(evt.target));
    if (target.files.length !== 1) {
      throw new Error('Cannot upload multiple files on the entry');
    }
    const reader = new FileReader();
    window['loading'].startLoading();
    reader.onload = function (e: any) {
      window['loading'].finishLoading();
      /* read workbook */
      const bstr = e.target.result;
      const wb = window['XLSX'].read(bstr, { type: 'binary' });
      // const wb = window['XLSX'].read(bstr, { type: 'buffer' });


      /* grab first sheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* save data to scope */
      callback(<AOA>(window['XLSX'].utils.sheet_to_json(ws, { header: 1 })));
    };
    reader.readAsBinaryString(target.files[0]);
    // reader.readAsText(target.files[0]);
  }

  export(): void {
    /* generate worksheet */
    const ws = window['XLSX'].utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb = window['XLSX'].utils.book_new();
    window['XLSX'].utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    const wbout = window['XLSX'].write(wb, this.wopts);
    console.log(this.fileName);
    saveAs(new Blob([s2ab(wbout)]), this.fileName);
  }

  isValid(form: FormGroup, name: string, validator: string): Boolean {
    return form.controls[name].dirty && form.controls[name].hasError(validator);
  }

  isInvalidForm(form: FormGroup): Boolean {
    for (const i in form.controls) {
      if (form.controls[i].invalid) {
        form.controls[i].markAsDirty();
      }
    }
    return form.invalid;
  }

  setCookie(name, value, hours, path): void {
    const _name = window['escape'](name);
    const _value = window['escape'](value);
    const expires = new Date();
    expires.setTime(expires.getTime() + hours * 3600000);
    path = path === '' ? '' : ';path=' + path;
    const _expires = typeof hours === 'string' ? '' : ';expires=' + expires.toUTCString();
    document.cookie = _name + '=' + _value + _expires + path;
  }

  getCookieValue(name): string {
    let _name = window['escape'](name);
    const allcookies = document.cookie;
    _name += '=';
    const pos = allcookies.indexOf(_name);
    if (pos !== -1) {
      const start = pos + _name.length;
      let end = allcookies.indexOf(';', start);
      if (end === -1) {
        end = allcookies.length;
      }
      const value = allcookies.substring(start, end);
      return value;
    } else {
      return '';
    }
  }

  deleteCookie(name, path) {
    const _name = window['escape'](name);
    const expires = new Date(0);
    path = path === '' ? '' : ';path=' + path;
    document.cookie = _name + '=' + ';expires=' + expires.toUTCString() + path;
  }
}
