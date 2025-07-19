package com.project.boardgame.domain;

public enum ReservationStatus {
    RESERVED("예약"),
    CANCELLED("취소"),
    RETURNED("반납");

    private final String label;

    ReservationStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
