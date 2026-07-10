package com.greenco.mapper;

import com.greenco.dto.AssessmentSummaryResponse;
import com.greenco.entity.Assessment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AssessmentMapper {

    @Mapping(target = "factoryId", source = "factory.id")
    @Mapping(target = "factoryName", source = "factory.name")
    AssessmentSummaryResponse toSummaryResponse(Assessment assessment);
}
