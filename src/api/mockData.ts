export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'staff';
  membership: 'Bronze' | 'Silver' | 'Gold';
  points: number;
  musicTastes: string[];
  avatar: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  specialGuests: string[];
};

export type Partner = {
  id: string;
  name: string;
  description: string;
  perk: string;
  requiredMembership: 'Bronze' | 'Silver' | 'Gold';
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  cost: number; // in points
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    membership: 'Gold',
    points: 1500,
    musicTastes: ['Techno', 'House'],
    avatar: 'https://i.pravatar.cc/150?u=john.doe',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    membership: 'Silver',
    points: 750,
    musicTastes: ['Hip Hop', 'R&B'],
    avatar: 'https://i.pravatar.cc/150?u=jane.smith',
  },
  {
    id: '3',
    name: 'Admin Staff',
    email: 'admin@galleryclub.com',
    role: 'staff',
    membership: 'Gold',
    points: 9999,
    musicTastes: [],
    avatar: 'https://i.pravatar.cc/150?u=admin',
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt1',
    title: 'Neon Nights',
    date: '2025-12-12T22:00:00Z',
    description: 'A vibrant night with neon lights and electronic music.',
    specialGuests: ['DJ Sparkle', 'MC Glow'],
  },
  {
    id: 'evt2',
    title: 'Golden Era Gala',
    date: '2025-12-24T21:00:00Z',
    description: 'An exclusive Christmas Eve event for our Gold members.',
    specialGuests: ['The Golden Quartet'],
  },
];

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Luxury Cabs',
    description: 'Get home in style.',
    perk: '15% off on all rides from the club.',
    requiredMembership: 'Silver',
  },
  {
    id: 'p2',
    name: 'The Gilded Restaurant',
    description: 'Fine dining before your night out.',
    perk: 'A complimentary glass of champagne with your meal.',
    requiredMembership: 'Gold',
  },
];

export const MOCK_REWARDS: Reward[] = [
    {
        id: 'rew1',
        title: 'Free Drink Ticket',
        description: 'Exchange for one standard drink at the bar.',
        cost: 100,
    },
    {
        id: 'rew2',
        title: 'Queue Jump Pass',
        description: 'Skip the line with a friend.',
        cost: 250,
    }
];
