import React from 'react';

export interface BookRecommendation {
  title: string;
  author: string;
  year: string;
  summary: string;
  category: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

// Database Types
export interface UserProfile {
  id: string; // UUID from auth.users
  full_name: string;
  institution: string;
  subdomain: string;
  phone: string;
  role: 'admin' | 'user';
  created_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  status: 'pending' | 'active' | 'rejected' | 'expired';
  price: number;
  payment_proof_url?: string | null;
  created_at: string;
  updated_at: string;
  // Join fields
  profiles?: UserProfile; 
}