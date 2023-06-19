import { HttpGet } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(keyword) {
    return await HttpGet(UrlService.InternalUrl(), { params: { keyword: keyword } });
}
