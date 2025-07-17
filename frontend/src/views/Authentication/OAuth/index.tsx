import React, {useEffect} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import useTokenHandler from '../../../hooks/useTokenHandler';

export default function OAuth() {
    const {token, expirationTime} = useParams();
    const handleTokenAndRedirect = useTokenHandler();

    useEffect(() => {
        if (token && expirationTime) {
            handleTokenAndRedirect(token, expirationTime);
        }
    }, [token, expirationTime]);

    return (
        <></>
    )
}