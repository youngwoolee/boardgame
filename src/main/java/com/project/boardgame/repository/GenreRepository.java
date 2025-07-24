package com.project.boardgame.repository;

import java.util.Optional;

import com.project.boardgame.domain.Genre;
import org.springframework.data.jpa.repository.JpaRepository;


public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByName(String name);
}
