import UrlService from './UrlService';
import * as CookieConfig from './../config/CookieConfig';
import { HttpPostLogin } from '../helpers/HttpHelpers';
import jwtDecode from 'jwt-decode';

export async function doUserLogin(_model) {
    const result = await HttpPostLogin(UrlService.LoginUrl(), _model);

    return result;
}

export async function doRefreshToken() {
    const result = await HttpPostLogin(UrlService.RefreshUrl());

    if (result.status === 200) {
        const decoded = jwtDecode(result.data.token);
        const exp = decoded.exp * 1000;

        const options = { path: "/", expires: new Date(exp) };
        CookieConfig.set('access_token', result.data.token, options);
    }
}

export function handleLoginSuccess(response, pool) {
    const decoded = jwtDecode(response.token);
    const exp = decoded.exp * 1000;

    const options = { path: "/", expires: new Date(exp) };

    CookieConfig.set('access_token', response.token, options);
    CookieConfig.set('pool_id', pool, options);

    return true;
}

export function Logout() {
    CookieConfig.remove('pool_id');
    CookieConfig.remove('access_token');

    return true;
}
