import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.PoSales(), { params: params });
}

export async function GetList(keyword) {
    return await HttpGet(UrlService.PoSales() + "/list", { params: { keyword: keyword } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.PoSales() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.PoSales(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.PoSales() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.PoSales() + "/" + id, _model);
}