import api from './api'

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  register: (data) => api.post('/auth/register', data).then(res => res.data),
  logout: () => api.post('/auth/logout').then(res => res.data),
  refresh: () => api.post('/auth/refresh', {}, { withCredentials: true }).then(res => res.data)
}

export const userService = {
  getUsers: (params) => api.get('/users', { params }).then(res => res.data),
  createUser: (data) => api.post('/users', data).then(res => res.data),
  updateUser: (id, data) => api.put(`/users/${id}`, data).then(res => res.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then(res => res.data)
}

export const companyService = {
  getCompanies: (params) => api.get('/companies', { params }).then(res => res.data),
  getCompanyById: (id) => api.get(`/companies/${id}`).then(res => res.data),
  createCompany: (data) => api.post('/companies', data).then(res => res.data),
  approveCompany: (id) => api.patch(`/companies/${id}/approve`).then(res => res.data),
  deleteCompany: (id) => api.delete(`/companies/${id}`).then(res => res.data)
}

export const factoryService = {
  getFactories: (params) => api.get('/factories', { params }).then(res => res.data),
  getFactoryById: (id) => api.get(`/factories/${id}`).then(res => res.data),
  createFactory: (data) => api.post('/factories', data).then(res => res.data),
  updateFactory: (id, data) => api.put(`/factories/${id}`, data).then(res => res.data),
  createBaseline: (factoryId, data) => api.post(`/factories/${factoryId}/baseline`, data).then(res => res.data),
  deleteFactory: (id) => api.delete(`/factories/${id}`).then(res => res.data)
}

export const assessmentService = {
  getAssessments: (params) => api.get('/assessments', { params }).then(res => res.data),
  getAssessmentById: (id) => api.get(`/assessments/${id}`).then(res => res.data),
  createAssessment: (data) => api.post('/assessments', data).then(res => res.data),
  submitAnswers: (id, data) => api.post(`/assessments/${id}/responses`, data).then(res => res.data),
  deleteAssessment: (id) => api.delete(`/assessments/${id}`).then(res => res.data)
}

export const documentService = {
  uploadFile: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data),
  deleteDocument: (id) => api.delete(`/documents/${id}`).then(res => res.data)
}

export const aiService = {
  triggerScan: (docId) => api.post(`/ai/document/${docId}`).then(res => res.data)
}

export const workflowService = {
  transition: (data) => api.post('/workflow/transition', data).then(res => res.data),
  getHistory: (assessmentId) => api.get(`/workflow/history/assessment/${assessmentId}`).then(res => res.data)
}

export const dashboardService = {
  getSummary: (params) => api.get('/dashboard/summary', { params }).then(res => res.data)
}

export const reportService = {
  getFacilityReport: (factoryId) => api.get(`/reports/facility/${factoryId}`).then(res => res.data)
}

export const certificateService = {
  getCertificates: (params) => api.get('/certificates', { params }).then(res => res.data),
  getCertificateById: (id) => api.get(`/certificates/${id}`).then(res => res.data)
}
