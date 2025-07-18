package com.project.boardgame.endpoint;

import java.security.Principal;
import java.util.List;

import com.project.boardgame.endpoint.request.GameReservationRequest;
import com.project.boardgame.endpoint.response.ReservationListResponse;
import com.project.boardgame.endpoint.response.ReservationMasterResponse;
import com.project.boardgame.endpoint.response.ReservationStatusResponse;
import com.project.boardgame.endpoint.response.ReservationResponse;
import com.project.boardgame.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    public ResponseEntity<ReservationListResponse> getMyReservations(Principal principal) {
        String userId = principal.getName();
        List<ReservationMasterResponse> reservations = reservationService.getMyReservations(userId);
        return ResponseEntity.ok(ReservationListResponse.builder().data(reservations).build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ReservationResponse>> getReservations(@PathVariable String userId) {
        List<ReservationResponse> reservations = reservationService.getReservations(userId);
        return ResponseEntity.ok(reservations);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReservationStatusResponse> cancelReservation(@PathVariable Long id) {
        ReservationStatusResponse response = reservationService.cancelReservation(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/return")
    public ResponseEntity<ReservationStatusResponse> returnReservation(@PathVariable Long id) {
        ReservationStatusResponse response = reservationService.returnReservation(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/detail")
    public ResponseEntity<List<ReservationResponse>> getUserReservationDetail(@PathVariable String userId) {
        List<ReservationResponse> responses = reservationService.getUserReservationDetail(userId);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/reserve")
    public ResponseEntity<? super ReservationResponse> reserveGame(@RequestBody GameReservationRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ResponseEntity<? super ReservationResponse> response = reservationService.reserve(userId, request);
        return response;
    }

}
