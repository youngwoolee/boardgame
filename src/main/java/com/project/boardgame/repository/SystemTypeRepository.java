package com.project.boardgame.repository;

import java.util.Optional;

import com.project.boardgame.domain.SystemType;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SystemTypeRepository extends JpaRepository<SystemType, Long> {
    Optional<SystemType> findByName(String name);
}
