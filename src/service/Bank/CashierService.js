import { HttpGet, HttpPostForm, GetServerDate } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(id, params) {
  return await HttpGet(UrlService.CashierUrl() + "/joblist/" + id, { params: params });
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.CashierUrl() + '/order/ujt', _model);
}

export async function GetUJTDaily(params) {
  return await HttpGet(UrlService.CashierUrl() + "/report/cashierreport", { params: params });
}

export async function GetDate() {
  return await GetServerDate();
}
