import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.BankUrl(), { params: params });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.BankUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.BankUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.BankUrl() + "/" + id, _model);
}