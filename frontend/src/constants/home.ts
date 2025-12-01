import { Clock, DollarSign, Shield, Sparkles, TrendingUp, Users } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    content:
      'CreatorHub made it incredibly easy to sell my design resources. The platform is intuitive and the payments are seamless.',
  },
  {
    name: 'Maria Garcia',
    role: 'Content Creator',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    content:
      "I've sold over $10,000 worth of templates in just 3 months. The AI-powered descriptions saved me hours of work!",
  },
  {
    name: 'James Lee',
    role: 'Developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    content:
      'The best platform for selling digital products. Clean interface, great features, and excellent customer support.',
  },
];

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Descriptions',
    description: 'Generate compelling product descriptions instantly with our advanced AI assistant.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Stripe-powered payment processing ensures safe and reliable transactions for everyone.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Track your sales, revenue, and performance with detailed real-time analytics.',
  },
  {
    icon: Users,
    title: 'Global Marketplace',
    description: 'Reach millions of buyers from around the world looking for quality digital products.',
  },
  {
    icon: DollarSign,
    title: 'Instant Payouts',
    description: 'Get paid instantly when you make a sale. No waiting periods or complicated withdrawals.',
  },
  {
    icon: Clock,
    title: 'Launch in Minutes',
    description: 'Set up your store and start selling in just a few clicks. No technical skills required.',
  },
];

const stats = [
  { value: '50K+', label: 'Active Creators' },
  { value: '$2M+', label: 'Creator Earnings' },
  { value: '100K+', label: 'Products Sold' },
  { value: '4.9/5', label: 'Average Rating' },
];

export { testimonials, features, stats };
