package com.greenco.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenco.dto.FactoryResponse;
import com.greenco.service.FactoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FactoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FactoryService factoryService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnFactoryByIdForAuthorizedUser() throws Exception {
        // Given
        FactoryResponse response = new FactoryResponse(
                1L, 1L, "SteelCorp Springfield", "SteelCorp Plant",
                "Sector 7G", "Steel", new BigDecimal("39.78"), new BigDecimal("-89.65"),
                new BigDecimal("150000.00"), 450, "ACTIVE",
                LocalDateTime.now(), LocalDateTime.now()
        );

        when(factoryService.getFactoryById(anyLong())).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/v1/factories/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("SteelCorp Springfield"));
    }

    @Test
    void shouldReturnUnauthorizedWhenTokenIsMissing() throws Exception {
        mockMvc.perform(get("/api/v1/factories/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden()); // Blocked by stateless SecurityFilter
    }
}
