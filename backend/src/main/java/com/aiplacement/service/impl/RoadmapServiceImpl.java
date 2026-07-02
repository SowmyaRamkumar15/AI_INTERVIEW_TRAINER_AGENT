package com.aiplacement.service.impl;

import com.aiplacement.dto.request.RoadmapRequest;
import com.aiplacement.dto.response.RoadmapResponse;
import com.aiplacement.entity.Roadmap;
import com.aiplacement.entity.User;
import com.aiplacement.enums.RoadmapStatus;
import com.aiplacement.exception.ResourceNotFoundException;
import com.aiplacement.repository.RoadmapRepository;
import com.aiplacement.repository.UserRepository;
import com.aiplacement.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoadmapServiceImpl implements RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;

    @Override
    public RoadmapResponse addRoadmapItem(String email, RoadmapRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Roadmap roadmap = Roadmap.builder()
                .user(user)
                .weekNumber(request.getWeekNumber())
                .topic(request.getTopic())
                .status(request.getStatus() != null
                        ? RoadmapStatus.valueOf(request.getStatus())
                        : RoadmapStatus.NOT_STARTED)
                .build();

        return mapToResponse(roadmapRepository.save(roadmap));
    }

    @Override
    public List<RoadmapResponse> getUserRoadmap(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return roadmapRepository.findByUserIdOrderByWeekNumberAsc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoadmapResponse updateStatus(String email, Long id, String status) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap item not found"));

        if (!roadmap.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Roadmap item not found for this user");
        }

        roadmap.setStatus(RoadmapStatus.valueOf(status));
        return mapToResponse(roadmapRepository.save(roadmap));
    }

    @Override
    public void deleteItem(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap item not found"));

        if (!roadmap.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Roadmap item not found for this user");
        }

        roadmapRepository.delete(roadmap);
    }

    private RoadmapResponse mapToResponse(Roadmap roadmap) {
        return RoadmapResponse.builder()
                .id(roadmap.getId())
                .weekNumber(roadmap.getWeekNumber())
                .topic(roadmap.getTopic())
                .status(roadmap.getStatus() != null ? roadmap.getStatus().name() : null)
                .build();
    }
}
