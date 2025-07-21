package com.project.boardgame.endpoint.response.reservation;

import java.util.List;
import java.util.stream.Collectors;

import com.project.boardgame.domain.ReservationMaster;
import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@Builder
@NoArgsConstructor
public class ReservationListResponse extends ResponseDto {
    private List<ReservationMasterResponse> data;

    @Builder
    public ReservationListResponse(List<ReservationMasterResponse> data) {
        super();
        this.data = data;
    }

    public static ResponseEntity<ReservationListResponse> success(List<ReservationMaster> response) {
        List<ReservationMasterResponse> reservationResponseList = response.stream()
                .map(ReservationMasterResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(new ReservationListResponse(reservationResponseList));
    }
}
