package com.sathvik.CodingManager.service.platform;

import com.sathvik.CodingManager.dto.profile.UpdateProfileDTO;
import com.sathvik.CodingManager.model.CodingStats;
import com.sathvik.CodingManager.model.codechef.CodeChef;
import com.sathvik.CodingManager.model.codeforces.CodeForces;
import com.sathvik.CodingManager.model.geeksforgeeks.GeeksForGeeks;
import com.sathvik.CodingManager.model.interviewbit.InterviewBit;
import com.sathvik.CodingManager.model.leetcode.LeetCode;
import com.sathvik.CodingManager.model.spoj.Spoj;
import com.sathvik.CodingManager.repository.CodingStatsRepository;
import com.sathvik.CodingManager.service.fetchers.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PlatformUpdateService {
    @Autowired
    private CodingStatsRepository codingStatsRepository;

    @Autowired
    private LeetcodeFetcherService leetcodeFetcherService;

    @Autowired
    private CodechefFetcherService codechefFetcherService;

    @Autowired
    private CodeforcesFetcherService codeforcesFetcherService;

    @Autowired
    private GeeksforgeeksFetcherService  geeksforgeeksFetcherService;

    @Autowired
    private SpojFetcherService spojFetcherService;

    @Autowired
    private InterviewBitFetcherService interviewBitFetcherService;

    private CodingStats getCodingStats(String userId) {
        return codingStatsRepository.findByUserId(userId);
    }

    public ResponseEntity<?> updateStats(String userId, String platform) {
        CodingStats codingStats = getCodingStats(userId);

        if(codingStats == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Coding stats not found"
                    )
            );
        }

        switch (platform) {

            case "leetcode":
                updateLeetcodeStats(codingStats);
                break;

            case "codechef":
                updateCodechefStats(codingStats);
                break;

            case "codeforces":
                updateCodeforcesStats(codingStats);
                break;

            case "geeksforgeeks":
                updateGeeksforgeeksStats(codingStats);
                break;

            case "interviewbit":
                updateInterviewBitStats(codingStats);
                break;

            case "spoj":
                updateSpojStats(codingStats);
                break;

            default:
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "success", false,
                                "message", "Invalid platform"
                        )
                );
        }
        codingStats.setProblemsSolved(updateTotalProblemsSolved(codingStats));
        codingStatsRepository.save(codingStats);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", platform + " stats updated"
                )
        );
    }

    public ResponseEntity<?> updateAllStats(String userId) {
        CodingStats codingStats = getCodingStats(userId);
        if(codingStats == null){
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Coding stats not found"
                    )
            );
        }
        updateLeetcodeStats(codingStats);
        updateCodechefStats(codingStats);
        updateCodeforcesStats(codingStats);
        updateGeeksforgeeksStats(codingStats);
        updateInterviewBitStats(codingStats);
        updateSpojStats(codingStats);
        codingStats.setProblemsSolved(updateTotalProblemsSolved(codingStats));
        codingStatsRepository.save(codingStats);
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message","all  stats updated"
                )
        );
    }


    @Async
    public void asyncUpdatePlatform(CodingStats codingStats) {
        try {
            updateLeetcodeStats(codingStats);
            updateCodechefStats(codingStats);
            updateCodeforcesStats(codingStats);
            updateGeeksforgeeksStats(codingStats);
            updateInterviewBitStats(codingStats);
            updateSpojStats(codingStats);
            codingStats.setProblemsSolved(updateTotalProblemsSolved(codingStats));
            codingStatsRepository.save(codingStats);
            System.out.println(
                    "Updated: " +
                            codingStats.getUserId()
            );
        }
        catch (Exception e){
            System.out.println(
                    "Failed: " + codingStats.getUserId()
            );
        }
    }

    private void updateCodechefStats(CodingStats codingStats) {
        CodeChef codeChef = codechefFetcherService.updatedStats(
                codingStats.getCodechef().getUsername());
        codingStats.setCodechef(codeChef);
    }

    private void updateLeetcodeStats(CodingStats  codingStats) {
        LeetCode leetCode = leetcodeFetcherService.updatedStats(
                codingStats.getLeetcode().getUsername());
        codingStats.setLeetcode(leetCode);
    }

    private void updateCodeforcesStats(CodingStats codingStats) {
        CodeForces codeForces = codeforcesFetcherService.updatedStats(
                codingStats.getCodeforces().getUsername());
        codingStats.setCodeforces(codeForces);
    }

    private void updateGeeksforgeeksStats(CodingStats codingStats) {
        GeeksForGeeks geeksForGeeks=geeksforgeeksFetcherService.updatedStats(
                codingStats.getGeeksforgeeks().getUsername());
        codingStats.setGeeksforgeeks(geeksForGeeks);
    }

    private void updateInterviewBitStats(CodingStats codingStats) {
        InterviewBit interviewBit=interviewBitFetcherService.updatedStats(
                codingStats.getInterviewbit().getUsername());
        codingStats.setInterviewbit(interviewBit);
    }

    private void updateSpojStats(CodingStats codingStats) {
        Spoj spoj=spojFetcherService.updatedStats(
                codingStats.getSpoj().getUsername()
        );
        codingStats.setSpoj(spoj);
    }

    private int updateTotalProblemsSolved(CodingStats codingStats) {
        int total=0;
        total+=codingStats.getLeetcode().getProblemsSolved();
        total+=codingStats.getCodeforces().getProblemsSolved();
        total+=codingStats.getCodechef().getProblemsSolved();
        total+=codingStats.getGeeksforgeeks().getProblemsSolved();
        total+=codingStats.getInterviewbit().getProblemsSolved();
        total+=codingStats.getSpoj().getProblemsSolved();
        return total;
    }

}
