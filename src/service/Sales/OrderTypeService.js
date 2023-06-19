import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.OrderTypeUrl(), { params: params });
}

export async function GetList(id, keyword) {
    return await HttpGet(UrlService.OrderTypeUrl() + "/list/" + id, { params: { keyword: keyword } });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.OrderTypeUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.OrderTypeUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.OrderTypeUrl() + "/" + id, _model);
}