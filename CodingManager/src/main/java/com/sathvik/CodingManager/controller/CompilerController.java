package com.sathvik.CodingManager.controller;


import com.sathvik.CodingManager.dto.compiler.RunRequestDTO;
import com.sathvik.CodingManager.service.compiler.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/compiler")
public class CompilerController {

    @Autowired
    private JavaCompiler javaCompiler;
    @Autowired
    private PythonCompiler pythonCompiler;
    @Autowired
    private CCompiler cCompiler;
    @Autowired
    private CPPCompiler cppCompiler;
    @Autowired
    private JavascriptCompiler javascriptCompiler;

    @PostMapping
    public ResponseEntity<?> compileJava(@RequestBody RunRequestDTO data) {
        if (data.getLanguage() == null) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "language is required"
                    )
            );
        }
        switch (data.getLanguage().toLowerCase()) {

            case "java":
                return javaCompiler.compile(data);

            case "python":
                return pythonCompiler.compile(data);
            case "c":
                return cCompiler.compile(data);
            case "cpp":
                return cppCompiler.compile(data);
            case "javascript":
                return javascriptCompiler.compile(data);

            default:
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "success", false,
                                "message", "language not supported"
                        )
                );
        }
    }

}
