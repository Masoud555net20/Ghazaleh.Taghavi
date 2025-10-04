
import React from 'react';

export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface BlogPost {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  link: string;
}
