package com.sathvik.CodingManager.dto.compiler;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RunRequestDTO {
    private String language;
    private String code;
    private String input;

}
