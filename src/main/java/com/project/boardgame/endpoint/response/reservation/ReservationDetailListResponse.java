package com.project.boardgame.endpoint.response.reservation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.project.boardgame.domain.ReservationMaster;
import com.project.boardgame.domain.ReservationStatus;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.auth.CheckCertificationResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@Builder
@NoArgsConstructor
public class ReservationDetailListResponse extends ResponseDto {
    private List<ReservationDetailResponse> data;

    public ReservationDetailListResponse(List<ReservationDetailResponse> data) {
        super();
        this.data = data;
    }

    public List<ReservationDetailResponse> getData() {
        return data;
    }

    public static ResponseEntity<ReservationDetailListResponse> success(List<ReservationDetailResponse> data) {
        ReservationDetailListResponse responseBody = new ReservationDetailListResponse(data);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
