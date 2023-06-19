import axios from "axios"
import jwtDecode from "jwt-decode"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useHistory } from "react-router-dom"
import UrlService from "../service/UrlService"

const AuthContexts = createContext({})

const axiosGLobal = axios.create({
    baseURL: "http://10.2.3.92:9080/",
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [errors, setErrors] = useState([]);
    const token = useRef();
    const expired = useRef();
    const navigate = useHistory();

    const getDate = async() => {
        const headers = {
            "Content-Type": "application/json",
        };

        try {
            const response = await axiosGLobal.get('v1/getsvrdate', {headers: headers})

            if (response.status === 200) {
                return new Date(response.data);
            }
        } catch (error) {
            console.log(error)
            return new Date();
        }
    };

    const csrf = async() => {
        const currentDate = await getDate();
        console.log(new Date(expired.current), currentDate)
        if (expired.current < currentDate.getTime()) {
            const headers = {
                "Content-Type": "application/json",
            };

            try {
                const response = await axiosGLobal.post(UrlService.RefreshUrl(), {headers: headers, withCredentials: true});

                if (response.status === 200) {
                    const result = response.data;
                    const decoded = jwtDecode(result.data.token);
                    token.current = result.data.token;
                    expired.current = decoded.exp * 1000;
                }
            } catch (e) {
                console.log(e.response);
                navigate.push('login');
            }
        }
    }

    const login = async(data) => {
        setErrors([])
        try {
            const response = await axiosGLobal.post(UrlService.LoginUrl(), data);
            if (response.status === 200) {
                const result = response.data;
                const decoded = jwtDecode(result.data.token);
                token.current = result.data.token;
                expired.current = decoded.exp * 1000;

                console.log(result.data.token);
                // navigate.push("/")
            }
        } catch (e) {
            console.log(e.response);
        }
    }

    // const getUser = async() => {
    //     await csrf();

    //     try {
    //         const headers = {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token.current}`
    //         };

    //         const response = await axiosJWT.get('v1/users/whoami', {headers: headers});
    //         console.log(response);
    //         if (response.status === 200) {
    //             setUser(response.data)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         return new Date();
    //     }
    // }

    const product = async() => {
        await csrf();

        setErrors([])
        try {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.current}`
            };

            const response = await axiosGLobal.get(UrlService.ProductUrl(), {headers: headers});

            console.log(response.data);
        } catch (e) {
            console.log(e.response);
        }
    }

    const logout = () => {
        axios.post("/logout").then(() => {
            setUser(null)
        })
    }

    useEffect(() => {
    //   if (token.current === undefined) {
    //     csrf();
    //   }
    }, [])

    return <AuthContexts.Provider value={{ user, errors, login, logout, product }}>
        {children}
    </AuthContexts.Provider>
}

export default function useAuthContexts() {
    return useContext(AuthContexts)
}
