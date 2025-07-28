import {
    CheckCertificationRequestDto, CompleteSignupRequestDto,
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
import {
    ReservationMasterListResponseDto
} from "./response/reservation/reservation-master.response.dto";
import {
    ReservationDetailListResponseDto
} from "./response/reservation/reservation-detail.response.dto";
import UploadResponseDto from "./response/admin/upload.response.dto";
import UploadRequestDto from "./request/admin/upload.request.dto";
import {UserResponseDto} from "./response/user";
import GeneratedGameInfoResponseDto from "./response/admin/generated-game-info.response.dto";


const responseHandler = <T> (response: AxiosResponse<any, any>) => {
    const responseBody: T = response.data;
    return responseBody;
}

const errorHandler = (error: any) => {
    if(!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
}

const DOMAIN = process.env.REACT_APP_API_URL;
const API_DOMAIN = `${DOMAIN}/api/v1`;

const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const COMPLETE_SIGN_UP_URL = () => `${API_DOMAIN}/auth/complete-signup`;
export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver') => `${API_DOMAIN}/auth/oauth2/${type}`;
const GAME_LIST_URL = () => `${API_DOMAIN}/games`;
const RESERVE_GAME_URL = () => `${API_DOMAIN}/reservations/reserve`;
const MY_RESERVATION_URL = () => `${API_DOMAIN}/reservations/me`;
const MY_RESERVATION_DETAIL_URL = (reservationId: number) => `${API_DOMAIN}/reservations/${reservationId}`;
const MY_RESERVATION_RETURN_URL = (reservationId: number) => `${API_DOMAIN}/reservations/${reservationId}/return`;
const MY_RESERVATION_CANCEL_URL = (reservationId: number) => `${API_DOMAIN}/reservations/${reservationId}/cancel`;
const MY_PROFILE_URL = () => `${API_DOMAIN}/user/me`;
const UPLOAD_IMAGE_URL = () => `${API_DOMAIN}/admin/upload`;
const UPLOAD_BY_URL_IMAGE_URL = () => `${API_DOMAIN}/admin/upload-by-url`;
const GENERATE_GAME_INFO_URL = () => `${API_DOMAIN}/admin/generate-info`;


export const generateGameInfoRequest = async (boardGameName: string) => {
    const requestBody = { boardGameName };
    const headers = getAccessTokenHeader();
    const result = await axiosInstance.post(GENERATE_GAME_INFO_URL(), requestBody, { headers })
        .then(responseHandler<GeneratedGameInfoResponseDto>)
        .catch(errorHandler);
    return result;
};

export const getMyProfileRequest = async () => {
    const headers = getAccessTokenHeader();
    const result = await axiosInstance.get(MY_PROFILE_URL(), { headers })
        .then(responseHandler<UserResponseDto>)
        .catch(errorHandler);
    return result;
};

export const createGameRequest = async (
    imageFile: File,
    gameData: UploadRequestDto
) => {
    try {
        const headers = {
            ...getAccessTokenHeader(),
            'Content-Type': 'multipart/form-data',
        };

        const formData = new FormData();
        formData.append('image', imageFile); // 이미지 파일
        formData.append('data', new Blob([JSON.stringify(gameData)], { type: 'application/json' })); // 게임 정보 JSON

        const response = await axiosInstance.post<UploadResponseDto>(
            UPLOAD_IMAGE_URL(),
            formData,
            { headers }
        );

        return responseHandler<UploadResponseDto>(response);
    } catch (error) {
        return errorHandler(error);
    }
};

export const createGameByUrlRequest = async (
    gameData: UploadRequestDto
) => {
    try {
        const headers = {
            ...getAccessTokenHeader(),
            'Content-Type': 'application/json',
        };

        const response = await axiosInstance.post<UploadResponseDto>(
            UPLOAD_BY_URL_IMAGE_URL(),
            gameData,
            { headers }
        );

        return responseHandler<UploadResponseDto>(response);
    } catch (error) {
        return errorHandler(error);
    }
};

export const getMyReservationsRequest = async () => {
    const headers = getAccessTokenHeader();
    const result = await axiosInstance.get(MY_RESERVATION_URL(), { headers })
        .then(responseHandler<ReservationMasterListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const getReservationDetailRequest = async (reservationId: number) => {
    const headers = getAccessTokenHeader();
    const result = await axiosInstance.get(MY_RESERVATION_DETAIL_URL(reservationId), { headers })
        .then(responseHandler<ReservationDetailListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const returnReservationRequest = async (reservationId: number) => {
    const headers = getAccessTokenHeader();
    const result = await axiosInstance.patch(MY_RESERVATION_RETURN_URL(reservationId), {}, { headers })
        .then(responseHandler<ResponseDto>)
        .catch(errorHandler);
    return result;
};

export const cancelReservationRequest = async (reservationId: number) => {
    const headers = getAccessTokenHeader();
    const result = await axiosInstance.patch(MY_RESERVATION_CANCEL_URL(reservationId), {}, { headers })
        .then(responseHandler<ResponseDto>)
        .catch(errorHandler);
    return result;
};

export const completeSignUpRequest = async (requestBody: CompleteSignupRequestDto, token: string) => {
    const result = await axios.post(
        COMPLETE_SIGN_UP_URL(),
        requestBody,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    )
        .then(responseHandler<ResponseDto>)
        .catch(errorHandler);
    return result;
}

export const reserveGamesRequest = async (requestBody: ReserveGameRequestDto) => {
    const headers = getAccessTokenHeader();
    const result = await axiosInstance.post(RESERVE_GAME_URL(), requestBody, { headers })
        .then(responseHandler<ReserveGameResponseDto>)
        .catch(errorHandler);
    return result;
};

export const getGameListRequest = async () => {
    const headers = getAccessTokenHeader();
    const result = await axiosInstance.get(GAME_LIST_URL(), { headers })
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