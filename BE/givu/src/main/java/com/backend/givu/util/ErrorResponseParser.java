package com.backend.givu.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class ErrorResponseParser {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String extractMessage(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            return root.path("responseMessage").asText(); // ✅ 핵심
        } catch (Exception e) {
            return "요청 처리 중 알 수 없는 오류가 발생했습니다.";
        }
    }

    public String extractCode(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            return root.path("responseCode").asText();
        } catch (Exception e) {
            return "ERROR";
        }
    }
}