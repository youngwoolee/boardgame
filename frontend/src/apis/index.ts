import {
    CheckCertificationRequestDto,
    EmailCertificationRequestDto,
    IdCheckRequestDto, SignInRequestDto, SignUpRequestDto
} from "./request/auth";
import axios, {AxiosResponse} from "axios";
import {
    CheckCertificationResponseDto,
    EmailCertificationResponseDto,
    IdCheckResponseDto, SignInResponseDto, SignUpResponseDto
} from "./response/auth";
import {ResponseDto} from "./response";
import {GameListResponseDto} from "./response/game";
import { getAccessTokenHeader } from '../utils/token';
import ReserveGameRequestDto from "./request/game/reserve-game.request.dto";
import ReserveGameResponseDto from "./response/game/reserve-game.response.dto";
import axiosInstance from "../utils/axiosInstance";

const responseHandler = <T> (response: AxiosResponse<any, any>) => {
    const responseBody: T = response.data;
    return responseBody;
}

const errorHandler = (error: any) => {
    if(!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
}

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver') => `${API_DOMAIN}/auth/oauth2/${type}`;
const GAME_LIST_URL = () => `${API_DOMAIN}/games`;
const RESERVE_GAME_URL = () => `${API_DOMAIN}/reservations/reserve`;


export const reserveGamesRequest = async (requestBody: ReserveGameRequestDto) => {
    const headers = getAccessTokenHeader();
    const result = await axios.post(RESERVE_GAME_URL(), requestBody, { headers })
        .then(responseHandler<ReserveGameResponseDto>)
        .catch(errorHandler);
    return result;
};

export const getGameListRequest = async () => {
    const headers = getAccessTokenHeader();
    const result = await axios.get(GAME_LIST_URL(), { headers })
        .then(responseHandler<GameListResponseDto>)
        .catch(errorHandler);
    return result;
}

export const signInRequest = async (requestBody: SignInRequestDto) => {

    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(responseHandler<SignInResponseDto>)
        .catch(errorHandler);
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {

    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(responseHandler<SignUpResponseDto>)
        .catch(errorHandler);
    return result;
}

export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {

    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler<IdCheckResponseDto>)
        .catch(errorHandler);
    return result;
}

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {

    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<EmailCertificationResponseDto>)
        .catch(errorHandler);
    return result;
}

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {

    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<CheckCertificationResponseDto>)
        .catch(errorHandler);
    return result;
}