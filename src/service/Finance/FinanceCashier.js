import { HttpGet } from "../../helpers/HttpHelpers";
import UrlService from "../UrlService";

export async function GetAll(params) {
    return await HttpGet(UrlService.FinanceCashier(),{params: params})
}
