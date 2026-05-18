package com.sathvik.CodingManager.service.fetchers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class LeetcodeProblemOfTheDayFetcherService {

    @Autowired
    private RestTemplate restTemplate;

    @Async
    public CompletableFuture<Map<String, String>>
    fetchProblem() {

        String url =
                "https://leetcode.com/graphql";

        String body = """
            {
              "query": "query questionOfToday { activeDailyCodingChallengeQuestion { question { title titleSlug difficulty } } }"
            }
            """;

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        HttpEntity<String> entity =
                new HttpEntity<>(
                        body,
                        headers
                );

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        url,
                        entity,
                        Map.class
                );

        Map data = response.getBody();

        Map dataMap =
                (Map) data.get("data");

        Map active =
                (Map) dataMap.get(
                        "activeDailyCodingChallengeQuestion"
                );

        Map question =
                (Map) active.get("question");

        String title =
                question.get("title")
                        .toString();

        String slug =
                question.get("titleSlug")
                        .toString();

        String difficulty =
                question.get("difficulty")
                        .toString();

        return CompletableFuture.completedFuture(
                Map.of(
                        "title", title,
                        "url",
                        "https://leetcode.com/problems/"
                                + slug,
                        "difficulty", difficulty
                )
        );
    }
}