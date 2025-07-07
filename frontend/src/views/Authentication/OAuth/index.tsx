import React, {useEffect} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function OAuth() {
    const {token, expirationTime} = useParams();
    const [cookie, setCookie] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if(!token || !expirationTime) return;

        const now = (new Date().getTime()) * 1000;
        const expires = new Date(now + Number(expirationTime));

        setCookie('accessToken', token, {expires, path: '/'});
        navigate('/');

    }, [token]);

    return (
        <></>
    )
}