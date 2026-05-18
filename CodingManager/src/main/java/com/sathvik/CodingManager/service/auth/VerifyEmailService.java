package com.sathvik.CodingManager.service.auth;

import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.repository.UserRepository;
import com.sathvik.CodingManager.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Service
public class VerifyEmailService {
    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> verifyEmail(String code){
        User user= userRepository.findByVerificationTokenAndVerificationTokenExpiresAtAfter(code,new Date());
        if(user==null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","Invalid or Expired code"
                    )
            );
        }
        user.setIsVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        userRepository.save(user);
        return ResponseEntity.ok(
                Map.of(
                        "success",true,
                        "message","Email Verified"
                )
        );
    }
}
