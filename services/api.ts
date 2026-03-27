/**
 * API Client
 * Lightweight HTTP wrapper for external API requests.
 */

export type HttpClient = {
  get: (url: string) => Promise<unknown>;
  post: (url: string, body?: unknown) => Promise<unknown>;
  put: (url: string, body?: unknown) => Promise<unknown>;
};

// Standard API implementation (mocked)
export const api: HttpClient = {
  async get(_url) { return {}; },
  async post(_url, _body) { return {}; },
  async put(_url, _body) { return {}; },
};