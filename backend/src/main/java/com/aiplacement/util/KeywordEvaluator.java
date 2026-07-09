package com.aiplacement.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class KeywordEvaluator {

    private static final Map<String, List<String>> QUESTION_KEYWORDS = new HashMap<>();

    static {
        // Java & Core
        QUESTION_KEYWORDS.put("hashmap", List.of("key-value", "hashing", "o(1)", "collision", "bucket", "hashcode", "equals"));
        QUESTION_KEYWORDS.put("list and set", List.of("duplicate", "order", "index", "unique", "arraylist", "hashset"));
        QUESTION_KEYWORDS.put("dependency injection", List.of("ioc", "inversion of control", "decoupling", "bean", "autowired", "constructor"));
        QUESTION_KEYWORDS.put("spring boot", List.of("auto configuration", "starter", "embedded", "tomcat", "opinionated"));
        QUESTION_KEYWORDS.put("acid", List.of("atomicity", "consistency", "isolation", "durability", "transaction"));
        QUESTION_KEYWORDS.put("thread", List.of("runnable", "start", "concurrency", "multithreading", "process", "lightweight"));
        QUESTION_KEYWORDS.put("oop", List.of("inheritance", "polymorphism", "encapsulation", "abstraction", "class", "object"));
        QUESTION_KEYWORDS.put("polymorphism", List.of("overriding", "overloading", "runtime", "compile-time", "multiple forms"));
        
        // Frontend
        QUESTION_KEYWORDS.put("react", List.of("component", "state", "props", "virtual dom", "hook"));
        QUESTION_KEYWORDS.put("hook", List.of("usestate", "useeffect", "functional component", "lifecycle"));
        QUESTION_KEYWORDS.put("virtual dom", List.of("diffing", "reconciliation", "performance", "memory", "copy"));
        
        // Backend / DB
        QUESTION_KEYWORDS.put("index", List.of("performance", "speed", "b-tree", "lookup", "query"));
        QUESTION_KEYWORDS.put("rest api", List.of("http", "get", "post", "stateless", "json", "endpoint"));
        QUESTION_KEYWORDS.put("microservices", List.of("independent", "decoupled", "scaling", "api gateway", "distributed"));
        QUESTION_KEYWORDS.put("docker", List.of("container", "image", "isolation", "lightweight", "dockerfile"));
        QUESTION_KEYWORDS.put("kubernetes", List.of("orchestration", "cluster", "pod", "scaling", "deployment"));
    }

    public static EvaluationResult evaluate(String questionText, String userAnswer) {
        String lowerQuestion = questionText.toLowerCase();
        String lowerAnswer = userAnswer.toLowerCase();
        
        // Find best matching topic
        List<String> expectedKeywords = null;
        for (Map.Entry<String, List<String>> entry : QUESTION_KEYWORDS.entrySet()) {
            if (lowerQuestion.contains(entry.getKey())) {
                expectedKeywords = entry.getValue();
                break;
            }
        }
        
        // If no match found, fallback to generic length-based evaluation
        if (expectedKeywords == null) {
            double lengthScore = lowerAnswer.length() > 50 ? 5.0 : 3.0;
            if (lowerAnswer.length() > 150) lengthScore = 7.0;
            if (lowerAnswer.length() > 300) lengthScore = 8.5;
            
            return new EvaluationResult(
                lengthScore, 
                "Good effort! The answer could be more detailed, but you're on the right track."
            );
        }
        
        // Calculate keyword match score
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        
        for (String keyword : expectedKeywords) {
            if (lowerAnswer.contains(keyword)) {
                matched.add(keyword);
            } else {
                missing.add(keyword);
            }
        }
        
        double baseScore = ((double) matched.size() / expectedKeywords.size()) * 8.0; // Max 8 from keywords
        
        // Add length bonus
        if (lowerAnswer.length() > 100) baseScore += 1.0;
        if (lowerAnswer.length() > 250) baseScore += 1.0;
        
        double finalScore = Math.min(Math.round(baseScore * 10.0) / 10.0, 10.0);
        
        // Generate feedback
        StringBuilder feedback = new StringBuilder();
        if (matched.size() > 0) {
            feedback.append("Good points mentioned: ").append(String.join(", ", matched)).append(". ");
        }
        
        if (missing.size() > 0) {
            feedback.append("Try to also discuss: ").append(String.join(", ", missing)).append(". ");
        }
        
        if (finalScore < 5.0) {
            feedback.append("Your answer needs more depth.");
        } else if (finalScore >= 8.0) {
            feedback.append("Excellent answer!");
        }
        
        return new EvaluationResult(finalScore, feedback.toString().trim());
    }
    
    public static class EvaluationResult {
        public double score;
        public String feedback;
        
        public EvaluationResult(double score, String feedback) {
            this.score = score;
            this.feedback = feedback;
        }
    }
}
