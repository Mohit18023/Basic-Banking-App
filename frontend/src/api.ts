// src/api.ts
import axios from 'axios';
import { User, Transfer } from './types';

const API_URL = 'https://basic-banking-app-2imk.onrender.com/api';



export const getUsers = async (): Promise<User[]> => {
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${API_URL}/user/users`,
  headers: { }
};

// axios.request(config)
// .then((response) => {
//   return response.data;
// })
  const users = await axios.request(config);
  return users.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get(`${API_URL}/user/get/${id}`);
  return response.data;
};

export const createTransfer = async (transfer: Omit<Transfer, 'id' | 'date'>): Promise<Transfer> => {
  const response = await axios.post(`${API_URL}/transfer/transfers`, transfer);
  return response.data;
};

export const userHistory = async(id:number): Promise<Transfer[]> =>{
  const response = await axios.get(`${API_URL}/transfer/history/${id}`);
  return response.data;
}