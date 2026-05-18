package com.sathvik.CodingManager.service.auth;

import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Service
public class ResetPasswordService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public ResponseEntity<?> reset_Password(String password, String token) {
        User user= userRepository.findByResetPasswordTokenAndResetPasswordExpiresAtAfter(token,new Date());
        if(user==null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","Invalid or expired reset token"
                    )
            );
        }
        if(password.length()<6){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","password too short"
                    )
            );
        }
        if(bCryptPasswordEncoder.matches(password, user.getPassword())){
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "success",false,
                                "message","Old password not allowed"
                        )
                );
        }
        String newPassword=bCryptPasswordEncoder.encode(password);
        user.setPassword(newPassword);
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiresAt(null);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "success",true,
                "message","Password reset successfully"
        ));
    }
}
