import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  TrendingUp,
  Search,
  MessageSquare,
  Clock,
  Star,
  ArrowRight,
  Target,
  BookOpen,
} from 'lucide-react';
import { motion } from 'motion/react';

import { useChatPanel } from './ChatPanel';
import { LogoutButton } from './LogoutButton';
import { computeMatchScore } from './utils/computeMatchScore';

import axiosClient from '../../api/axiosClient';

interface MenteeData {
  id: number;
  goals: string[];
  learningStyle: string;
  availability: string;
  experienceLevel: string;
}

// Interface matching the mapped data from FindMentors
interface Mentor {
  id: number;
  name: string;
  title: string;
  company: string;
  rating: number;
  sessions: number;
  bio: string;
  expertise: string[];
  image: string;
  matchScore: number;
  location: string;
  availability: string;
}

export function Dashboard() {
  const { openChat, ChatPortal } = useChatPanel();
  const [recommendedMentors, setRecommendedMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const imageUrls = [
    'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDcwOTI5fDA&ixlib=rb-4.1.0&q=80&w=400',
    'https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWFuJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc1NTQ5MTc3fDA&ixlib=rb-4.1.0&q=80&w=400',
    'https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwd29tYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc1NTQ5MTc3fDA&ixlib=rb-4.1.0&q=80&w=400',
    'https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTU0OTA0OXww&ixlib=rb-4.1.0&q=80&w=400',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3J8ZW58MXx8fHwxNzc1NTQ5MTc3fDA&ixlib=rb-4.1.0&q=80&w=400',
  ];

  useEffect(() => {
    Promise.all([
      axiosClient.get('/mentees/me'),
      axiosClient.get<
        {
          id: number;
          name: string;
          title: string;
          company: string;
          rating?: number;
          reviewCount?: number;
          profileBio?: string;
          skills?: string[];
        }[]
      >('/mentors'),
    ])
      .then(([menteeRes, mentorsRes]) => {
        const menteeData: MenteeData = {
          id: menteeRes.data.id,
          goals: menteeRes.data.goals || [],
          learningStyle: menteeRes.data.learningStyle || '',
          availability: menteeRes.data.availability || '',
          experienceLevel: menteeRes.data.experienceLevel || 'Intermediate',
        };

        const populatedData = mentorsRes.data
          .map((m, index: number) => ({
            id: m.id,
            name: m.name,
            title: m.title,
            company: m.company,
            rating: m.rating || 4.8,
            sessions: m.reviewCount || 15,
            bio: m.profileBio || 'Experienced professional passionate about mentoring.',
            expertise: m.skills || [],
            image: imageUrls[index % imageUrls.length] ?? '',
            matchScore: computeMatchScore(
              {
                id: m.id,
                name: m.name,
                title: m.title,
                company: m.company,
                rating: m.rating || 4.8,
                sessions: m.reviewCount || 15,
                bio: m.profileBio || 'Experienced professional passionate about mentoring.',
                expertise: m.skills || [],
                image: imageUrls[index % imageUrls.length] ?? '',
                matchScore: 0,
                location: 'Cluj-Napoca, RO',
                availability: 'Available this week',
              },
              menteeData,
            ),
            location: 'Cluj-Napoca, RO',
            availability: 'Available this week',
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 3);

        setRecommendedMentors(populatedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const upcomingSessions = [
    {
      id: 1,
      mentor: 'Dr. Sarah Chen',
      topic: 'Leadership Development',
      date: 'Tomorrow, 2:00 PM',
      duration: '60 min',
      image:
        'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDcwOTI5fDA&ixlib=rb-4.1.0&q=80&w=400',
    },
    {
      id: 2,
      mentor: 'Marcus Williams',
      topic: 'Product Strategy Session',
      date: 'Friday, 10:00 AM',
      duration: '45 min',
      image:
        'https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTU0OTA0OXww&ixlib=rb-4.1.0&q=80&w=400',
    },
  ];

  const goals = [
    { name: 'Leadership Skills', progress: 65, sessions: 8 },
    { name: 'Technical Skills', progress: 45, sessions: 5 },
    { name: 'Communication', progress: 80, sessions: 10 },
  ];

  return (
    <div className="min-h-screen  bg-background">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-slate-900">MentorMatch</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link to="/find-mentors" className="text-slate-600 hover:text-slate-900">
                  Find Mentors
                </Link>
                <Link to="/my-mentors" className="text-slate-600 hover:text-slate-900">
                  My Mentors
                </Link>
                <Link to="/progress" className="text-slate-600 hover:text-slate-900">
                  Progress
                </Link>
                <Link to="/mentee-resources" className="text-slate-600 hover:text-slate-900">
                  Resources
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => openChat()} className="p-2 text-slate-600 hover:text-slate-900 relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <LogoutButton className="text-slate-600 hover:text-slate-900" />
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                AI {/* Initial for Alex Ionescu */}
              </div>
            </div>
          </div>
        </div>
        <ChatPortal />
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-slate-600">You have 2 upcoming sessions this week</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Sessions</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">23</div>
            <div className="text-sm text-green-600 mt-1">+3 this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Active Mentors</span>
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">3</div>
            <div className="text-sm text-slate-600 mt-1">In 2 categories</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Avg Progress</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">63%</div>
            <div className="text-sm text-green-600 mt-1">+12% this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Learning Hours</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">18.5</div>
            <div className="text-sm text-slate-600 mt-1">Hours completed</div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Upcoming Sessions</h2>
                <Link to="/my-mentors" className="text-blue-600 text-sm font-medium hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                  >
                    <img src={session.image} alt={session.mentor} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{session.mentor}</div>
                      <div className="text-sm text-slate-600">{session.topic}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{session.date}</div>
                      <div className="text-sm text-slate-600">{session.duration}</div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Your Goals</h2>
                <Link to="/progress" className="text-blue-600 text-sm font-medium hover:underline">
                  View details
                </Link>
              </div>
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={goal.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-900">{goal.name}</span>
                      </div>
                      <div className="text-sm text-slate-600">{goal.sessions} sessions completed</div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="text-right text-sm text-slate-600 mt-1">{goal.progress}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/find-mentors"
                  className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5" />
                    <span>Find New Mentors</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/mentee-resources"
                  className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors w-full"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5" />
                    <span>Browse Resources</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Recommended Mentors */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recommended for You</h3>

              {loading ? (
                <div className="text-center py-4 text-slate-500 text-sm">Loading recommendations...</div>
              ) : (
                <div className="space-y-4">
                  {recommendedMentors.map((mentor, index: number) => (
                    <Link
                      key={mentor.id}
                      to={`/mentor/${mentor.id}`}
                      state={{ mentor }}
                      className="block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all bg-white"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={imageUrls[index]}
                          alt={mentor.name}
                          className="w-12 h-12 rounded-full object-cover bg-slate-100"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 text-sm">{mentor.name}</div>
                          <div className="text-xs text-slate-600">{mentor.title}</div>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                            {mentor.matchScore}% match
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{mentor.rating}</span>
                        <span>•</span>
                        <span>{mentor.sessions} sessions</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                to="/find-mentors"
                className="block mt-4 text-center text-blue-600 text-sm font-medium hover:underline"
              >
                View all mentors →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
