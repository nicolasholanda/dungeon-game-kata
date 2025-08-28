# ---- Build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY gradlew /app/gradlew
COPY gradle /app/gradle
RUN chmod +x /app/gradlew

COPY settings.gradle* /app/
COPY build.gradle* /app/

# Warm dependency cache (non-fatal if graph isn't fully resolvable yet)
RUN ./gradlew --no-daemon dependencies || true

COPY src /app/src
RUN ./gradlew --no-daemon clean bootJar

# ---- Runtime stage ----
FROM eclipse-temurin:21-jdk
RUN apt-get update && \
    apt-get install -y stress-ng
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
