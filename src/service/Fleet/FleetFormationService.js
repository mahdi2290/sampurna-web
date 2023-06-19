import { HttpGet, HttpPostForm, HttpPutForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.FleetFormationUrl(), { params: params });
}

export async function GetAllActive(params) {
    return await HttpGet(UrlService.FleetFormationUrl() + "/list", { params: params });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.FleetFormationUrl() + "/" + id);
}

export async function GetDriverList(params) {
    return await HttpGet(UrlService.FleetFormationUrl() + "/driver", { params: params });
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.FleetFormationUrl(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.FleetFormationUrl() + "/" + id, _model);
}

export async function GetAvailableVehicle(id, params) {
    return await HttpGet("v1/fleet/formation/vacant/" + id, { params: params });
}
