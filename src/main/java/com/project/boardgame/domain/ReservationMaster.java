package com.project.boardgame.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationMaster {
    @Id
    @GeneratedValue
    private Long id;

    private String userId;
    private String userNickname;

    private LocalDateTime reservedAt;
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status; // 예약, 반납, 취소

    @OneToMany(mappedBy = "master", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ReservationDetail> details = new ArrayList<>();

}
