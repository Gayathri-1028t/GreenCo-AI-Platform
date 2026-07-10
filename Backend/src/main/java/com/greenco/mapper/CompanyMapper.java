package com.greenco.mapper;

import com.greenco.dto.CompanyResponse;
import com.greenco.entity.Company;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanyMapper {
    CompanyResponse toResponse(Company company);
}
