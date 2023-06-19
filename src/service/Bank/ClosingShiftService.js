import { HttpGet, HttpPostForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(id, params) {
  return await HttpGet(UrlService.ClosingShiftUrl() + "/" + id, { params: params });
}

export async function PostData(id, _model) {
  return await HttpPostForm(UrlService.ClosingShiftUrl() + "/" + id, _model);
}