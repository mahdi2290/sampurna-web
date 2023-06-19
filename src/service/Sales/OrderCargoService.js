import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(id, params) {
  return await HttpGet(UrlService.OrderCargoUrl() + "/" + id, { params: params });
}

export async function GetList(id, keyword) {
    return await HttpGet(UrlService.OrderCargoUrl() + "/list/" + id, { params: { keyword: keyword } });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.OrderCargoUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.OrderCargoUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.OrderCargoUrl() + "/" + id, _model);
}