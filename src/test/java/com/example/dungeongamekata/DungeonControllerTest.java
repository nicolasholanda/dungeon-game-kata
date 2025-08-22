package com.example.dungeongamekata;

import com.example.dungeongamekata.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class DungeonControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DungeonService dungeonService;

    @Mock
    private ModelRunRepository modelRunRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        DungeonController controller = new DungeonController(dungeonService, modelRunRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void postSolve_WithMalformedJson_ReturnsFormattedErrorResponse() throws Exception {
        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{invalid json"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("Invalid JSON format or malformed request body")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.path", is("/dungeon/solve")))
                .andExpect(jsonPath("$.timestamp", matchesPattern("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}")));
    }

    @Test
    void postSolve_WithEmptyBody_ReturnsFormattedErrorResponse() throws Exception {
        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("Invalid JSON format or malformed request body")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.path", is("/dungeon/solve")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    void postSolve_WithWrongContentType_ReturnsFormattedErrorResponse() throws Exception {
        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.TEXT_PLAIN)
                .content("not json"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("An unexpected error occurred")))
                .andExpect(jsonPath("$.statusCode", is(500)))
                .andExpect(jsonPath("$.error", is("Internal Server Error")));
    }

    @Test
    void postSolve_WithInvalidJsonStructure_ReturnsFormattedErrorResponse() throws Exception {
        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"invalid\": \"structure\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("Invalid JSON format or malformed request body")))
                .andExpect(jsonPath("$.statusCode", is(400)))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    void postSolve_WhenServiceThrowsRuntimeException_ReturnsFormattedErrorResponse() throws Exception {
        when(dungeonService.calculateMinimumHP(any())).thenThrow(new RuntimeException("Service error"));

        int[][] validDungeon = {{1, 2}, {3, 4}};

        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validDungeon)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message", is("An unexpected error occurred")))
                .andExpect(jsonPath("$.statusCode", is(500)))
                .andExpect(jsonPath("$.error", is("Internal Server Error")))
                .andExpect(jsonPath("$.path", is("/dungeon/solve")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    void postSolve_WithValidInput_ReturnsSuccessfulResponse() throws Exception {
        when(dungeonService.calculateMinimumHP(any())).thenReturn(42);

        int[][] validDungeon = {{1, 2}, {3, 4}};

        mockMvc.perform(post("/dungeon/solve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validDungeon)))
                .andExpect(status().isOk())
                .andExpect(content().string("42"));
    }
}
