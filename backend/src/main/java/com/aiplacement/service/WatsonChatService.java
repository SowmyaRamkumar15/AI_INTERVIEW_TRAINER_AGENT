package com.aiplacement.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.PrivateKey;
import java.util.Date;
import java.util.UUID;

@Service
public class WatsonChatService {

    private final PrivateKey watsonPrivateKey;

    // Token expires in 1 hour
    private static final long EXPIRATION_TIME_MS = 3600 * 1000L;

    @Autowired
    public WatsonChatService(PrivateKey watsonPrivateKey) {
        this.watsonPrivateKey = watsonPrivateKey;
    }

    /**
     * Generate a compact RS256-signed JWT for the WatsonX Orchestrate embed widget.
     *
     * The IBM WxO "Embed Security → Chat user identity" page only registers a
     * public key and verifies the RS256 signature — it does NOT enforce iss or aud.
     * So the minimal required payload is:
     *   sub  – identifies the end-user (used for conversation continuity)
     *   iat  – issued-at
     *   exp  – expiry (widget rejects expired tokens)
     *   jti  – unique token ID (prevents replay)
     */
    public String generateWatsonToken(String userId) {
        if (userId == null || userId.isBlank()) {
            userId = "anonymous-" + UUID.randomUUID();
        }

        long now = System.currentTimeMillis();

        return Jwts.builder()
                .setSubject(userId)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + EXPIRATION_TIME_MS))
                .signWith(watsonPrivateKey, SignatureAlgorithm.RS256)
                .compact();
    }
}
