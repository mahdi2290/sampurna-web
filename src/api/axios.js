import axios from 'axios';

const BASE_URL = "http://10.2.3.155:9080/";
// const BASE_URL = "https://api.sampurna-group.com/";

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    // headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
