import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm, GetServerDate} from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.OrderCargoDetailUrl(), { params: params });
}

export async function GetList(id, keyword) {
    return await HttpGet(UrlService.OrderCargoDetailUrl() + "/list/" + id, { params: { keyword: keyword } });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.OrderCargoDetailUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.OrderCargoDetailUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.OrderCargoDetailUrl() + "/" + id, _model);
}

export async function DeleteData(id) {
  return await HttpDeleteForm(UrlService.OrderCargoDetailUrl() + "/" + id);
}

export async function Confirm(id, _model) {
  return await HttpPostForm("v1/order/cargo/confirm/" + id, _model);
}

export async function Close(id) {
  return await HttpPostForm("v1/order/closeorder/" + id);
}

export async function PostImage(id, _model) {
    return await HttpPostForm(UrlService.OrderCargoUrl() + "/image/" + id, _model);
}

export async function GetStatus() {
  return await HttpGet("v1/status/order/list");
}

export async function GetReceipt(id) {
  return await HttpGet("v1/order/report/receiptorder/" + id);
}

export async function GetDate() {
    return await GetServerDate();
}
