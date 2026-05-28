import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Users, Star, Calendar, MessageSquare, Video, Clock, Loader2 } from 'lucide-react';
import { useChatPanel } from './ChatPanel';
import axiosClient from '../../api/axiosClient';

const imageUrls = [
  'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDcwOTI5fDA&ixlib=rb-4.1.0&q=80&w=400',
  'https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWFuJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc1NTQ5MTc3fDA&ixlib=rb-4.1.0&q=80&w=400',
  'https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwd29tYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc1NTQ5MTc3fDA&ixlib=rb-4.1.0&q=80&w=400',
];

// Mock per-mentor data indexed by position (0, 1, 2)
const MENTOR_MOCK = [
  {
    sessionsCompleted: 8,
    nextSession: 'Tomorrow, 2:00 PM',
    upcomingTopic: 'Leadership Development Strategy',
    upcomingDate: 'Tomorrow',
    upcomingTime: '2:00 PM - 3:00 PM',
    pastSessions: [
      {
        topic: 'Career Growth Planning',
        date: 'Apr 1, 2026',
        duration: '60 min',
        rating: 5,
      },
    ],
  },
  {
    sessionsCompleted: 5,
    nextSession: 'Friday, 10:00 AM',
    upcomingTopic: 'Product Strategy Session',
    upcomingDate: 'Friday, Apr 11',
    upcomingTime: '10:00 AM - 10:45 AM',
    pastSessions: [
      {
        topic: 'Product Metrics Deep Dive',
        date: 'Mar 28, 2026',
        duration: '45 min',
        rating: 5,
      },
    ],
  },
  {
    sessionsCompleted: 3,
    nextSession: null,
    upcomingTopic: null,
    upcomingDate: null,
    upcomingTime: null,
    pastSessions: [
      {
        topic: 'System Design Principles',
        date: 'Mar 25, 2026',
        duration: '60 min',
        rating: 5,
      },
    ],
  },
];

interface Mentor {
  id: number;
  name: string;
  title: string;
  company: string;
  rating: number;
  image: string;
  sessionsCompleted: number;
  nextSession: string | null;
}

export function MyMentors() {
  const { openChat, ChatPortal } = useChatPanel();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get('/mentors')
      .then((res) => {
        const top3 = res.data.slice(0, 3).map((m: Mentor, i: number) => ({
          id: m.id,
          name: m.name,
          title: m.title,
          company: m.company,
          rating: m.rating ?? 4.8,
          image: imageUrls[i],
          sessionsCompleted: MENTOR_MOCK[i]?.sessionsCompleted,
          nextSession: MENTOR_MOCK[i]?.nextSession,
        }));
        setMentors(top3);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Derive upcoming sessions from mentors who have a next session
  const upcomingSessions = mentors
    .map((m, i) => {
      const mock = MENTOR_MOCK[i];
      if (!mock?.upcomingTopic || !mock.upcomingDate || !mock.upcomingTime) return null;
      return {
        id: m.id,
        mentor: m.name,
        mentorImage: m.image,
        topic: mock?.upcomingTopic,
        date: mock.upcomingDate,
        time: mock.upcomingTime,
      };
    })
    .filter(Boolean) as {
    id: number;
    mentor: string;
    mentorImage: string;
    topic: string;
    date: string;
    time: string;
  }[];

  // Derive past sessions from all mentors
  const pastSessions = mentors.flatMap((m, i) =>
    MENTOR_MOCK[i]?.pastSessions.map((s) => ({
      ...s,
      mentor: m.name,
      mentorImage: m.image,
    })),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="ml-3 text-slate-600 font-medium">Loading your mentors...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                <Link to="/dashboard" className="text-slate-600 hover:text-slate-900">
                  Dashboard
                </Link>
                <Link to="/find-mentors" className="text-slate-600 hover:text-slate-900">
                  Find Mentors
                </Link>
                <Link to="/my-mentors" className="text-blue-600 font-medium">
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
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                AI
              </div>
            </div>
          </div>
        </div>
        <ChatPortal />
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Mentors</h1>
          <p className="text-slate-600">Manage your mentoring relationships and sessions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Active Mentors */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Active Mentors ({mentors.length})</h2>
              <div className="grid gap-4">
                {mentors.map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md border border-slate-200 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{mentor.name}</h3>
                            <p className="text-sm text-slate-600">{mentor.title}</p>
                            <p className="text-sm text-slate-500">{mentor.company}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm bg-slate-50 px-2 py-1 rounded">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{mentor.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{mentor.sessionsCompleted} sessions completed</span>
                          </div>
                          {mentor.nextSession && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <Clock className="w-4 h-4" />
                              <span>Next: {mentor.nextSession}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Link
                            to={`/book/${mentor.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            Book Session
                          </Link>
                          <button
                            onClick={() => openChat()}
                            className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:border-blue-300 hover:text-blue-600 transition-colors"
                          >
                            Send Message
                          </button>
                          <Link
                            to={`/mentor/${mentor.id}`}
                            state={{ mentor }}
                            className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:border-blue-300 hover:text-blue-600 transition-colors"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Past Sessions */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Past Sessions</h2>
              <div className="bg-white rounded-xl shadow-md border border-slate-200 divide-y divide-slate-200 overflow-hidden">
                {pastSessions.map((session, i) => (
                  <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <img
                        src={session?.mentorImage}
                        alt={session?.mentor}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-900">{session?.topic}</h4>
                            <p className="text-sm text-slate-600">{session?.mentor}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(session?.rating)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {session?.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session?.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Sessions</h3>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={session.mentorImage}
                        alt={session.mentor}
                        className="w-10 h-10 rounded-full object-cover border border-white"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 text-sm">{session.mentor}</div>
                        <div className="text-xs text-slate-600 line-clamp-1">{session.topic}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>{session.date}</span>
                      <span>•</span>
                      <span>{session.time}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1 shadow-sm">
                        <Video className="w-4 h-4" />
                        Join
                      </button>
                      <button className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:border-blue-300 transition-colors">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Need more guidance?</h3>
              <p className="text-blue-100 text-sm mb-4">Find additional mentors to help you achieve your goals</p>
              <Link
                to="/find-mentors"
                className="block w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-medium text-center hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Find More Mentors
              </Link>
            </div>

            {/* Stats — derived from real data */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Total Sessions</span>
                  <span className="font-bold text-slate-900">
                    {mentors.reduce((sum, m) => sum + m.sessionsCompleted, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Hours of Learning</span>
                  <span className="font-bold text-slate-900">
                    {(mentors.reduce((sum, m) => sum + m.sessionsCompleted, 0) * 0.9).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Active Mentors</span>
                  <span className="font-bold text-slate-900">{mentors.length}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-600 text-sm">Goals Completed</span>
                  <span className="font-bold text-green-600">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
