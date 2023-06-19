import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
  return await HttpGet(UrlService.UjtUrl(), { params: params });
}

export async function GetPrice(issueDate, origin, plant, product, fleetType) {
    return await HttpGet(UrlService.UjtUrl() + "/get", { params: { issue_date: issueDate, origin_id: origin, plant_id: plant, product_id: product, fleet_type_id: fleetType } });
}

export async function GetByID(bank_id) {
  return await HttpGet(UrlService.UjtUrl() + "/" + bank_id);
}

export async function PostData(_model) {
  return await HttpPostForm(UrlService.UjtUrl(), _model);
}

export async function PutData(id, _model) {
  return await HttpPutForm(UrlService.UjtUrl() + "/" + id, _model);
}