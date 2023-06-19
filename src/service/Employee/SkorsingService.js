import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.EmployeeSkor(), { params: { params } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.EmployeeSkor() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.EmployeeSkor(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.EmployeeSkor() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.EmployeeSkor() + "/" + id, _model);
}
