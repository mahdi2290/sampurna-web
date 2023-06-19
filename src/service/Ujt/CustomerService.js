import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(page, pageSize, search = "") {
  return await HttpGet(UrlService.CustomerUrl(), { params: { page: page, pagesize: pageSize, keyword: search } });
}

export async function GetByID(id) {
  return await HttpGet(UrlService.CustomerUrl() + "/" + id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.CustomerUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.CustomerUrl() + "/" + id, _model);
}