import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.OrderCargoProductUrl(), { params: params });
}

export async function GetList(id, keyword) {
    return await HttpGet(UrlService.OrderCargoProductUrl() + "/list/" + id, { params: { keyword: keyword } });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.OrderCargoProductUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.OrderCargoProductUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.OrderCargoProductUrl() + "/" + id, _model);
}

export async function DeleteData(id, form) {
  return await HttpDeleteForm(UrlService.OrderCargoProductUrl() + "/" + id, form);
}
