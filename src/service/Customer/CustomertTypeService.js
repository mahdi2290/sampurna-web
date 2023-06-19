import { HttpPostForm, HttpDeleteForm } from '../../helpers/HttpHelpers';
import UrlService from '../UrlService';

export async function DeleteData(id) {
    return await HttpDeleteForm(UrlService.CustomerType() + "/" + id);
}

export async function PostData(_model) {
    return await HttpPostForm(UrlService.CustomerType(), _model);
}
