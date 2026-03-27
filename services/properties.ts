/**
 * Properties Service
 * Methods for interacting with the properties API.
 */

import { api } from './api';

export async function listProperties() { 
  return api.get('/properties'); 
}

export async function createProperty(data: unknown) { 
  return api.post('/properties', data); 
}

export async function updateProperty(id: string, data: unknown) { 
  return api.put(`/properties/${id}`, data); 
}