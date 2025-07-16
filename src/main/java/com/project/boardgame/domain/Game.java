package com.project.boardgame.domain;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    private String tag;

    private int minPlayers;

    private int maxPlayers;

    private String age;

    private String time;

    private String genre;

    private String system;

    @Column(unique = true, nullable = false)
    private String barcode; // 고유 바코드 (e.g., SPLEND2025-001)

    @OneToMany(mappedBy = "game", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReservationDetail> reservations = new ArrayList<>();

    public Game(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public boolean supportsPlayerCount(int count) {
        return count >= minPlayers && count <= maxPlayers;
    }
}
