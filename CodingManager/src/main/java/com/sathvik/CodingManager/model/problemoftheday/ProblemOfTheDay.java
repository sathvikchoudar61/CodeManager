package com.sathvik.CodingManager.model.problemoftheday;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "problem_of_the_day")
public class ProblemOfTheDay {

    @Id
    private String id;

    private String leetcodeTitle;
    private String leetcodeUrl;

    private String geeksForGeeksTitle;
    private String geeksForGeeksUrl;
}