package com.example.dungeongamekata;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dungeon")
public class DungeonController {
    private final DungeonService dungeonService;
    private final ModelRunRepository modelRunRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DungeonController(DungeonService dungeonService, ModelRunRepository modelRunRepository) {
        this.dungeonService = dungeonService;
        this.modelRunRepository = modelRunRepository;
    }

    @PostMapping("/solve")
    public int calculateMinimumHP(@RequestBody int[][] dungeon) {
        int result = dungeonService.calculateMinimumHP(dungeon);

        try {
            String inputJson = objectMapper.writeValueAsString(dungeon);
            String outputStr = Integer.toString(result);
            modelRunRepository.save(ModelRun.of(inputJson, outputStr));
        } catch (JsonProcessingException e) {
           
        }

        return result;
    }
}
