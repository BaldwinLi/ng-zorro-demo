
/**
 * @author Baldwin Li
 * internationalize initiative
 */
import EN_US from './en_us';
import ZH_CN from './zh_cn';
import { zhCN, enUS } from 'ng-zorro-antd';

const lang = sessionStorage.getItem('locale') || 'ZH_CN';
/**
 * export ng_zorro locale
 */
export const NZ_LOCALE_VALUE = {
    ZH_CN: zhCN,
    EN_US: enUS
}[lang];
/**
 * export custom locale
 */
export const Lang = {
    ZH_CN,
    EN_US
}[lang];
