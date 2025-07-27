package com.project.boardgame.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    private String tag;

    private int minPlayers;

    private int maxPlayers;

    private int age;

    private String time;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "game_genres", // 생성될 조인 테이블 이름
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "game_systems", // 생성될 조인 테이블 이름
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "system_type_id")
    )
    private Set<SystemType> systems;

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
