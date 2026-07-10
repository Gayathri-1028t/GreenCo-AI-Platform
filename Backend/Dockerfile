# ====================================================================
# Multi-stage Dockerfile for GreenCo Spring Boot Backend
# ====================================================================

# Stage 1: Compilation build
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Running Environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/greenco-sustainability-platform-*.jar app.jar

ENV JAVA_OPTS="-XX:+UseG1GC -Xms512m -Xmx1024m"
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
