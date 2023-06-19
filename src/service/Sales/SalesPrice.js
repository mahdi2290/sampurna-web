import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(page, pageSize, search = "") {
    return await HttpGet(UrlService.SalesPrice(), { params: { page: page, pagesize: pageSize, keyword: search } });
}

export async function GetPrice(issueDate, origin, plant, product, orderType, fleetType, uom, method) {
    return await HttpGet(UrlService.SalesPrice() + "/get", { params: { issue_date: issueDate, origin_id: origin, plant_id: plant, product_id: product, order_type_id: orderType, fleet_type_id: fleetType, uom: uom, method: method } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.SalesPrice() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.SalesPrice(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.SalesPrice() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.SalesPrice() + "/" + id, _model);
}
