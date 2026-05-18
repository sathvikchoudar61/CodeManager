package com.sathvik.CodingManager.service.fetchers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sathvik.CodingManager.model.leetcode.LeetCode;
import com.sathvik.CodingManager.model.leetcode.ProblemList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LeetcodeFetcherService {

    @Autowired
    private RestTemplate restTemplate;

    public LeetCode updatedStats(String username) {

        try {

            String url = "https://leetcode.com/graphql";

            String query = """
                query getUserProfile($username: String!) {

                  matchedUser(username: $username) {

                    username

                    profile {
                      ranking
                    }

                    submitStats {
                      acSubmissionNum {
                        difficulty
                        count
                      }
                    }

                    submissionCalendar
                  }

                  userContestRanking(username: $username) {
                    rating
                    attendedContestsCount
                    topPercentage
                  }

                  recentSubmissionList(username: $username) {
                    title
                    titleSlug
                    statusDisplay
                    lang
                  }
                }
                """;

            Map<String, Object> variables = Map.of(
                    "username", username
            );

            Map<String, Object> body = Map.of(
                    "query", query,
                    "variables", variables
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            url,
                            request,
                            String.class
                    );

            String responseBody = response.getBody();

            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(responseBody);

            LeetCode leetCode = new LeetCode();

            leetCode.setUsername(username);

            /*
             *
             * PROBLEM COUNTS
             *
             */

            JsonNode submissions = root
                    .path("data")
                    .path("matchedUser")
                    .path("submitStats")
                    .path("acSubmissionNum");

            int easy = 0;
            int medium = 0;
            int hard = 0;
            int total = 0;

            for(JsonNode node : submissions){

                String difficulty =
                        node.path("difficulty").asText();

                int count =
                        node.path("count").asInt();

                switch (difficulty){

                    case "Easy":
                        easy = count;
                        break;

                    case "Medium":
                        medium = count;
                        break;

                    case "Hard":
                        hard = count;
                        break;

                    case "All":
                        total = count;
                        break;
                }
            }

            leetCode.setEasySolved(easy);
            leetCode.setMediumSolved(medium);
            leetCode.setHardSolved(hard);
            leetCode.setProblemsSolved(total);

            /*
             *
             * RANK
             *
             */

            int rank = root
                    .path("data")
                    .path("matchedUser")
                    .path("profile")
                    .path("ranking")
                    .asInt();

            leetCode.setRank(rank);

            /*
             *
             * CONTEST DATA
             *
             */

            JsonNode contestData = root
                    .path("data")
                    .path("userContestRanking");

            if(!contestData.isMissingNode()
                    && !contestData.isNull()){

                leetCode.setContestRating(
                        (int) contestData.path("rating").asDouble()
                );

                leetCode.setNoOfContestAttended(
                        contestData.path("attendedContestsCount").asInt()
                );

                leetCode.setTopPercent(
                        (float) contestData.path("topPercentage").asDouble()
                );
            }

            /*
             *
             * RECENT PROBLEMS
             *
             */

            JsonNode recentSubmissions = root
                    .path("data")
                    .path("recentSubmissionList");

            List<ProblemList> problemLists =
                    new ArrayList<>();

            for(JsonNode node : recentSubmissions){

                ProblemList problem = new ProblemList();

                String title =
                        node.path("title").asText();

                String slug =
                        node.path("titleSlug").asText();

                String status =
                        node.path("statusDisplay").asText();

                problem.setTitle(title);

                problem.setSolved(
                        status.equalsIgnoreCase("Accepted")
                );

                problem.setLeetcodeUrl(
                        "https://leetcode.com/problems/" + slug
                );

                problemLists.add(problem);
            }

            leetCode.setProblemList(problemLists);

            return leetCode;

        }
        catch (Exception e){

            e.printStackTrace();

            return new LeetCode();
        }
    }
}