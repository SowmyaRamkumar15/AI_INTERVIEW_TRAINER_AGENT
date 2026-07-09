package com.aiplacement.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class QuestionTemplateBank {

    private static final Map<String, List<String>> ROLE_QUESTIONS = new HashMap<>();
    private static final Random random = new Random();

    static {
        // Software Engineer
        ROLE_QUESTIONS.put("software engineer", List.of(
            "Explain how a HashMap works internally in Java.",
            "What is the difference between an ArrayList and a LinkedList? When would you use each?",
            "Can you explain the ACID properties of database transactions?",
            "What is dependency injection and what problem does it solve?",
            "Explain the concept of multithreading and how to avoid deadlocks.",
            "What are the main principles of Object-Oriented Programming (OOP)?",
            "How does garbage collection work in Java?",
            "Design a URL shortening service like bit.ly. What components would you need?",
            "Explain the differences between REST and GraphQL.",
            "How do you optimize a slow-performing SQL query?"
        ));
        
        // Frontend Developer
        ROLE_QUESTIONS.put("frontend developer", List.of(
            "Explain the concept of Virtual DOM in React.",
            "What are React Hooks? Explain useState and useEffect.",
            "How does CSS Flexbox differ from CSS Grid?",
            "What is event delegation in JavaScript?",
            "Explain the difference between '==' and '===' in JavaScript.",
            "How do you handle state management in a large React application?",
            "What are closures in JavaScript? Provide an example.",
            "How do you optimize the loading performance of a web application?",
            "Explain Server-Side Rendering (SSR) vs Client-Side Rendering (CSR).",
            "What is CORS and why is it needed?"
        ));
        
        // Backend Developer
        ROLE_QUESTIONS.put("backend developer", List.of(
            "Explain the Spring Boot auto-configuration mechanism.",
            "How do you implement security in a REST API using JWT?",
            "What is the difference between monolithic and microservices architecture?",
            "Explain the purpose of an API Gateway.",
            "How do you handle database migrations?",
            "What are the benefits of using Docker for backend applications?",
            "Explain how messaging queues like RabbitMQ or Kafka are used in backend systems.",
            "What is the N+1 select problem in ORM frameworks like Hibernate?",
            "How do you handle distributed transactions in microservices?",
            "Explain the concepts of vertical vs horizontal scaling."
        ));
        
        // Data Scientist
        ROLE_QUESTIONS.put("data scientist", List.of(
            "Explain the difference between supervised and unsupervised learning.",
            "What is overfitting in machine learning and how do you prevent it?",
            "How do you handle missing or imbalanced data in a dataset?",
            "Explain how a Random Forest classifier works.",
            "What is the bias-variance tradeoff?",
            "Explain the difference between L1 and L2 regularization.",
            "How do you evaluate the performance of a classification model?",
            "What is PCA (Principal Component Analysis) and when would you use it?",
            "Explain the architecture of a Convolutional Neural Network (CNN).",
            "What is the curse of dimensionality?"
        ));
        
        // Product Manager
        ROLE_QUESTIONS.put("product manager", List.of(
            "How do you prioritize features for a product roadmap?",
            "What metrics would you track for a newly launched B2B SaaS product?",
            "How do you handle conflicting feedback from different stakeholders?",
            "Explain a time you had to pivot a product strategy. What led to that decision?",
            "How do you conduct user research and incorporate it into the product?",
            "What is your approach to writing clear and effective user stories?",
            "How do you measure the success of a product launch?",
            "Explain the difference between Agile and Waterfall methodologies."
        ));
    }

    public static List<String> generateQuestions(String role, String difficulty, int count) {
        String roleKey = role != null ? role.toLowerCase() : "software engineer";
        List<String> questionsForRole = ROLE_QUESTIONS.get(roleKey);
        
        // Fallback to Software Engineer if role not found
        if (questionsForRole == null || questionsForRole.isEmpty()) {
            questionsForRole = ROLE_QUESTIONS.get("software engineer");
        }
        
        // Create a modifiable copy
        List<String> availableQuestions = new ArrayList<>(questionsForRole);
        
        // Shuffle to get random questions
        Collections.shuffle(availableQuestions, random);
        
        // Return up to 'count' questions
        int resultSize = Math.min(count, availableQuestions.size());
        return new ArrayList<>(availableQuestions.subList(0, resultSize));
    }
}
