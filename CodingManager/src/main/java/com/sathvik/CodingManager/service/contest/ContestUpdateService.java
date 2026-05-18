package com.sathvik.CodingManager.service.contest;

import com.sathvik.CodingManager.model.Contest;
import com.sathvik.CodingManager.repository.ContestRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContestUpdateService {

    private final ContestRepository contestRepository;

    private final RestTemplate restTemplate;

    @PostConstruct
    public void init() {
        updateContests();
    }

    @Async
    @Scheduled(cron = "0 0 */6 * * *")
    public CompletableFuture<Void> updateContests() {

        try {

            log.info("Fetching contests...");

            String url =
                    "https://competeapi.vercel.app/contests/upcoming/";

            ResponseEntity<List<Contest>> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<List<Contest>>() {}
                    );

            List<Contest> contests = response.getBody();

            if (contests != null && !contests.isEmpty()) {

                contestRepository.deleteAll();

                contestRepository.saveAll(contests);

                log.info("Fetched {} contests", contests.size());

                log.info("Contests updated successfully");

            } else {

                log.warn("No contests received from API");
            }

        } catch (Exception e) {

            log.error("Error updating contests", e);
        }

        return CompletableFuture.completedFuture(null);
    }
}