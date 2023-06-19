import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.PlantUrl(), { params: params });
}

export async function GetByID(bank_id) {
  return await HttpGet(UrlService.PlantUrl() + "/" + bank_id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.PlantUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.PlantUrl() + "/" + id, _model);
}