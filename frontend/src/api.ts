// src/api.ts
import axios from 'axios';
import { User, Transfer } from './types';

const API_URL = 'http://localhost:5000/api';

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const createTransfer = async (transfer: Omit<Transfer, 'id' | 'date'>): Promise<Transfer> => {
  const response = await axios.post(`${API_URL}/transfers`, transfer);
  return response.data;
};
