package com.project.boardgame.endpoint.response.reservation;

import java.time.LocalDateTime;
import java.util.List;

import com.project.boardgame.domain.ReservationStatus;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


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
}
