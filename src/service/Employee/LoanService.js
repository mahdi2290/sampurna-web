import { HttpGet, HttpPostForm, HttpPutForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(params) {
    return await HttpGet(UrlService.EmployeeLoan(), { params: { params } });
}

export async function GetByID(id) {
    return await HttpGet(UrlService.EmployeeLoan() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.EmployeeLoan(), _model);
}

export async function PutData(id, _model) {
    return await HttpPutForm(UrlService.EmployeeLoan() + "/" + id, _model);
}

export async function DeleteData(id, _model) {
    return await HttpDeleteForm(UrlService.EmployeeLoan() + "/" + id, _model);
}
