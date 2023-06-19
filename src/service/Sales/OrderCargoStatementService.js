import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.OrderCargoStatementUrl(), { params: params });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.OrderCargoStatementUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.OrderCargoStatementUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.OrderCargoStatementUrl() + "/" + id, _model);
}

export async function DeleteData(id) {
  return await HttpDeleteForm(UrlService.OrderCargoStatementUrl() + "/" + id);
}