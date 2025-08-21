package com.example.dungeongamekata;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dungeon")
public class DungeonController {
    private final DungeonService dungeonService;

    public DungeonController(DungeonService dungeonService) {
        this.dungeonService = dungeonService;
    }

    @PostMapping("/solve")
    public int calculateMinimumHP(@RequestBody int[][] dungeon) {
        return dungeonService.calculateMinimumHP(dungeon);
    }
}
