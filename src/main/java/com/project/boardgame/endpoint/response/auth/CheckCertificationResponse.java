package com.project.boardgame.endpoint.response.auth;

import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.common.ResponseMessage;
import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
public class CheckCertificationResponse extends ResponseDto {

    private CheckCertificationResponse() {
        super();
    }


    public static ResponseEntity<CheckCertificationResponse> success() {
        CheckCertificationResponse responseBody = new CheckCertificationResponse();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> certificationFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.CERTIFICATION_FAIL, ResponseMessage.CERTIFICATION_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> mailSendFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.MAIL_FAIL, ResponseMessage.MAIL_FAIL);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }

}
