package com.aiplacement.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email format is not valid")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;
    
    private String role; // Optional, defaults to STUDENT if null
}
