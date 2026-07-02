export const API_BASE_URL = 'http://localhost:8080/api';

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
    GET_ALL: '/resume',
    DELETE: '/resume',
    GET_SKILLS: '/resume/skills',
    GENERATE_QUESTIONS: '/resume/generate-questions',
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
  ROADMAP: {
    GET: '/roadmap',
    UPDATE_STATUS: '/roadmap/status',
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
    NEXT: '/interview/next',
    EVALUATE: '/interview/evaluate',
    END: '/interview/end',
  },
  CHAT: {
    SEND_MESSAGE: '/chat',
    HISTORY: '/chat/history',
  },
  WATSON: {
    TOKEN: '/watson/token',
  },
};
