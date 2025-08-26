package com.example.dungeongamekata;

import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface ModelRunRepository extends CrudRepository<ModelRun, Long> {
    Optional<ModelRun> findByInput(String input);
}
