export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'staff';
  membership: 'Bronze' | 'Silver' | 'Gold';
  points: number;
  musicTastes: string[];
  avatar: string;
  gender: 'Male' | 'Female' | 'Other';
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
    gender: 'Male',
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
    gender: 'Female',
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
    gender: 'Other',
  },
  {
    id: '4',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'user',
    membership: 'Gold',
    points: 2100,
    musicTastes: ['House', 'Deep House', 'Techno'],
    avatar: 'https://i.pravatar.cc/150?u=michael.johnson',
    gender: 'Male',
  },
  {
    id: '5',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'user',
    membership: 'Silver',
    points: 920,
    musicTastes: ['Pop', 'EDM', 'Dance'],
    avatar: 'https://i.pravatar.cc/150?u=sarah.williams',
    gender: 'Female',
  },
  {
    id: '6',
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'user',
    membership: 'Bronze',
    points: 350,
    musicTastes: ['Hip Hop', 'Rap', 'Trap'],
    avatar: 'https://i.pravatar.cc/150?u=david.brown',
    gender: 'Male',
  },
  {
    id: '7',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    role: 'user',
    membership: 'Gold',
    points: 1800,
    musicTastes: ['R&B', 'Soul', 'Jazz'],
    avatar: 'https://i.pravatar.cc/150?u=emma.davis',
    gender: 'Female',
  },
  {
    id: '8',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'user',
    membership: 'Silver',
    points: 680,
    musicTastes: ['Rock', 'Indie', 'Alternative'],
    avatar: 'https://i.pravatar.cc/150?u=james.wilson',
    gender: 'Male',
  },
  {
    id: '9',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    role: 'user',
    membership: 'Bronze',
    points: 420,
    musicTastes: ['Latin', 'Reggaeton', 'Salsa'],
    avatar: 'https://i.pravatar.cc/150?u=olivia.martinez',
    gender: 'Female',
  },
  {
    id: '10',
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    role: 'user',
    membership: 'Gold',
    points: 1650,
    musicTastes: ['Techno', 'Trance', 'Progressive'],
    avatar: 'https://i.pravatar.cc/150?u=robert.taylor',
    gender: 'Male',
  },
  {
    id: '11',
    name: 'Sophia Anderson',
    email: 'sophia.anderson@example.com',
    role: 'user',
    membership: 'Silver',
    points: 780,
    musicTastes: ['Pop', 'Electronic', 'Synthwave'],
    avatar: 'https://i.pravatar.cc/150?u=sophia.anderson',
    gender: 'Female',
  },
  {
    id: '12',
    name: 'William Thomas',
    email: 'william.thomas@example.com',
    role: 'user',
    membership: 'Bronze',
    points: 290,
    musicTastes: ['Hip Hop', 'R&B', 'Soul'],
    avatar: 'https://i.pravatar.cc/150?u=william.thomas',
    gender: 'Male',
  },
  {
    id: '13',
    name: 'Isabella Jackson',
    email: 'isabella.jackson@example.com',
    role: 'user',
    membership: 'Gold',
    points: 1950,
    musicTastes: ['House', 'Disco', 'Funk'],
    avatar: 'https://i.pravatar.cc/150?u=isabella.jackson',
    gender: 'Female',
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

// Réservations d'événements (mock data)
export type EventBooking = {
  id: string;
  eventId: string;
  userId: string;
  bookingType: 'ticket' | 'vip';
  bookingDate: string;
};

export const MOCK_BOOKINGS: EventBooking[] = [
  {
    id: 'book1',
    eventId: 'evt1',
    userId: '1', // John Doe
    bookingType: 'ticket',
    bookingDate: '2025-11-15T10:00:00Z',
  },
  {
    id: 'book2',
    eventId: 'evt1',
    userId: '2', // Jane Smith
    bookingType: 'vip',
    bookingDate: '2025-11-16T14:00:00Z',
  },
  {
    id: 'book3',
    eventId: 'evt2',
    userId: '1', // John Doe
    bookingType: 'vip',
    bookingDate: '2025-11-20T09:00:00Z',
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

// Types pour le Feed
export type FeedContent = {
  id: string;
  userId: string;
  type: 'image' | 'video';
  mediaUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  createdAt: string;
  visibility: 'public' | 'private'; // public = tous, private = staff seulement
};

// Données mock pour le feed (mélange d'images et vidéos)
export const MOCK_FEED_CONTENT: FeedContent[] = [
  {
    id: 'feed1',
    userId: '1', // John Doe
    type: 'image',
    mediaUrl: 'https://picsum.photos/400/600?random=10',
    caption: 'Amazing night at the club! 🎉 #GalleryClub',
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Il y a 1h
    visibility: 'public',
  },
  {
    id: 'feed2',
    userId: '2', // Jane Smith
    type: 'video',
    mediaUrl: 'https://picsum.photos/400/600?random=11',
    caption: 'Best dance moves! 💃✨',
    likes: 67,
    comments: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
    visibility: 'public',
  },
  {
    id: 'feed3',
    userId: '1', // John Doe
    type: 'image',
    mediaUrl: 'https://picsum.photos/400/600?random=12',
    caption: 'Best dressing contest entry 👔',
    likes: 89,
    comments: 15,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // Il y a 3h
    visibility: 'private', // Privé pour le staff
  },
  {
    id: 'feed4',
    userId: '2', // Jane Smith
    type: 'video',
    mediaUrl: 'https://picsum.photos/400/600?random=13',
    caption: 'VIP section vibes 🥂',
    likes: 124,
    comments: 23,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Il y a 4h
    visibility: 'public',
  },
  {
    id: 'feed5',
    userId: '1', // John Doe
    type: 'image',
    mediaUrl: 'https://picsum.photos/400/600?random=14',
    caption: 'Night vibes 🌙',
    likes: 56,
    comments: 7,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // Il y a 5h
    visibility: 'public',
  },
];
