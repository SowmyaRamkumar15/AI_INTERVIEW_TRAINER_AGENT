package com.aiplacement.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    // --- IAM token endpoint (always this URL, not region-specific) ---
    private static final String IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token";

    // --- watsonx.ai generation endpoint (us-south is default; change if your instance is in another region) ---
    // Format: https://<region>.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29
    private static final String WX_GENERATION_URL =
            "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";

    @Value("${ibm.watsonx.api-key:}")
    private String apiKey;

    @Value("${ibm.watsonx.model-id:ibm/granite-13b-chat-v2}")
    private String modelId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ---------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------

    public List<String> generateQuestions(String role, String experience, int count) {
        if (role == null) role = "Software Engineer";

        if (isConfigured()) {
            try {
                String iamToken = fetchIamToken();
                String prompt = buildQuestionsPrompt(role, experience, count);
                String rawText = callWatsonxGeneration(iamToken, prompt);
                List<String> parsed = parseQuestions(rawText, count);
                if (!parsed.isEmpty()) return parsed;
            } catch (Exception e) {
                System.err.println("[AIService] generateQuestions failed, using fallback. Cause: " + e.getMessage());
            }
        } else {
            System.out.println("[AIService] Watson credentials not configured (ibm.watsonx.api-key). Using mock questions.");
        }

        // Fallback mock questions
        return Arrays.asList(
                "Can you walk me through your experience as a " + role + "?",
                "Describe a challenging problem you solved recently and how you approached it.",
                "How do you stay current with new technologies in your field?"
        );
    }

    public String evaluateAnswer(String question, String answer) {
        if (isConfigured()) {
            try {
                String iamToken = fetchIamToken();
                String prompt = buildEvaluationPrompt(question, answer);
                return callWatsonxGeneration(iamToken, prompt);
            } catch (Exception e) {
                System.err.println("[AIService] evaluateAnswer failed, using fallback. Cause: " + e.getMessage());
            }
        }
        return "Good answer! To improve, consider adding specific metrics about the outcomes you achieved.";
    }

    // ---------------------------------------------------------------
    // Step 1: Exchange IBM Cloud API key for a Bearer IAM token
    // ---------------------------------------------------------------

    private String fetchIamToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        // No Authorization header needed for IAM token exchange
        String body = "grant_type=urn%3Aibm%3Aparams%3Aoauth%3Agrant-type%3Aapikey&apikey=" + apiKey;

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    IAM_TOKEN_URL, HttpMethod.POST, request, JsonNode.class);

            JsonNode responseBody = response.getBody();
            if (responseBody == null || !responseBody.has("access_token")) {
                throw new RuntimeException("IAM token response missing 'access_token'. Full response: " + responseBody);
            }
            return responseBody.get("access_token").asText();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            // Log the actual HTTP error body (not null!) for proper diagnostics
            String errorBody = e.getResponseBodyAsString();
            throw new RuntimeException("IAM token request failed [" + e.getStatusCode() + "]: " + errorBody, e);
        }
    }

    // ---------------------------------------------------------------
    // Step 2: Call the watsonx.ai text generation endpoint
    // ---------------------------------------------------------------

    private String callWatsonxGeneration(String iamToken, String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(iamToken);   // "Authorization: Bearer <token>"

        Map<String, Object> requestBody = Map.of(
                "model_id", modelId,
                // project_id not required for embed/REST calls — IAM token is sufficient
                "input", prompt,
                "parameters", Map.of(
                        "decoding_method", "greedy",
                        "max_new_tokens", 500,
                        "min_new_tokens", 50,
                        "stop_sequences", List.of("\n\n")
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    WX_GENERATION_URL, HttpMethod.POST, request, JsonNode.class);

            JsonNode body = response.getBody();
            if (body == null) throw new RuntimeException("watsonx generation API returned null body");

            // Response shape: { "results": [ { "generated_text": "..." } ] }
            JsonNode results = body.path("results");
            if (results.isArray() && results.size() > 0) {
                return results.get(0).path("generated_text").asText("");
            }
            throw new RuntimeException("Unexpected watsonx response shape: " + body);

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            // Captures real error body (avoids the 'null' problem with generic Exception catch)
            String errorBody = e.getResponseBodyAsString();
            throw new RuntimeException(
                    "watsonx generation call failed [" + e.getStatusCode() + "]: " + errorBody, e);
        }
    }

    // ---------------------------------------------------------------
    // Prompt builders
    // ---------------------------------------------------------------

    private String buildQuestionsPrompt(String role, String experience, int count) {
        return String.format(
                "You are an expert technical interviewer. Generate exactly %d concise interview questions " +
                "for a %s candidate with %s years of experience. " +
                "Format: one question per line, numbered 1. 2. 3. etc. " +
                "Do not include any explanation, only the numbered questions.\n\n",
                count, role, experience != null ? experience : "2+"
        );
    }

    private String buildEvaluationPrompt(String question, String answer) {
        return String.format(
                "You are a technical interview coach. Evaluate the following answer to the interview question.\n\n" +
                "Question: %s\n\nCandidate Answer: %s\n\n" +
                "Provide concise, constructive feedback in 2-3 sentences: what was good, and one specific improvement.\n\n",
                question, answer
        );
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank()
                && !apiKey.equals("PLACEHOLDER_API_KEY");
    }

    private List<String> parseQuestions(String rawText, int expectedCount) {
        if (rawText == null || rawText.isBlank()) return List.of();
        // Split on newlines, strip numbering like "1. " or "1) "
        List<String> questions = Arrays.stream(rawText.split("\n"))
                .map(line -> line.replaceFirst("^\\d+[.)\\s]+", "").trim())
                .filter(line -> !line.isBlank() && line.length() > 10)
                .limit(expectedCount)
                .toList();
        return questions;
    }
}
