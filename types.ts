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