package com.greenco.service;

import com.greenco.dto.CopilotResponse;

public interface CopilotService {
    CopilotResponse getCopilotAnalysis(Long factoryId);
}
