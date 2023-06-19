import { HttpGet } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll(page, pageSize, search = "") {
    return await HttpGet(UrlService.CompanyType(), { params: { page: page, pagesize: pageSize, keyword: search } });
}
