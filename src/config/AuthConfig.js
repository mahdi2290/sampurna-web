import * as CookieConfig from './CookieConfig';

class Auth {
    constructor() {
        const token = CookieConfig.get('access_token');
        (token) ? this.authenticated = true : this.authenticated = false;
    }

    login(cb) {
        this.authenticated = true;

        cb();
    }

    logout(cb) {
        CookieConfig.remove('access_token');

        this.authenticated = false;

        cb();
    }

    isAuthenticated() {
        const token = CookieConfig.get('access_token');
        (token) ? this.authenticated = true : this.authenticated = false;

        return this.authenticated;
    }

    getAccessToken() {
        const result = CookieConfig.get('access_token');
        return result;
    }
}

export default new Auth();
