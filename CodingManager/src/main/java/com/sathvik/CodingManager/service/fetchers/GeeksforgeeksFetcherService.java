package com.sathvik.CodingManager.service.fetchers;

import com.sathvik.CodingManager.model.geeksforgeeks.GeeksForGeeks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GeeksforgeeksFetcherService {

    @Autowired
    private RestTemplate restTemplate;

    public GeeksForGeeks updatedStats(String username) {

        try {

            GeeksForGeeks gfg =
                    new GeeksForGeeks();

            gfg.setUsername(username);

            fetchProblemStats(username, gfg);

            fetchProfileStats(username, gfg);

            return gfg;
        }

        catch (Exception e) {

            e.printStackTrace();

            return new GeeksForGeeks();
        }
    }

    private void fetchProblemStats(
            String username,
            GeeksForGeeks gfg
    ) {

        try {

            String url =
                    "https://gfg-stats.tashif.codes/" +
                            username;

            ResponseEntity<Map> response =
                    restTemplate.getForEntity(
                            url,
                            Map.class
                    );

            Map<String, Object> body =
                    response.getBody();

            if (body == null) {
                return;
            }

            gfg.setProblemsSolved(
                    parse(body.get("totalProblemsSolved"))
            );

            gfg.setSchoolProblemsSolved(
                    parse(body.get("School"))
            );

            gfg.setBasicProblemsSolved(
                    parse(body.get("Basic"))
            );

            gfg.setEasyProblemsSolved(
                    parse(body.get("Easy"))
            );

            gfg.setMediumProblemsSolved(
                    parse(body.get("Medium"))
            );

            gfg.setHardProblemsSolved(
                    parse(body.get("Hard"))
            );

        }

        catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void fetchProfileStats(
            String username,
            GeeksForGeeks gfg
    ) {

        try {

            String url =
                    "https://gfg-stats.tashif.codes/" +
                            username +
                            "/profile";

            ResponseEntity<Map> response =
                    restTemplate.getForEntity(
                            url,
                            Map.class
                    );

            Map<String, Object> body =
                    response.getBody();

            if (body == null) {
                return;
            }

            int streak =
                    parse(body.get("currentStreak"));

            gfg.setScore(
                    parse(body.get("codingScore"))
            );

            gfg.setPOTDStreak(streak);

        }

        catch (Exception e) {
            e.printStackTrace();
        }
    }

    private int parse(Object value) {

        if (value == null) {
            return 0;
        }

        try {

            return Integer.parseInt(
                    value.toString()
            );

        }

        catch (Exception e) {

            return 0;
        }
    }
}