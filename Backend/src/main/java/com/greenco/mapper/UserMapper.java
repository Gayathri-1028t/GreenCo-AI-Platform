package com.greenco.mapper;

import com.greenco.dto.UserResponse;
import com.greenco.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRoles")
    UserResponse toResponse(User user);

    @Named("mapRoles")
    default List<String> mapRoles(Set<com.greenco.entity.Role> roles) {
        if (roles == null) return List.of();
        return roles.stream()
                .map(com.greenco.entity.Role::getName)
                .collect(Collectors.toList());
    }
}
