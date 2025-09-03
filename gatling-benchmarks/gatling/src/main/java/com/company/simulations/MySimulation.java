package com.company.simulations;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import java.time.Duration;

public class MySimulation extends Simulation {

    private HttpProtocolBuilder httpProtocol = http
            .baseUrl("http://localhost:80");

    private ScenarioBuilder scn = scenario("Test Dungeon Solver")
            .exec(http("request_1")
                    .post("/dungeon/solve")
                    .header("Content-Type", "application/json")
                    .body(StringBody("[[1,-3,3],[-5,2,1],[0,-2,0]]"))
            );

    {
        setUp(
            scn.injectOpen(rampUsers(10).during(Duration.ofSeconds(10)))
        ).protocols(httpProtocol);
    }
}