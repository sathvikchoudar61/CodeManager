package com.sathvik.CodingManager.service.fetchers;

import com.sathvik.CodingManager.model.spoj.Spoj;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Service;

@Service
public class SpojFetcherService {

    public Spoj updatedStats(String username) {

        Spoj spoj = new Spoj();

        try {

            if (username == null || username.isBlank()) {
                return spoj;
            }

            WebDriverManager.chromedriver().setup();

            ChromeOptions options =
                    new ChromeOptions();

            options.addArguments("--headless=new");
            options.addArguments("--disable-gpu");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("--window-size=1920,1080");

            WebDriver driver =
                    new ChromeDriver(options);

            try {

                String url =
                        "https://www.spoj.com/users/" +
                                username +
                                "/";

                driver.get(url);

                Thread.sleep(8000);

                String text =
                        driver.findElement(
                                By.tagName("body")
                        ).getText();

                System.out.println(text);

                spoj.setUsername(username);

                String[] lines =
                        text.split("\n");

                for (int i = 0; i < lines.length; i++) {

                    String line =
                            lines[i].trim();

                    if (
                            line.contains("World Rank")
                                    ||
                                    line.contains("World rank")
                    ) {

                        spoj.setWorldRank(
                                extractNumber(line)
                        );
                    }

                    else if (
                            line.contains("Problems solved")
                    ) {

                        if (i + 1 < lines.length) {

                            spoj.setProblemsSolved(
                                    extractNumber(
                                            lines[i + 1]
                                    )
                            );
                        }
                    }

                    else if (
                            line.contains("Solutions submitted")
                    ) {

                        if (i + 1 < lines.length) {

                            spoj.setSolutionSubmitted(
                                    extractNumber(
                                            lines[i + 1]
                                    )
                            );
                        }
                    }
                }

            }

            finally {

                driver.quit();
            }

        }

        catch (Exception e) {

            e.printStackTrace();
        }

        return spoj;
    }

    private int extractNumber(
            String text
    ) {

        String number =
                text.replaceAll("[^0-9]", "");

        if (number.isEmpty()) {
            return 0;
        }

        return Integer.parseInt(number);
    }
}