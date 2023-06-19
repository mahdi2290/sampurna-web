import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm, HttpGetWithToken } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.Pool(), { params: params });
}

export async function GetListWithToken(token, keyword) {
    return await HttpGetWithToken(UrlService.Pool() + "/list", { params: { keyword: keyword } }, token);
}

export async function GetList(keyword) {
    return await HttpGet(UrlService.Pool() + "/list", { params: { keyword: keyword } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.Pool() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.Pool(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.Pool() + "/" + id, _model);
}

export async function DeleteData(id, form) {
    return await HttpDeleteForm(UrlService.Pool() + "/" + id, form);
}
