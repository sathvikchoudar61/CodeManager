package com.sathvik.CodingManager.service.auth;

import com.sathvik.CodingManager.dto.auth.SignUpDTO;
import com.sathvik.CodingManager.model.CodingStats;
import com.sathvik.CodingManager.model.User;
import com.sathvik.CodingManager.model.codechef.CodeChef;
import com.sathvik.CodingManager.model.codeforces.CodeForces;
import com.sathvik.CodingManager.model.geeksforgeeks.GeeksForGeeks;
import com.sathvik.CodingManager.model.interviewbit.InterviewBit;
import com.sathvik.CodingManager.model.leetcode.LeetCode;
import com.sathvik.CodingManager.model.spoj.Spoj;
import com.sathvik.CodingManager.repository.CodingStatsRepository;
import com.sathvik.CodingManager.repository.UserRepository;
import com.sathvik.CodingManager.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Map;

@Service
public class SignUpService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CodingStatsRepository codingStatsRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    public ResponseEntity<?> signUpUser(SignUpDTO user) {
        if(user.getName()==null
                || user.getEmail()==null
                || user.getPassword()==null
                || user.getAge() == null
                || user.getUsername()==null
                || user.getGender()==null
        ){
            return ResponseEntity.badRequest().body(
                    Map.of(
                        "success",false,
                        "message","all fields required"
                    )
            );
        }
        if(!user.getEmail().matches("^[A-Za-z0-9._%+-]+@gmail\\.com$")){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","invalid email"
                    )
            );
        }

        if(user.getUsername().length()<6){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","Username too short"
                    )
            );
        }

        if(user.getPassword().length()<6){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","password too short"
                    )
            );
        }

        User existingUser = userRepository.findByEmail(user.getEmail());
        if(existingUser != null){
            if(existingUser.getIsVerified() == false){
                if(existingUser.getVerificationTokenExpiresAt() != null
                        &&
                        existingUser.getVerificationTokenExpiresAt()
                                .after(new Date())
                ){
                    return ResponseEntity.badRequest().body(
                            Map.of(
                                    "success",false,
                                    "message","user already exists verify the email to get access"
                            )
                    );
                }
            }
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","email already in use"
                    )
            );
        }
        if(userRepository.findByUsername(user.getUsername()) != null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success",false,
                            "message","username already in use"
                    )
            );
        }
        User addUser=new User();
        addUser.setUsername(user.getUsername());
        addUser.setName(user.getName());
        addUser.setEmail(user.getEmail());
        addUser.setGender(user.getGender());
        addUser.setAge(user.getAge());
        String password = bCryptPasswordEncoder.encode(user.getPassword());
        addUser.setPassword(password);
        addUser.setVerificationToken(
                String.valueOf(
                        100000 + secureRandom.nextInt(900000)
                )
        );
        addUser.setVerificationTokenExpiresAt(new Date(System.currentTimeMillis()+24 * 60 * 60 * 1000));
        addUser.setCreatedAt(new Date());
        User savedUser = userRepository.save(addUser);
        emailService.sendEmail(user.getEmail()
                ,"Verification Code"
                ,("Your Verification Code is: "+addUser.getVerificationToken()));

        CodingStats codingStats = new CodingStats();
        codingStats.setUserId(savedUser.getId());
        codingStats.setCodechef(new CodeChef());
        codingStats.setLeetcode(new LeetCode());
        codingStats.setCodeforces(new CodeForces());
        codingStats.setGeeksforgeeks(new GeeksForGeeks());
        codingStats.setInterviewbit(new InterviewBit());
        codingStats.setSpoj(new Spoj());
        if(user.getCodechefUsername()!=null){
            codingStats.getCodechef().setUsername(user.getCodechefUsername());
        }
        if(user.getLeetcodeUsername()!=null){
            codingStats.getLeetcode().setUsername(user.getLeetcodeUsername());
        }
        if(user.getGeeksforgeeksUsername()!=null){
            codingStats.getGeeksforgeeks().setUsername(user.getGeeksforgeeksUsername());
        }
        if(user.getSpojUsername()!=null){
            codingStats.getSpoj().setUsername(user.getSpojUsername());
        }
        if(user.getCodeforcesUsername()!=null){
            codingStats.getCodeforces().setUsername(user.getCodeforcesUsername());
        }
        if(user.getInterviewbitUsername()!=null){
            codingStats.getInterviewbit().setUsername(user.getInterviewbitUsername());
        }
        codingStatsRepository.save(codingStats);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "SignUp Successful"
                )
        );
    }
}
