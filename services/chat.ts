import { api } from './api';

export async function listThreads() { return api.get('/chat/threads'); }
export async function sendMessage(threadId: string, text: string) { return api.post(`/chat/threads/${threadId}/messages`, { text }); }