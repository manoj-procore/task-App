FROM openjdk:17-slim

WORKDIR /task-service

COPY target/*.jar task-service.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "task-service.jar"]