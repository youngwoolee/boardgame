package com.project.boardgame.endpoint;

import java.security.Principal;
import java.util.List;

import com.project.boardgame.endpoint.request.GameReservationRequest;
import com.project.boardgame.endpoint.response.reservation.ReservationListResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationMasterResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationStatusResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationDetailListResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationDetailResponse;
import com.project.boardgame.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;


    @GetMapping("/me")
    public ResponseEntity<? super ReservationListResponse> getMyReservations(Principal principal) {
        String userId = principal.getName();
        List<ReservationMasterResponse> reservations = reservationService.getMyReservations(userId);
        return ResponseEntity.ok(ReservationListResponse.builder().data(reservations).build());
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<? super ReservationDetailListResponse> getReservationDetails(@PathVariable("reservationId") Long reservationId) {
        List<ReservationDetailResponse> details = reservationService.getReservationDetails(reservationId);
        return ResponseEntity.ok(new ReservationDetailListResponse(details));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getReservations(@PathVariable String userId) {
        List<ReservationResponse> reservations = reservationService.getReservations(userId);
        return ResponseEntity.ok(reservations);
    }

    @PatchMapping("/{reservationId}/cancel")
    public ResponseEntity<ReservationStatusResponse> cancelReservation(@PathVariable("reservationId") Long reservationId) {
        ReservationStatusResponse response = reservationService.cancelReservation(reservationId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{reservationId}/return")
    public ResponseEntity<? super ReservationStatusResponse> returnReservation(@PathVariable("reservationId") Long reservationId) {
        ReservationStatusResponse response = reservationService.returnReservation(reservationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/detail")
    public ResponseEntity<List<ReservationResponse>> getUserReservationDetail(@PathVariable String userId) {
        List<ReservationResponse> responses = reservationService.getUserReservationDetail(userId);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/reserve")
    public ResponseEntity<? super ReservationResponse> reserveGame(@RequestBody GameReservationRequest request, Principal principal) {
        String userId = principal.getName();
        ResponseEntity<? super ReservationResponse> response = reservationService.reserve(userId, request);
        return response;
    }

}
