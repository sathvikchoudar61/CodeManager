package com.sathvik.CodingManager.service.platform;

import com.sathvik.CodingManager.dto.platform.AllPlatformsDataDTO;
import com.sathvik.CodingManager.model.CodingStats;
import com.sathvik.CodingManager.repository.CodingStatsRepository;
import jakarta.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PlatformGetService {

    @Autowired
    private CodingStatsRepository codingStatsRepository;

    private CodingStats getCodingStats(String userId) {
        return codingStatsRepository.findByUserId(userId);
    }

    public ResponseEntity<?> getPlatformData(String userId, String platform) {

        CodingStats codingStats = getCodingStats(userId);

        if(codingStats == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Coding stats not found"
                    )
            );
        }

        Object data = switch (platform) {
            case "leetcode" -> codingStats.getLeetcode();
            case "codechef" -> codingStats.getCodechef();
            case "codeforces" -> codingStats.getCodeforces();
            case "geeksforgeeks" -> codingStats.getGeeksforgeeks();
            case "interviewbit" -> codingStats.getInterviewbit();
            case "spoj" -> codingStats.getSpoj();
            default -> null;
        };

        if(data == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Invalid platform"
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "platform", platform,
                        "data", data
                )
        );
    }

    public ResponseEntity<?> getAllPlatformData(String userId) {

        CodingStats codingStats = getCodingStats(userId);

        if(codingStats == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Coding stats not found"
                    )
            );
        }
        AllPlatformsDataDTO allPlatformsDataDTO = getAllPlatformsDataDTO(codingStats);


        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "data", allPlatformsDataDTO
                )
        );
    }

    @Nonnull
    private static AllPlatformsDataDTO getAllPlatformsDataDTO(CodingStats codingStats) {
        AllPlatformsDataDTO allPlatformsDataDTO = new AllPlatformsDataDTO();
        allPlatformsDataDTO.setProblemsSolved(codingStats.getProblemsSolved());
        allPlatformsDataDTO.setLeetcode(codingStats.getLeetcode());
        allPlatformsDataDTO.setCodechef(codingStats.getCodechef());
        allPlatformsDataDTO.setCodeforces(codingStats.getCodeforces());
        allPlatformsDataDTO.setGeeksforgeeks(codingStats.getGeeksforgeeks());
        allPlatformsDataDTO.setInterviewbit(codingStats.getInterviewbit());
        allPlatformsDataDTO.setSpoj(codingStats.getSpoj());
        return allPlatformsDataDTO;
    }
}
