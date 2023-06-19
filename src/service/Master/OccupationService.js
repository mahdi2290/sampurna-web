import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.Occupation(), { params: params });
}

export async function GetList(keyword) {
    return await HttpGet(UrlService.Occupation() + "/list", { params: { keyword: keyword } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.Occupation() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.Occupation(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.Occupation() + "/" + id, _model);
}

export async function DeleteData(id, form) {
    return await HttpDeleteForm(UrlService.Occupation() + "/" + id, form);
}
