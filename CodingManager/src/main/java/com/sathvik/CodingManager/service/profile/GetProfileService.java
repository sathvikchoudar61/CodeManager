package com.sathvik.CodingManager.service.profile;

import com.sathvik.CodingManager.dto.profile.GetProfileDTO;
import com.sathvik.CodingManager.model.CodingStats;
import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.repository.CodingStatsRepository;
import com.sathvik.CodingManager.repository.UserRepository;
import jakarta.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
public class GetProfileService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CodingStatsRepository codingStatsRepository;

    public ResponseEntity<?> getProfileData(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if(user == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","User not found"
                    )
            );
        }
        CodingStats codingStats = codingStatsRepository.findByUserId(user.getId());
        GetProfileDTO profileResponseDTO = getProfileResponseDTO(user, codingStats);
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "data", profileResponseDTO
                )
        );
    }

    @Nonnull
    private GetProfileDTO getProfileResponseDTO(User user, CodingStats codingStats) {
        GetProfileDTO profileDTO = new GetProfileDTO();
        profileDTO.setName(user.getName());
        profileDTO.setAge(user.getAge());
        profileDTO.setGender(user.getGender());
        profileDTO.setUsername(user.getUsername());
        profileDTO.setEmail(user.getEmail());
        profileDTO.setTargetProblems(codingStats.getTargetProblems());
        profileDTO.setCodechefUsername(codingStats.getCodechef().getUsername());
        profileDTO.setCodeforcesUsername(codingStats.getCodeforces().getUsername());
        profileDTO.setLeetcodeUsername(codingStats.getLeetcode().getUsername());
        profileDTO.setGeeksforgeeksUsername(codingStats.getGeeksforgeeks().getUsername());
        profileDTO.setInterviewbitUsername(codingStats.getInterviewbit().getUsername());
        profileDTO.setSpojUsername(codingStats.getSpoj().getUsername());
        return profileDTO;
    }
}
