import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.FleetUrl(), { params: params });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.FleetUrl() + "/" + id);
}

export async function GetList(id, params) {
    return await HttpGet(UrlService.FleetUrl() + "/list/" + id, { params: params });
}

export async function GetFormation(id, params) {
    return await HttpGet(UrlService.FleetUrl() + "/formation/" + id, { params: params });
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.FleetUrl(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.FleetUrl() + "/" + id, _model);
}
