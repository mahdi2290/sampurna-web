import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAllByCompany(id) {
    return await HttpGet(UrlService.PlantUrl() + "/list/" + id);
}

export async function GetAll(keyword) {
    return await HttpGet(UrlService.PlantUrl(), { params: { keyword: keyword } });
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.PlantUrl(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.PlantUrl() + "/" + id, _model);
}

export async function DeleteData(id, form) {
    return await HttpDeleteForm(UrlService.PlantUrl() + "/" + id, form);
}