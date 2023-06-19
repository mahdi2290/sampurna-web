import { HttpGet } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function GetAll() {
    return await HttpGet(UrlService.StateUrl());
}