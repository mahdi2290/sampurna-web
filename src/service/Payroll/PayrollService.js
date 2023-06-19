import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(page, pageSize, search = "") {
    return await HttpGet(UrlService.PayrollDriver(), { params: { page: page, pagesize: pageSize, keyword: search } });
}

export async function GetOrder(params) {
    return await HttpGet(UrlService.PayrollDriver() + "/order", { params: params });
}

export async function GetLoan(params) {
    return await HttpGet(UrlService.PayrollDriver() + "/loan", { params: params });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.PayrollDriver() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.PayrollDriver(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.PayrollDriver() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.PayrollDriver() + "/" + id, _model);
}

export async function PostDataLoan(_model) {
    return await HttpPostForm(UrlService.PayrollDriver() + "/loan", _model);
}

export async function GetSlip(id, params) {
    return await HttpGet(UrlService.PayrollDriver() + "/slip/" + id, { params: params });
}

