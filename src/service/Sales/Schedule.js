import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.Schedule(), { params: params });
}

export async function GetList(id, params) {
    return await HttpGet(UrlService.Schedule() + "/list/" + id, { params: params });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.Schedule() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.Schedule(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.Schedule() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.Schedule() + "/" + id, _model);
}
