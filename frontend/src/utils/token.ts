import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const getAccessTokenHeader = () => {
    const token = cookies.get('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};