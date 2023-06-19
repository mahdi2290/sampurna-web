import { HttpGet, HttpGetImage, HttpPostForm, HttpPutForm, HttpDeleteForm, HttpPostImage } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.Employee(), { params: params });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.Employee() + "/" + id);
}

export async function GetListAll(params) {
    return await HttpGet(UrlService.Employee() + "/list", { params: params });
}

export async function GetListCompany(id, keyword) {
    return await HttpGet(UrlService.Employee() + "/list/" + id, { params: { keyword: keyword } });
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.Employee(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.Employee() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.Employee() + "/" + id, _model);
}

export async function PostImage(_model) {
    return await HttpPostImage(UrlService.Employee() + "/uploadimage", _model);
}

export async function GetImageByID(id) {
    return await HttpGetImage(UrlService.Employee() + "/uploadimage/" + id);
}
