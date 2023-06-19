import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.CashierDropUrl(), { params: params });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.CashierDropUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.CashierDropUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.CashierDropUrl() + '/' + id, _model);
}

export async function DeleteData(id) {
  return await HttpDeleteForm(UrlService.CashierDropUrl() + '/' + id);
}
