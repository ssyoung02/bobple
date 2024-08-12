FROM openjdk:17
ARG JAR_FILE=build/libs/backend.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

#COPY --from=builder /backend/build/libs/*.jar app.jar
