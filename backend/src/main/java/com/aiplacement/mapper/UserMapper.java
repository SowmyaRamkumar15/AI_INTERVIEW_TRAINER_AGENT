package com.aiplacement.mapper;

import com.aiplacement.dto.request.RegisterRequest;
import com.aiplacement.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true) // Handled in service
    @Mapping(target = "role", ignore = true)     // Handled in service
    User toEntity(RegisterRequest request);
}
