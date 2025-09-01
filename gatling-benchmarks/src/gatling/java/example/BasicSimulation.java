package example;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

public class BasicSimulation extends Simulation {


    // Define HTTP configuration
    // Reference: https://docs.gatling.io/reference/script/http/protocol/
    HttpProtocolBuilder httpProtocol =
        http.baseUrl("http://localhost:8080/")
            .acceptHeader("application/json")
            .userAgentHeader(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36");

    // Define scenario
    // Reference: https://docs.gatling.io/concepts/scenario/
    ScenarioBuilder scenario =
        scenario("Scenario").exec(http("Session").get("/hello"));


    // Define injection profile and execute the test
    // Reference:  https://docs.gatling.io/concepts/injection/
    {
    setUp(scenario.injectOpen(constantUsersPerSec(2).during(60))).protocols(httpProtocol);
    }
}