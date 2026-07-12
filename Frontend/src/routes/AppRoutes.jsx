import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// Import views
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import DashboardPage from "../pages/DashboardPage";
import FactoriesPage from "../pages/FactoriesPage";
import CertificatesPage from "../pages/CertificatesPage";
import SettingsPage from "../pages/SettingsPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import NotFoundPage from "../pages/NotFoundPage";
import UsersPage from "../pages/UsersPage";
import CompanyPage from "../pages/CompanyPage";
import CompanyDetailsPage from "../pages/CompanyDetailsPage";
import AssessmentWizardPage from "../pages/AssessmentWizardPage";
import AiAnalysisPage from "../pages/AiAnalysisPage";
import WorkflowPage from "../pages/WorkflowPage";
import ReportsPage from "../pages/ReportsPage";
import AssessmentsPage from "../pages/AssessmentsPage";
import EvidenceDetailsPage from "../pages/EvidenceDetailsPage";
import VerifyCertificatePage from "../pages/VerifyCertificatePage";
import CopilotPage from "../pages/CopilotPage";
import AuditLogsPage from "../pages/AuditLogsPage";
import InnovationLabPage from "../pages/InnovationLabPage";
import AwardsPage from "../pages/AwardsPage";
import ClimateIntelligencePage from "../pages/ClimateIntelligencePage";
import InvestmentPlannerPage from "../pages/InvestmentPlannerPage";
import ResearchHubPage from "../pages/ResearchHubPage";
import ResearchStandardPage from "../pages/ResearchStandardPage";
import CollaborationPortalPage from "../pages/CollaborationPortalPage";
import PartnerMarketplacePage from "../pages/PartnerMarketplacePage";

function AppRoutes() {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>
      <Route path="/verify" element={<VerifyCertificatePage />} />

      {/* Public Error Views */}
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* Protected Operations Dashboards */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route
            path="/companies/:companyId"
            element={<CompanyDetailsPage />}
          />
          <Route path="/factories" element={<FactoriesPage />} />
          <Route path="/copilot" element={<CopilotPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route
            path="/assessments/:id/wizard"
            element={<AssessmentWizardPage />}
          />
          <Route path="/assessments/:id/ai" element={<AiAnalysisPage />} />
          <Route path="/assessments/:id/workflow" element={<WorkflowPage />} />
          <Route
            path="/assessments/:assessmentId/evidence/:evidenceId"
            element={<EvidenceDetailsPage />}
          />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/innovation-lab" element={<InnovationLabPage />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/climate-intelligence" element={<ClimateIntelligencePage />} />
          <Route path="/investment-planner" element={<InvestmentPlannerPage />} />
          <Route path="/research-hub" element={<ResearchHubPage />} />
          <Route
            path="/research-hub/standards/:standardId"
            element={<ResearchStandardPage />}
          />
          <Route path="/collaboration" element={<CollaborationPortalPage />} />
          <Route path="/marketplace" element={<PartnerMarketplacePage />} />

          {/* User Management Route - Protected by specific roles */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "ROLE_SUPER_ADMIN",
                  "ROLE_ADMIN",
                  "ROLE_GREENCO_COORDINATOR",
                ]}
              />
            }
          >
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
