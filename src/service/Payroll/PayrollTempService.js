import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function Get(params) {
    return await HttpGet(UrlService.PayrollDriver() + "/temp", { params: params });
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.PayrollDriver() + "/temp", _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.PayrollDriver() + "/temp/" + id, _model);
}