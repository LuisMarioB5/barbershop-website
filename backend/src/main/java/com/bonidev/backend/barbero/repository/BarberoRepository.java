package com.bonidev.backend.barbero.repository;

import com.bonidev.backend.barbero.entity.BarberoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarberoRepository extends JpaRepository<BarberoEntity, Long> {
    @Query("SELECT b FROM BarberoEntity b WHERE b.isActive = true")
    List<BarberoEntity> findAllActiveBarbers();
}
