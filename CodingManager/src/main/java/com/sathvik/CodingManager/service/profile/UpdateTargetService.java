package com.sathvik.CodingManager.service.profile;

import com.sathvik.CodingManager.dto.profile.UpdateTargetDTO;
import com.sathvik.CodingManager.model.CodingStats;
import com.sathvik.CodingManager.repository.CodingStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UpdateTargetService {
    @Autowired
    private CodingStatsRepository  codingStatsRepository;
    public ResponseEntity<?> updateTargetData(String userId, UpdateTargetDTO data) {
        CodingStats codingStats = codingStatsRepository.findById(userId).orElse(null);
        if(codingStats == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Coding stats not found"
                    )
            );
        }
        if (data == null || data.getTargetProblems() == null) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Target problems data not found"
                    )
            );
        }
        if(data.getTargetProblems()<codingStats.getTargetProblems()){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Target problems count less than present"
                    )
            );
        }
        if(data.getTargetProblems()<codingStats.getProblemsSolved()){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Target problems count less than solved problems"
                    )
            );
        }
        codingStats.setTargetProblems(data.getTargetProblems());
        codingStatsRepository.save(codingStats);
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Target problems count updated"
                )
        );
    }
}
