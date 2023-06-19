import Axios from "axios";
import { handle400 } from './HandleHelpers';
import Auth from './../config/AuthConfig';

Axios.defaults.baseURL = "https://api.sampurna-group.com/";
// Axios.defaults.baseURL = "http://10.2.3.155:9080/";
//Axios.defaults.baseURL = "http://:9080/";

export async function HttpGet(url, data = "") {
    Axios.defaults.headers.Authorization = `Bearer ${Auth.getAccessToken()}`;

    try {
        const res = await Axios.get(url, data);

        if (res.status === 200) {
            if (res.data.data === null) {
                return {
                    status: 401,
                    message: res.data.errmsg,
                    data: res.data.data
                };
            } else {
                return {
                    status: 200,
                    message: res.data.errmsg,
                    data: res.data.data
                };
            }
        }
    } catch (err) {
        if (err.response) {
            if (err.response.status === 400) {
                const title = err.response.data.errmsg;
                const message = err.response.data.data;

                const list = handle400(title, message);

                return list;
            } else if (err.response.status === 401) {
                const message = err.response.data.errmsg;

                return {
                    status: 401,
                    message: message,
                };
            } else if (err.response.status === 402) {
                const message = err.response.data.errmsg;

                return {
                    status: 402,
                    message: message,
                };
            } else {
                if (err.response.status === 500) {

                    const winUrl = URL.createObjectURL(
                        new Blob([err.response.data], { type: "text/html" })
                    );
                    window.open(winUrl, '_blank');
                }

                return {
                    status: err.response.status,
                    message: err.response.statusText,
                    data: err.response.data,
                };
            }
        } else if (err.request) {
            return {
                status: err.response.data.errno,
                message: err.response.data.errmsg,
                data: err.response.data.data,
            };
        } else {

        }
    }
}

export async function HttpPostForm(url, form) {
    Axios.defaults.headers.Authorization = `Bearer ${Auth.getAccessToken()}`;

    try {
        let res = await Axios.post(url, form, { headers: { "Content-Type": "application/json", "Accept": "application/json" } });

        if (res.status) return {
            status: 200,
            message: res.data.errmsg,
            data: res.data.data
        };
    } catch (err) {
        console.log(err.response)
        if (err.response) {
            if (err.response.status === 400) {
                const title = err.response.data.errmsg;
                const message = err.response.data.data;

                const list = handle400(title, message);

                return list;
            } else if (err.response.status === 401) {
                const message = err.response.data.errmsg;

                return {
                    status: 401,
                    title: message,
                    message: message,
                };
            } else if (err.response.status === 402) {
                const message = err.response.data.errmsg;

                return {
                    status: 402,
                    title: message,
                    message: message,
                };
            } else {
                if (err.response.status === 500) {

                    const winUrl = URL.createObjectURL(
                        new Blob([err.response.data], { type: "text/html" })
                    );
                    window.open(winUrl, '_blank');
                }

                return {
                    status: err.response.status,
                    title: err.response.statusText,
                    data: err.response.data,
                    message: err.response.statusText,
                };
            }
        } else if (err.request) {
            return {
                status: err.response.data.errno,
                title: err.response.data.errmsg,
                data: err.response.data.data,
                message: err.response.data.errmsg,
            };
        } else {

        }
    }
}

export async function HttpPutForm(url, form) {
    Axios.defaults.headers.Authorization = `Bearer ${Auth.getAccessToken()}`;

    try {
        let res = await Axios.put(url, form, { headers: { "Content-Type": "application/json" } });

        if (res.status) return {
            status: 200,
            message: res.data.errmsg,
            data: res.data.data
        };
    } catch (err) {
        if (err.response) {
            if (err.response.status === 400) {
                const title = err.response.data.errmsg;
                const message = err.response.data.data;

                const list = handle400(title, message);

                return list;
            } else if (err.response.status === 401) {
                const message = err.response.data.errmsg;

                return {
                    status: 401,
                    message: message,
                };
            } else if (err.response.status === 402) {
                const message = err.response.data.errmsg;

                return {
                    status: 402,
                    message: message,
                };
            } else {
                if (err.response.status === 500) {

                    const winUrl = URL.createObjectURL(
                        new Blob([err.response.data], { type: "text/html" })
                    );
                    window.open(winUrl, '_blank');
                }

                return {
                    status: err.response.status,
                    message: err.response.statusText,
                    data: err.response.data,
                };
            }
        } else if (err.request) {
            console.log(err.request);
        } else {

        }
    }
}

export async function HttpDeleteForm(url, form = "") {
    Axios.defaults.headers.Authorization = `Bearer ${Auth.getAccessToken()}`;

    try {
        let res = await Axios({
            url: url,
            method: "DELETE",
            data: form
        });

        if (res.data.errno === 200) return {
            status: 200,
            message: res.data.errmsg,
        };
    } catch (err) {
        if (err.response) {
            if (err.response.status === 400) {
                const message = err.response.data.data;

                const list = handle400(message);

                return list;
            }
        } else if (err.request) {
            return {
                status: err.response.status,
                message: err.response.data,
            };
        } else {
            return {
                status: err.response.status,
                message: err.response.data,
            };
        }
    }
}

export async function HttpPostImage(url, form) {
    Axios.defaults.headers.Authorization = `Bearer ${Auth.getAccessToken()}`;

    try {
        let res = await Axios.post(url, form, { headers: { 'Content-Type': 'multipart/form-data' } });

        if (res.status) return {
            status: 200,
            message: res.errmsg,
            data: res.data.data
        };
    } catch (err) {
        if (err.response) {
            if (err.response.status === 400) {
                const title = err.response.data.errmsg;
                const message = err.response.data.data;

                const list = handle400(title, message);

                return list;
            } else if (err.response.status === 401) {
                const message = err.response.data.errmsg;

                return {
                    status: 401,
                    message: message,
                };
            }
        } else if (err.request) {
            console.log(err.request);
        } else {

        }
    }
}

export async function HttpGetImage(url, data = null) {
    Axios.defaults.headers.Authorization = `Bearer ${Auth.getAccessToken()}`;

    try {
        const res = await Axios.get(url, data);

        if (res.status === 200) {
            return {
                status: 200,
                data: res.data
            };
        }
    } catch (err) {
        return {
            status: err.response.data.errno,
            message: err.response.data.errmsg,
            data: err.response.data.data,
        };
    }
}

export async function GetServerDate() {
    try {
        const res = await Axios.get('v1/getsvrdate');

        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        console.log(err)
    }
}

export async function HttpPostLogin(url, form) {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    try {
        let res = await Axios.post(url, form, { headers: headers });

        if (res.status) return {
            status: 200,
            message: res.data.errmsg,
            data: res.data.data
        };
    } catch (err) {
        console.log(err.response);
        if (err.response) {
            if (err.response.status === 400) {
                const title = err.response.data.errmsg;
                const message = err.response.data.data;

                const list = handle400(title, message);

                return list;
            } else if (err.response.status === 401) {
                const message = err.response.data.errmsg;

                return {
                    status: 401,
                    title: message,
                    message: message,
                };
            } else if (err.response.status === 402) {
                const message = err.response.data.errmsg;

                return {
                    status: 402,
                    title: message,
                    message: message,
                };
            } else {
                if (err.response.status === 500) {

                    const winUrl = URL.createObjectURL(
                        new Blob([err.response.data], { type: "text/html" })
                    );
                    window.open(winUrl, '_blank');
                }

                return {
                    status: err.response.status,
                    title: err.response.statusText,
                    data: err.response.data,
                    message: err.response.statusText,
                };
            }
        } else if (err.request) {
            return {
                status: err.response.data.errno,
                title: err.response.data.errmsg,
                data: err.response.data.data,
                message: err.response.data.errmsg,
            };
        } else {

        }
    }
}

export async function HttpGetWithToken(url, data = "", token) {
    Axios.defaults.headers.Authorization = `Bearer ${token}`;

    try {
        const res = await Axios.get(url, data);

        if (res.status === 200) {
            if (res.data.data === null) {
                return {
                    status: 401,
                    message: res.data.errmsg,
                    data: res.data.data
                };
            } else {
                return {
                    status: 200,
                    message: res.data.errmsg,
                    data: res.data.data
                };
            }
        }
    } catch (err) {
        if (err.response) {
            // console.log(err.response)
            if (err.response.status === 400) {
                const title = err.response.data.errmsg;
                const message = err.response.data.data;

                const list = handle400(title, message);

                return list;
            } else if (err.response.status === 401) {
                const message = err.response.data.errmsg;

                return {
                    status: 401,
                    message: message,
                };
            } else if (err.response.status === 402) {
                const message = err.response.data.errmsg;

                return {
                    status: 402,
                    message: message,
                };
            } else {
                if (err.response.status === 500) {

                    const winUrl = URL.createObjectURL(
                        new Blob([err.response.data], { type: "text/html" })
                    );
                    window.open(winUrl, '_blank');
                }

                return {
                    status: err.response.status,
                    message: err.response.statusText,
                    data: err.response.data,
                };
            }
        } else if (err.request) {
            return {
                status: err.response.data.errno,
                message: err.response.data.errmsg,
                data: err.response.data.data,
            };
        } else {

        }
    }
}
