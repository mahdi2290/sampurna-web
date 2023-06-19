import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.Department(), { params: params });
}

export async function GetList(keyword) {
    return await HttpGet(UrlService.Department() + "/list", { params: { keyword: keyword } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.Department() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.Department(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.Department() + "/" + id, _model);
}

export async function DeleteData(id, form) {
    return await HttpDeleteForm(UrlService.Department() + "/" + id, form);
}
