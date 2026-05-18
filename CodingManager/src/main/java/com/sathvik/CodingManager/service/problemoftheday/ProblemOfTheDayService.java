package com.sathvik.CodingManager.service.problemoftheday;

import com.sathvik.CodingManager.model.problemoftheday.ProblemOfTheDay;
import com.sathvik.CodingManager.repository.ProblemOfTheDayRepository;
import com.sathvik.CodingManager.service.fetchers.GFGProblemOfTheDayFetcherService;
import com.sathvik.CodingManager.service.fetchers.LeetcodeProblemOfTheDayFetcherService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class ProblemOfTheDayService {

    private static final Logger logger =
            LoggerFactory.getLogger(
                    ProblemOfTheDayService.class
            );

    @Autowired
    private ProblemOfTheDayRepository problemOfTheDayRepository;

    @Autowired
    private LeetcodeProblemOfTheDayFetcherService
            leetcodeProblemOfTheDayFetcherService;

    @Autowired
    private GFGProblemOfTheDayFetcherService
            gfgProblemOfTheDayFetcherService;

    public ResponseEntity<?> getProblems() {

        ProblemOfTheDay problemOfTheDay =
                problemOfTheDayRepository
                        .findById("main")
                        .orElse(null);

        if (problemOfTheDay == null) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Problem Of The Day not found"
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "data", problemOfTheDay
                )
        );
    }

    @PostConstruct
    public void init() {
        updateProblemsDaily();
    }

    @Async
    @Scheduled(
            cron = "0 0 3 * * *",
            zone = "Asia/Kolkata"
    )
    public void updateProblemsDaily() {

        try {

            logger.info(
                    "Starting Problem Of The Day Update..."
            );

            CompletableFuture<Map<String, String>>
                    leetcodeFuture =
                    leetcodeProblemOfTheDayFetcherService
                            .fetchProblem();

            CompletableFuture<Map<String, String>>
                    gfgFuture =
                    gfgProblemOfTheDayFetcherService
                            .fetchProblem();

            CompletableFuture.allOf(
                    leetcodeFuture,
                    gfgFuture
            ).join();

            Map<String, String> leetcode =
                    leetcodeFuture.get();

            Map<String, String> gfg =
                    gfgFuture.get();

            ProblemOfTheDay problem =
                    new ProblemOfTheDay();

            problem.setId("main");

            problem.setLeetcodeTitle(
                    leetcode.get("title")
            );

            problem.setLeetcodeUrl(
                    leetcode.get("url")
            );

            problem.setGeeksForGeeksTitle(
                    gfg.get("title")
            );

            problem.setGeeksForGeeksUrl(
                    gfg.get("url")
            );

            problemOfTheDayRepository.save(problem);

            logger.info(
                    "Problem Of The Day Updated Successfully"
            );

        } catch (Exception e) {

            logger.error(
                    "Error Updating Problem Of The Day",
                    e
            );
        }
    }
}