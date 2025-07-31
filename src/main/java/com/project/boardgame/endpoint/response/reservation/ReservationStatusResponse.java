package com.project.boardgame.endpoint.response.reservation;

import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.common.ResponseMessage;
import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@Builder
@NoArgsConstructor
public class ReservationStatusResponse extends ResponseDto {
    private Long reservationId;
    private String status;

    public ReservationStatusResponse(Long reservationId, String status) {
        super();
        this.reservationId =  reservationId;
        this.status =  status;
    }


    public static ResponseEntity<ReservationStatusResponse> success(Long reservationId, String status) {
        ReservationStatusResponse responseBody = new ReservationStatusResponse(reservationId, status);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicateId() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_ID, ResponseMessage.DUPLICATE_ID);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> notFound() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.NOT_FOUND, ResponseMessage.NOT_FOUND);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
