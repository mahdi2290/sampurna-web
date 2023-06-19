import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.CustomerUrl(), { params: params });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.CustomerUrl() + "/" + id);
}

export async function GetList(keyword) {
    return await HttpGet(UrlService.CustomerUrl() + "/list", { params: { keyword: keyword } });
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.CustomerUrl(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.CustomerUrl() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.CustomerUrl() + "/" + id, _model);
}
