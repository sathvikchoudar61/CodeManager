package com.sathvik.CodingManager.service.profile;
import com.sathvik.CodingManager.dto.profile.UpdateEmailDTO;
import com.sathvik.CodingManager.model.User;

import com.sathvik.CodingManager.repository.UserRepository;
import com.sathvik.CodingManager.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Map;

@Service
public class UpdateEmailService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    public ResponseEntity<?> updateEmailData(String userId, UpdateEmailDTO data) {
        if(data.getEmail() == null ||
                !data.getEmail()
                        .matches("^[A-Za-z0-9._%+-]+@gmail\\.com$")) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Invalid email"
                    )
            );
        }

        User user = userRepository.findById(userId).orElse(null);
        if(user == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","User not found"
                    )
            );
        }
        if(user.getEmail().equals(data.getEmail())){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "New email cannot be same as current email"
                    )
            );
        }

        User existingUser = userRepository.findByEmail(data.getEmail());
        if(existingUser != null &&
                !existingUser.getId().equals(userId)) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Email already in use"
                    )
            );
        }
        user.setPendingEmail(data.getEmail());
        user.setEmailUpdateToken(
                String.valueOf(
                        100000 + secureRandom.nextInt(900000)
                )
        );
        user.setEmailUpdateTokenExpiresAt(new Date(System.currentTimeMillis()+24 * 60 * 60 * 1000));
        userRepository.save(user);
        emailService.sendEmail(user.getPendingEmail()
                ,"Verification Code"
                ,("Your Verification Code is: "+user.getEmailUpdateToken()));
        return ResponseEntity.ok(
                Map.of(
                        "success",true,
                        "message","Verification email sent successfully"
                )
        );
    }
}
