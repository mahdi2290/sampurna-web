import Cookie from "universal-cookie";

const cookie = new Cookie();

export function get(key){
    return cookie.get(key);
}

export function set(key, value, options) {
    cookie.set(key, value, options);
}

export function remove(key) {
    cookie.remove(key);
}