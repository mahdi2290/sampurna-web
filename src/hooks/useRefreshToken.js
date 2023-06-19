import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('v2/users/refresh', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        console.log(response)
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.message);
            return { ...prev, accessToken: response.data.message }
        });
        return response.data.message;
    }
    console.log(refresh);
    return refresh;

    // const refresh = async () => {
    //     const response = await axios.post('v2/users/refresh',
    //         form,
    //         {
    //             headers: { 'Content-Type': 'application/json' },
    //             withCredentials: true,
    //         }
    //     );
    // }
    // console.log(refresh);
    // return refresh;

};

export default useRefreshToken;
