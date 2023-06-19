import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(page, pageSize, search = "") {
    return await HttpGet(UrlService.SalesType(), { params: { page: page, pagesize: pageSize, keyword: search } });
}

export async function GetList(keyword) {
    return await HttpGet(UrlService.SalesType(), { params: { keyword: keyword } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.SalesType() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.SalesType(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.SalesType() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.SalesType() + "/" + id, _model);
}
