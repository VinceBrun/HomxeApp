import { api } from './api';

export async function listJobs() { return api.get('/jobs'); }
export async function claimJob(id: string) { return api.post(`/jobs/${id}/claim`); }