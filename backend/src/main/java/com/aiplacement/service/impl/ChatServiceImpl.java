package com.aiplacement.service.impl;

import com.aiplacement.dto.request.ChatRequest;
import com.aiplacement.dto.response.ChatResponse;
import com.aiplacement.entity.ChatHistory;
import com.aiplacement.entity.User;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.ChatHistoryRepository;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.ChatService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    // Not injected by constructor — inline-initialised
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
            .build();
    private final Map<Long, String> sessionMap = new ConcurrentHashMap<>();
    // Correct IBM Cloud Orchestrate REST base — api.<region>.watson.cloud.ibm.com
    private static final String ORCHESTRATE_BASE_DOMAIN = "watson.cloud.ibm.com";
    @Value("${ibm.watsonx.api-key}")
    private String ibmApiKey;

    @Value("${ibm.watsonx.orchestrate.instance-id}")
    private String instanceId;

    @Value("${ibm.watsonx.orchestrate.region}")
    private String region;

    @Value("${ibm.watsonx.orchestrate.agent-id}")
    private String agentId;

    @PostConstruct
    public void init() {
        System.out.println("[Config] region = " + region);
        System.out.println("[Config] instanceId = " + instanceId);
        System.out.println("[Config] baseDomain = " + ORCHESTRATE_BASE_DOMAIN);
        System.out.println("[Config] agentId = " + agentId);
    }

    // IAM token cache
    private String cachedIamToken = null;
    private long iamTokenExpiresAt = 0;

    // ─── IAM token exchange ─────────────────────────────────────────────────

    private synchronized String getIamToken() throws Exception {
        long now = System.currentTimeMillis();
        if (cachedIamToken != null && now < iamTokenExpiresAt - 60_000) {
            return cachedIamToken;
        }

        String body = "grant_type=" + URLEncoder.encode("urn:ibm:params:oauth:grant-type:apikey", StandardCharsets.UTF_8)
                + "&apikey=" + URLEncoder.encode(ibmApiKey, StandardCharsets.UTF_8);

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://iam.cloud.ibm.com/identity/token"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() != 200) {
            throw new RuntimeException("IAM token exchange failed: HTTP " + res.statusCode() + " — " + res.body());
        }

        JsonNode json = objectMapper.readTree(res.body());
        cachedIamToken = json.get("access_token").asText();
        long expiresIn = json.path("expires_in").asLong(3600);
        iamTokenExpiresAt = now + expiresIn * 1000L;
        return cachedIamToken;
    }

    // ─── Orchestrate REST chat ───────────────────────────────────────────────

    /**
     * POST https://{region}.watson-orchestrate.cloud.ibm.com/instances/{instanceId}/v1/chat
     *
     * Request body:
     * {
     *   "input": { "text": "<user message>" },
     *   "agent_id": "<agentId>",
     *   "session_id": "<sessionId>"   // optional — omit on first turn
     * }
     *
     * Response:
     * {
     *   "output": { "text": "..." },
     *   "session_id": "..."
     * }
     */
    private String callOrchestrateApi(String message, Long userId) throws Exception {
        String iamToken = getIamToken();

        // /chat/completions uses OpenAI-compatible messages format
        java.util.Map<String, Object> reqBody = new java.util.LinkedHashMap<>();
        reqBody.put("messages", List.of(Map.of("role", "user", "content", message)));

        String reqJson = objectMapper.writeValueAsString(reqBody);

        System.out.println("[Debug] region = " + region);
        System.out.println("[Debug] instanceId = " + instanceId);
        System.out.println("[Debug] agentId = " + agentId);
        // Correct URL: https://api.<region>.watson.cloud.ibm.com/instances/<id>/v1/orchestrate/agents/<agentId>/chat/completions
        String url = "https://api." + region + "." + ORCHESTRATE_BASE_DOMAIN
                + "/instances/" + instanceId
                + "/v1/orchestrate/agents/" + agentId
                + "/chat/completions";

        System.out.println("[ChatService] Calling Orchestrate URL: " + url);
        System.out.println("[ChatService] Request body: " + reqJson);

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + iamToken)
                .POST(HttpRequest.BodyPublishers.ofString(reqJson))
                .build();

        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());

        System.out.println("[ChatService] Orchestrate response status: " + res.statusCode());
        System.out.println("[ChatService] Orchestrate response body: " + res.body());

        if (res.statusCode() != 200 && res.statusCode() != 201) {
            throw new RuntimeException("Orchestrate API error: HTTP " + res.statusCode() + " — " + res.body());
        }

        JsonNode json = objectMapper.readTree(res.body());

        // OpenAI-compatible response: choices[0].message.content
        JsonNode choices = json.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            String content = choices.get(0).path("message").path("content").asText("");
            if (!content.isBlank()) return content;
        }

        // Fallback: legacy output.text or output.generic[].text
        JsonNode output = json.path("output");
        if (output.has("text") && !output.get("text").asText().isBlank()) {
            return output.get("text").asText();
        }
        JsonNode generic = output.path("generic");
        if (generic.isArray() && generic.size() > 0) {
            StringBuilder sb = new StringBuilder();
            for (JsonNode item : generic) {
                if (item.has("text")) sb.append(item.get("text").asText()).append("\n");
            }
            String result = sb.toString().trim();
            if (!result.isBlank()) return result;
        }

        throw new RuntimeException("Unexpected Orchestrate response shape: " + json);
    }

    // ─── Main service method ─────────────────────────────────────────────────

    @Override
    @Transactional
    public ChatResponse sendMessage(String email, ChatRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String aiResponse;

        boolean hasRealApiKey = ibmApiKey != null
                && !ibmApiKey.isBlank()
                && !ibmApiKey.equals("PLACEHOLDER_API_KEY");

        if (hasRealApiKey) {
            try {
                aiResponse = callOrchestrateApi(request.getMessage(), user.getId());
            } catch (Exception e) {
                // e.getMessage() can be null for some exception types — use toString() as fallback
                String errMsg = (e.getMessage() != null) ? e.getMessage() : e.toString();
                System.err.println("[ChatService] Orchestrate API call failed: " + errMsg);
                e.printStackTrace();
                aiResponse = "⚠️ **IBM Orchestrate API Error**\n\n```\n" + errMsg + "\n```\n\nFalling back to keyword responses. Check the backend console for details.";
            }
        } else {
            aiResponse = generateKeywordResponse(request.getMessage(), request.getRole());
        }

        ChatHistory chatHistory = ChatHistory.builder()
                .user(user)
                .question(request.getMessage())
                .response(aiResponse)
                .timestamp(LocalDateTime.now())
                .build();

        chatHistoryRepository.save(chatHistory);

        return ChatResponse.builder()
                .response(aiResponse)
                .build();
    }

    @Override
    public List<ChatHistory> getChatHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return chatHistoryRepository.findByUserIdOrderByTimestampAsc(user.getId());
    }

    // ─── Keyword fallback (used when API key is not configured) ─────────────

    private String generateKeywordResponse(String message, String role) {
        if (message == null || message.isBlank()) {
            return "Please ask me a question about interview preparation and I'll help you!";
        }

        String msg = message.toLowerCase();

        if (msg.contains("system design")) {
            return "🏗️ **System Design Interview Preparation**\n\n" +
                   "Here's how to approach system design interviews:\n\n" +
                   "**1. Clarify Requirements (5 min)**\n" +
                   "- Ask about scale: users, read/write ratio, data volume\n" +
                   "- Functional vs non-functional requirements\n\n" +
                   "**2. High-Level Design (10 min)**\n" +
                   "- Start with clients → Load Balancer → API Gateway → Services → Database\n" +
                   "- Draw the basic architecture first\n\n" +
                   "**3. Deep Dive (15 min)**\n" +
                   "- Database choice: SQL (ACID, relations) vs NoSQL (scale, flexibility)\n" +
                   "- Caching strategies (Redis, CDN)\n" +
                   "- Message queues for async processing\n\n" +
                   "**4. Key Concepts to Master:**\n" +
                   "- CAP Theorem, Consistent Hashing\n" +
                   "- Horizontal vs Vertical scaling\n" +
                   "- Rate limiting, API design\n\n" +
                   "📚 **Recommended resources:** 'Designing Data-Intensive Applications' by Martin Kleppmann";
        }

        if (msg.contains("star method") || msg.contains("behavioral") || msg.contains("tell me about yourself")) {
            return "⭐ **The STAR Method for Behavioral Questions**\n\n" +
                   "**S - Situation** (20%) — Set the scene briefly.\n\n" +
                   "**T - Task** (20%) — What was your specific responsibility?\n\n" +
                   "**A - Action** (50%) — Explain exactly what YOU did, step-by-step.\n\n" +
                   "**R - Result** (10%) — Quantify the outcome.\n\n" +
                   "💡 **Pro tip:** Always prepare 5-7 STAR stories covering leadership, conflict, failure, and success!";
        }

        if (msg.contains("react")) {
            return "⚛️ **Most Common React Interview Questions**\n\n" +
                   "**Core:** Virtual DOM, useState vs useReducer, useEffect cleanup, React keys\n\n" +
                   "**Advanced:** useMemo vs useCallback, Context API vs Redux, React.memo, custom hooks\n\n" +
                   "**Performance:** Code splitting with React.lazy, avoiding unnecessary re-renders\n\n" +
                   "💡 Be ready to implement a custom hook like `useFetch` on the spot!";
        }

        if (msg.contains("salary") || msg.contains("negotiat") || msg.contains("offer")) {
            return "💰 **Salary Negotiation Tips**\n\n" +
                   "1. Research Glassdoor, LinkedIn Salary before any conversation\n" +
                   "2. Never give the first number — ask for their budget range\n" +
                   "3. Counter with: 'Based on my X years in Y, I was expecting Z. Is there flexibility?'\n" +
                   "4. Negotiate the full package: base, bonus, stock, WFH, growth timeline\n" +
                   "5. Always negotiate — 80% of employers expect it";
        }

        if (msg.contains("coding") || msg.contains("algorithm") || msg.contains("dsa") || msg.contains("leetcode")) {
            return "💻 **Coding Interview Preparation**\n\n" +
                   "**8-12 Week Roadmap:**\n" +
                   "Week 1-2: Arrays, Strings, Hashing\n" +
                   "Week 3-4: Two Pointers, Sliding Window, Stacks\n" +
                   "Week 5-6: Trees, Binary Search, Recursion\n" +
                   "Week 7-8: Graphs (BFS/DFS), Dynamic Programming\n\n" +
                   "**On interview day:** clarify → brute force → optimize → test edge cases\n\n" +
                   "📚 Target: 150+ LeetCode problems (Easy/Medium/Hard mix)";
        }

        if (msg.contains("machine learning") || msg.contains("ml") || msg.contains("ai") || msg.contains("deep learning") || msg.contains("supervised") || msg.contains("neural")) {
            return "🤖 **Machine Learning / AI Interview Topics**\n\n" +
                   "**Fundamentals:**\n" +
                   "- Supervised vs Unsupervised vs Reinforcement Learning\n" +
                   "- Bias-variance tradeoff, overfitting, regularization (L1/L2)\n" +
                   "- Train/validation/test split, cross-validation\n\n" +
                   "**Algorithms to know:**\n" +
                   "- Linear/Logistic Regression, Decision Trees, Random Forest\n" +
                   "- SVM, K-Means, KNN, Naive Bayes\n" +
                   "- Neural Networks: forward/backprop, activation functions\n\n" +
                   "**Deep Learning:**\n" +
                   "- CNNs (image), RNNs/LSTMs (sequence), Transformers (NLP)\n" +
                   "- Gradient descent variants: SGD, Adam, RMSProp\n\n" +
                   "**Metrics:** Accuracy, Precision, Recall, F1, AUC-ROC, RMSE\n\n" +
                   "💡 **Tip:** Always explain tradeoffs — no algorithm is universally best!";
        }

        if (msg.contains("java") || msg.contains("spring")) {
            return "☕ **Java / Spring Boot Interview Questions**\n\n" +
                   "**Java Core:** OOP principles, Collections framework, Generics, Streams API, Optional\n\n" +
                   "**Concurrency:** Thread lifecycle, synchronized, volatile, ExecutorService, CompletableFuture\n\n" +
                   "**Spring Boot:** IoC/DI, Bean scopes, @Transactional, REST controllers, Spring Security, JPA\n\n" +
                   "**Common questions:**\n" +
                   "- Difference between @Component, @Service, @Repository\n" +
                   "- How does Spring handle transactions?\n" +
                   "- Explain N+1 query problem and how to fix it\n" +
                   "- What is the difference between HashMap and ConcurrentHashMap?";
        }

        if (msg.contains("python")) {
            return "🐍 **Python Interview Questions**\n\n" +
                   "**Core:** GIL, generators vs iterators, decorators, context managers, list comprehensions\n\n" +
                   "**OOP:** dunder methods, MRO, @classmethod vs @staticmethod, dataclasses\n\n" +
                   "**Common questions:**\n" +
                   "- Mutable vs immutable types\n" +
                   "- How does memory management work (reference counting, GC)?\n" +
                   "- Difference between `__str__` and `__repr__`\n" +
                   "- What are *args and **kwargs?";
        }

        String roleStr = (role != null && !role.isBlank()) ? role : "Software Engineering";
        return "💬 **AI Mentor**\n\n" +
               "You asked: *\"" + message + "\"*\n\n" +
               "Here are preparation tips for **" + roleStr + "**:\n\n" +
               "1. **Research the company** — products, tech stack, recent news\n" +
               "2. **Review core fundamentals** for " + roleStr + "\n" +
               "3. **Prepare 5-7 STAR stories** — leadership, conflict, failure, success\n" +
               "4. **Ask great questions** to your interviewers\n" +
               "5. **Use Mock Interview** to practice with AI feedback\n\n" +
               "Try asking about: system design · STAR method · React · Java · Python · ML · salary negotiation · coding interviews";
    }
}
