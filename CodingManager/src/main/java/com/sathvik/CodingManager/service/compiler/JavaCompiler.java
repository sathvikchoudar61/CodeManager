package com.sathvik.CodingManager.service.compiler;

import com.sathvik.CodingManager.dto.compiler.RunRequestDTO;
import com.sathvik.CodingManager.dto.compiler.RunResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class JavaCompiler {

    public ResponseEntity<?> compile(RunRequestDTO data) {

        long startTime = System.currentTimeMillis();

        Path tempDir = null;

        try {

            // Prevent package usage
            if (data.getCode().contains("package ")) {

                return ResponseEntity.badRequest().body(
                        new RunResponseDTO(
                                "",
                                "Package declarations are not allowed",
                                false,
                                0
                        )
                );
            }

            // Create temp folder
            String folderName =
                    "java_" + UUID.randomUUID();

            tempDir =
                    Files.createTempDirectory(folderName);

            // Extract class name
            String className =
                    extractClassName(data.getCode());

            // Create Java file
            Path javaFile =
                    tempDir.resolve(className + ".java");

            // Save user code
            Files.write(
                    javaFile,
                    data.getCode().getBytes(StandardCharsets.UTF_8)
            );

            // Convert Windows path for Docker
            String dockerPath =
                    tempDir.toAbsolutePath()
                            .toString()
                            .replace("\\", "/");

            // Convert:
            // C:/Users/... -> /c/Users/...
            dockerPath =
                    "/" +
                            Character.toLowerCase(dockerPath.charAt(0)) +
                            dockerPath.substring(2);

            // Docker command
            ProcessBuilder pb = new ProcessBuilder(

                    "docker",
                    "run",

                    "--rm",

                    "-v",
                    dockerPath + ":/app",

                    "eclipse-temurin:17",

                    "sh",
                    "-c",

                    "cd /app && javac " +
                            className +
                            ".java && java " +
                            className
            );

            // Start process
            Process process = pb.start();

            // Timeout protection
            boolean finished =
                    process.waitFor(
                            30,
                            TimeUnit.SECONDS
                    );

            if (!finished) {

                process.destroyForcibly();

                return ResponseEntity.ok(
                        new RunResponseDTO(
                                "",
                                "Time Limit Exceeded",
                                false,
                                System.currentTimeMillis() - startTime
                        )
                );
            }

            StringBuilder output =
                    new StringBuilder();

            StringBuilder error =
                    new StringBuilder();

            // Read stdout + stderr
            try (

                    BufferedReader outputReader =
                            new BufferedReader(
                                    new InputStreamReader(
                                            process.getInputStream()
                                    )
                            );

                    BufferedReader errorReader =
                            new BufferedReader(
                                    new InputStreamReader(
                                            process.getErrorStream()
                                    )
                            )
            ) {

                String line;

                // Read output
                while ((line = outputReader.readLine()) != null) {
                    output.append(line).append("\n");
                }

                // Read errors
                while ((line = errorReader.readLine()) != null) {
                    error.append(line).append("\n");
                }
            }

            // Success check
            boolean success =
                    process.exitValue() == 0;

            return ResponseEntity.ok(
                    new RunResponseDTO(
                            output.toString(),
                            error.toString(),
                            success,
                            System.currentTimeMillis() - startTime
                    )
            );

        }
        catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    new RunResponseDTO(
                            "",
                            e.getMessage(),
                            false,
                            System.currentTimeMillis() - startTime
                    )
            );
        }
        finally {

            // Delete temp files
            if (tempDir != null) {
                deleteDirectory(tempDir);
            }
        }
    }

    // Extract public class name
    private String extractClassName(String code) {

        String[] lines = code.split("\n");

        for (String line : lines) {

            line = line.trim();

            if (line.startsWith("public class")) {

                String[] parts =
                        line.split("\\s+");

                return parts[2];
            }
        }

        return "Main";
    }

    // Delete temp directory recursively
    private void deleteDirectory(Path path) {

        try (var paths = Files.walk(path)) {

            paths.sorted(java.util.Comparator.reverseOrder())
                    .forEach(p -> {

                        try {
                            Files.delete(p);
                        }
                        catch (Exception ignored) {
                        }
                    });

        }
        catch (Exception ignored) {
        }
    }
}