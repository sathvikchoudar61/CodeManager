package com.sathvik.CodingManager.service.profile;

import com.sathvik.CodingManager.dto.profile.UpdateUsernameDTO;
import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UpdateUsernameService {
    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> updateUsernameData(String userId, UpdateUsernameDTO data) {
        User user = userRepository.findById(userId).orElse(null);
        if(user == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","User not found"
                    )
            );
        }

        User existingUser = userRepository.findByUsername(data.getUsername());
        if (existingUser != null && !existingUser.getId().equals(userId)) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Username is already in use"
                    )
            );
        }
        if(data.getUsername().length()<6){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","Username is too short"
                    )
            );
        }
        user.setUsername(data.getUsername());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "success",true,
                "message","Username is updated"
        ));
    }
}
