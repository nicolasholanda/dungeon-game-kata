package com.example.dungeongamekata.repository;

import com.example.dungeongamekata.dto.ModelRun;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface ModelRunRepository extends CrudRepository<ModelRun, Long> {
    Optional<ModelRun> findByInput(String input);
}
