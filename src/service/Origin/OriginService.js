import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.OriginUrl(), { params: params });
}

export async function GetChildList(keyword) {
    return await HttpGet(UrlService.OriginUrl() + "/list", { params: { keyword: keyword } });
}

export async function GetParentList(keyword) {
    return await HttpGet(UrlService.OriginUrl() + "/parentlist", { params: { keyword: keyword } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.OriginUrl() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.OriginUrl(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.OriginUrl() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.OriginUrl() + "/" + id, _model);
}
