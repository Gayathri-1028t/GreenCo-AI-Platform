package com.greenco.mapper;

import com.greenco.dto.FactoryResponse;
import com.greenco.entity.Factory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FactoryMapper {

    @Mapping(target = "companyId", source = "company.id")
    @Mapping(target = "companyName", source = "company.legalName")
    FactoryResponse toResponse(Factory factory);
}
