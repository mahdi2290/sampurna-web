import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.FormationUrl(), { params: params });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.FormationUrl() + "/" + id);
}

export async function GetList(id, keyword) {
    return await HttpGet(UrlService.FormationUrl() + "/list/" + id, { params: { keyword: keyword } });
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.FormationUrl(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.FormationUrl() + "/" + id, _model);
}
