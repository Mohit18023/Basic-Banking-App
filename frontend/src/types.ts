// src/types.ts
export interface User {
    id: number;
    name: string;
    email: string;
    balance: number;
  }
  
  export interface Transfer {
    id: number;
    fromUserId: number;
    toUserId: number;
    amount: number;
    date: string;
  }
  