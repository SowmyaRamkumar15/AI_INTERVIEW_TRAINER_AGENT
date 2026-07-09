export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  DASHBOARD: {
    GET_DATA: '/dashboard',
  },
  RESUME: {
    UPLOAD: '/resume/upload',
    GET_ALL: '/resume/all',
    DELETE: '/resume',
    GET_SKILLS: '/resume/skills',
  },
  SKILLS: {
    GET_ALL: '/skills',
    ADD: '/skills',
    DELETE: '/skills',
  },
  SKILL_GAP: {
    ANALYZE: '/skill-gap/analyze',
    GET: '/skill-gap',
  },
  ANALYTICS: {
    GET: '/analytics',
  },
  QUESTIONS: {
    GET_ALL: '/questions',
    GET_BY_ID: '/questions',
    FILTER: '/questions/filter',
    SUBMIT_ANSWER: '/answers',
  },
  MOCK_INTERVIEW: {
    START: '/interview/start',
    HISTORY: '/interview/history',
    GET_BY_ID: '/interview',
  },
  CHAT: {
    SEND_MESSAGE: '/chat',
    HISTORY: '/chat/history',
  },
  STUDY_PLAN: {
    GENERATE: '/studyplan/generate',
  },
  COMPANY: {
    GET_ALL: '/company',
    GET_BY_NAME: '/company',
    GET_QUESTIONS: '/company',
  },
  ROADMAP: {
    GET_ALL: '/roadmap',
    ADD: '/roadmap',
    UPDATE_STATUS: (id) => `/roadmap/${id}/status`,
    DELETE: (id) => `/roadmap/${id}`,
  },
};

