package com.sathvik.CodingManager.service.fetchers;

import com.sathvik.CodingManager.model.codechef.CodeChef;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CodechefFetcherService {

    public CodeChef updatedStats(String username) {

        try {

            String url =
                    "https://www.codechef.com/users/" + username;

            Document document = Jsoup
                    .connect(url)
                    .userAgent("Mozilla/5.0")
                    .get();

            String html = document.html();

            CodeChef codeChef = new CodeChef();

            codeChef.setUsername(username);

            Pattern ratingPattern =
                    Pattern.compile("rating-number\">\\s*(\\d+)");

            Matcher ratingMatcher =
                    ratingPattern.matcher(html);

            if(ratingMatcher.find()) {

                codeChef.setRating(
                        Integer.parseInt(
                                ratingMatcher.group(1)
                        )
                );
            }

            Pattern starsPattern =
                    Pattern.compile("(\\d)★");

            Matcher starsMatcher =
                    starsPattern.matcher(html);

            if(starsMatcher.find()) {

                codeChef.setStars(
                        Integer.parseInt(
                                starsMatcher.group(1)
                        )
                );
            }

            Pattern globalRankPattern =
                    Pattern.compile(
                            "Global Rank:</small>&nbsp;&nbsp;&nbsp;<strong class=\"global-rank\">(\\d+)</strong>"
                    );

            Matcher globalMatcher =
                    globalRankPattern.matcher(html);

            if(globalMatcher.find()) {

                codeChef.setGlobalRank(
                        Integer.parseInt(
                                globalMatcher.group(1)
                        )
                );
            }


            Pattern contestPattern =
                    Pattern.compile(
                            "No\\. of Contests Participated: <b>(\\d+)</b>"
                    );

            Matcher contestMatcher =
                    contestPattern.matcher(html);

            if(contestMatcher.find()) {

                codeChef.setNoOfContestAttended(
                        Integer.parseInt(
                                contestMatcher.group(1)
                        )
                );
            }

            Pattern countryPattern =
                    Pattern.compile(
                            "user-country-name\">(.*?)</span>"
                    );

            Matcher countryNameMatcher =
                    countryPattern.matcher(html);

            if(countryNameMatcher.find()) {

                codeChef.setCountryName(
                        countryNameMatcher.group(1).trim()
                );
            }

            Pattern historyPattern =
                    Pattern.compile("\"rating\":\"(\\d+)\"");

            Matcher historyMatcher =
                    historyPattern.matcher(html);

            List<Integer> history =
                    new ArrayList<>();

            int highestRating = 0;

            while(historyMatcher.find()) {

                int rating =
                        Integer.parseInt(
                                historyMatcher.group(1)
                        );

                history.add(rating);

                if(rating > highestRating) {
                    highestRating = rating;
                }
            }

            codeChef.setRatingHistory(history);

            codeChef.setHighestRating(highestRating);

            Pattern problemsSolvedPattern =
                    Pattern.compile(
                            "Total Problems Solved:\\s*(\\d+)"
                    );

            Matcher problemsSolvedMatcher =
                    problemsSolvedPattern.matcher(html);

            if(problemsSolvedMatcher.find()) {

                codeChef.setProblemsSolved(
                        Integer.parseInt(
                                problemsSolvedMatcher.group(1)
                        )
                );
            }

            return codeChef;

        }
        catch (Exception e) {

            e.printStackTrace();

            return new CodeChef();
        }
    }
}