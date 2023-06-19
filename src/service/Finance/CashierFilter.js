import { HttpGet } from "../../helpers/HttpHelpers";
import UrlService from "../UrlService";

export async function GetAll(keyword) {
    return await HttpGet(UrlService.InternalUrl(), { params: { keyword: keyword } });
}

export async function GetList(keyword) {
    return await HttpGet(UrlService.Pool() + "/list", { params: { keyword: keyword } });
}


