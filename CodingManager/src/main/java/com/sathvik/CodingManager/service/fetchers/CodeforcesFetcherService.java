package com.sathvik.CodingManager.service.fetchers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sathvik.CodingManager.model.codeforces.CodeForces;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CodeforcesFetcherService {

    @Autowired
    private RestTemplate restTemplate;

    public CodeForces updatedStats(String username) {
        try {
            CodeForces codeForces = new CodeForces();
            codeForces.setUsername(username);
            ObjectMapper mapper = new ObjectMapper();
            String infoUrl = "https://codeforces.com/api/user.info?handles=" + username;

            String infoResponse =
                    restTemplate.getForObject(
                            infoUrl,
                            String.class
                    );
            JsonNode infoRoot = mapper.readTree(infoResponse);
            JsonNode user = infoRoot.path("result").get(0);
            codeForces.setRating(
                    user.path("rating").asInt()
            );
            codeForces.setMaxRating(
                    user.path("maxRating").asInt()
            );
            codeForces.setRank(
                    user.path("rank").asText()
            );
            codeForces.setMaxRank(
                    user.path("maxRank").asText()
            );
            String contestUrl = "https://codeforces.com/api/user.rating?handle=" + username;
            String contestResponse =
                    restTemplate.getForObject(
                            contestUrl,
                            String.class
                    );
            JsonNode contestRoot = mapper.readTree(contestResponse);
            JsonNode contests = contestRoot.path("result");
            codeForces.setNoOfContestAttended(
                    contests.size()
            );

            List<Integer> ratingHistory = new ArrayList<>();
            for(JsonNode contest : contests){
                int newRating = contest.path("newRating").asInt();
                ratingHistory.add(newRating);
            }
            codeForces.setRatingHistory(
                    ratingHistory
            );
            String statusUrl = "https://codeforces.com/api/user.status?handle=" + username;
            String statusResponse =
                    restTemplate.getForObject(
                            statusUrl,
                            String.class
                    );
            JsonNode statusRoot = mapper.readTree(statusResponse);
            JsonNode submissions = statusRoot.path("result");
            Set<String> solvedProblems = new HashSet<>();
            for(JsonNode submission : submissions){
                String verdict = submission.path("verdict").asText();
                if(verdict.equals("OK")){
                    JsonNode problem = submission.path("problem");
                    String contestId = problem.path("contestId").asText();
                    String index = problem.path("index").asText();
                    solvedProblems.add(contestId + index);
                }
            }
            codeForces.setProblemsSolved(
                    solvedProblems.size()
            );

            return codeForces;

        }
        catch (Exception e){

            e.printStackTrace();

            return new CodeForces();
        }
    }
}