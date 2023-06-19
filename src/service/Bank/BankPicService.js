import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(bank_id) {
  return await HttpGet(UrlService.BankPICUrl() + "?bank_id=" + bank_id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.BankPICUrl(), _model);
}

export async function PutData(id, _model) {
  // new Response(_model).text().then(console.log);
  return await HttpPutForm(UrlService.BankPICUrl() + "/" + id, _model);
}

export async function DeleteData(bank_id, form) {
  return await HttpDeleteForm(UrlService.BankPICUrl() + "/" + bank_id, form);
}
