package com.sathvik.CodingManager.service.auth;

import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.repository.UserRepository;
import com.sathvik.CodingManager.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LoginService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JWTUtil jwtUtil;

    public ResponseEntity<?> loginUser(String email, String password){
            User loginUser=userRepository.findByEmail(email);
            if(loginUser==null){
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "success", false,
                                "message", "User not found"
                        )
                );
            }
            if(!loginUser.getIsVerified()){
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "success", false,
                                "message", "Please verify your email"
                        )
                );
            }
            boolean matches = encoder.matches(password, loginUser.getPassword());

            if (!matches) {
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "success", false,
                                "message", "Wrong Password"
                        )
                );
            }

            String token = jwtUtil.generateToken(loginUser.getId());
            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Login Successful",
                            "token", token
                    )
            );
    }
}
