import { HttpGet, HttpPostForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(bank_id) {
    return await HttpGet(UrlService.BankCompanyUrl() + "?bank_id=" + bank_id);
}

export async function DeleteData(id) {
    return await HttpDeleteForm(UrlService.BankCompanyUrl() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.BankCompanyUrl(), _model);
}