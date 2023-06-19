import { HttpGet } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetOnGoing(employee_id) {
  return await HttpGet(UrlService.EmployeeMemoPot() + "/" + employee_id);
}

export async function GetGantungan(employee_id) {
    return await HttpGet(UrlService.EmployeeMemoPot() + "/list/" + employee_id);
}
