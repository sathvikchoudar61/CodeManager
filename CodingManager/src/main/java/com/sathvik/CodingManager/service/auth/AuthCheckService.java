package com.sathvik.CodingManager.service.auth;

import com.sathvik.CodingManager.dto.auth.AuthcheckDTO;
import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.repository.UserRepository;
import com.sathvik.CodingManager.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Service
public class AuthCheckService {

    @Autowired
    private UserRepository userRepository;


    public ResponseEntity<?> checkAuth(String userId){

        User user = userRepository.findById(userId).orElse(null);

        if(user == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "User not found"
                    )
            );
        }
        AuthcheckDTO  authcheckDTO = new AuthcheckDTO();
        authcheckDTO.setId(user.getId());
        authcheckDTO.setUsername(user.getUsername());
        authcheckDTO.setEmail(user.getEmail());
        authcheckDTO.setName(user.getName());
        authcheckDTO.setAge(user.getAge());
        authcheckDTO.setGender(user.getGender());
        authcheckDTO.setRole(user.getRole());
        authcheckDTO.setCreatedAt(user.getCreatedAt());
        authcheckDTO.setIsVerified(user.getIsVerified());

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "user", authcheckDTO
                )
        );
    }
}
