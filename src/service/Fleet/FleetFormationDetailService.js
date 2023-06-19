import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.FleetFormationDetailUrl(), { params: params });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.FleetFormationDetailUrl() + "/" + id);
}

export async function GetList(id, keyword) {
    return await HttpGet(UrlService.FleetFormationDetailUrl() + "/list/" + id, { params: { keyword: keyword } });
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.FleetFormationDetailUrl(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.FleetFormationDetailUrl() + "/" + id, _model);
}

export async function DeleteData(id) {
  return await HttpDeleteForm(UrlService.FleetFormationDetailUrl() + "/" + id);
}

