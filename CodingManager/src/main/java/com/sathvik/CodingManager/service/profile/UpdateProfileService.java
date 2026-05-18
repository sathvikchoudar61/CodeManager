package com.sathvik.CodingManager.service.profile;
import com.sathvik.CodingManager.dto.profile.UpdateProfileDTO;
import com.sathvik.CodingManager.model.CodingStats;
import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.repository.CodingStatsRepository;
import com.sathvik.CodingManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UpdateProfileService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CodingStatsRepository codingStatsRepository;

    public ResponseEntity<?> updateProfileData(String userId, UpdateProfileDTO profileData) {
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
        if(codingStats == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Coding stats not found"
                    )
            );
        }
        if(profileData.getName() != null){
            user.setName(profileData.getName());
        }
        if(profileData.getAge()!=null){
            user.setAge(profileData.getAge());
        }
        if(profileData.getGender()!=null){
            user.setGender(profileData.getGender());
        }
        if (profileData.getLeetcodeUsername() != null) {
            codingStats.getLeetcode().setUsername(profileData.getLeetcodeUsername());
        }
        if(profileData.getCodechefUsername()!=null){
            codingStats.getCodechef().setUsername(profileData.getCodechefUsername());
        }
        if(profileData.getCodeforcesUsername()!=null){
            codingStats.getCodeforces().setUsername(profileData.getCodeforcesUsername());
        }
        if (profileData.getGeeksforgeeksUsername() != null) {
            codingStats.getGeeksforgeeks().setUsername(profileData.getGeeksforgeeksUsername());
        }
        if (profileData.getInterviewbitUsername() != null){
            codingStats.getInterviewbit().setUsername(profileData.getInterviewbitUsername());
        }
        if(profileData.getSpojUsername()!=null){
            codingStats.getSpoj().setUsername(profileData.getSpojUsername());
        }
        codingStatsRepository.save(codingStats);
        userRepository.save(user);
        return ResponseEntity.ok(
                Map.of(
                        "success",true,
                        "message", "Profile updated successfully",
                        "updatedData",profileData
                )
        );
    }

}
