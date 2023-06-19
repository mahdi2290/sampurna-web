import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.FleetTypeUrl(), { params: params });
}

export async function GetListAll(keyword) {
    return await HttpGet(UrlService.FleetTypeUrl() + "/list", { params: { keyword: keyword } });
}

export async function GetList(id, keyword) {
    return await HttpGet(UrlService.FleetTypeUrl() + "/list/" + id, { params: { keyword: keyword } });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.FleetTypeUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.FleetTypeUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.FleetTypeUrl() + "/" + id, _model);
}