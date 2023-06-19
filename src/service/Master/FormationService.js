import { HttpGet } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(keyword) {
    return await HttpGet(UrlService.FormationUrl(), { params: { keyword: keyword } });
}

export async function GetList(id, keyword) {
    return await HttpGet(UrlService.FormationUrl() + "/list/" + id, { params: { keyword: keyword } });
}
