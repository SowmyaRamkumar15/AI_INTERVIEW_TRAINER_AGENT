package com.aiplacement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mock_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockQuestion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String question;
    
    @Column(columnDefinition = "TEXT")
    private String userAnswer;
    
    @Column(columnDefinition = "TEXT")
    private String idealAnswer;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    private String difficulty;
    
    private Double score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mock_interview_id")
    @JsonBackReference
    private MockInterview mockInterview;
}
