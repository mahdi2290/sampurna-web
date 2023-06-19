import { HttpGet } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetListLoan(keyword) {
    return await HttpGet(UrlService.CashierTypeLoan() + "/list", { params: { keyword: keyword } });
}

export async function GetListUJT(keyword) {
    return await HttpGet(UrlService.CashierTypeUjt() + "/list", { params: { keyword: keyword } });
}