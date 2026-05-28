import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  ArrowLeft,
  Target,
  Brain,
  Calendar,
  Clock,
  CheckCircle,
  User,
  Mail,
  Sparkles,
  BookOpen,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { LogoutButton } from './LogoutButton';

const imageUrls = [
  'https://images.unsplash.com/photo-1706025090996-63717544be2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', //man
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', //man
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', //woman
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // man
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // woman
  'https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // man
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // woman
  'https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // man
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // woman
  'https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', // man
];

interface Mentee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  experienceLevel: string;
  bio: string;
  learningGoals: string[];
  customGoals: string[];
  learningStyle: {
    type: string;
    description: string;
  };
  availability: string[];
  mentorshipPreferences: {
    sessionFrequency: string;
    preferredSessionType: string;
    commitmentLevel: string;
  };
  progress: {
    completedSessions: number;
    activeGoals: number;
    mentorshipStreak: string;
  };
  interests: string[];
}

export function MenteeProfile() {
  const { id } = useParams<{ id: string }>();
  const [mentee, setMentee] = useState<Mentee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Mentee ID not found');
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/mentees/${id}`)
      .then((res) => {
        const menteeData = {
          ...res.data,
          image: imageUrls[res.data.id - 6],
          email: res.data.email || 'email@example.com',
          experienceLevel: res.data.experienceLevel || 'Intermediate',
          bio: 'Mentee working towards their professional goals.',
          learningGoals: res.data.goals || ['Professional Development'],
          customGoals: ['Improve skills', 'Achieve goals'],
          learningStyle: {
            type: res.data.learningStyle || 'Hands-on',
            description: 'Practical learning through real-world projects.',
          },
          availability: res.data.availability ? [res.data.availability] : ['Weekday Evenings'],
          mentorshipPreferences: {
            sessionFrequency: 'Bi-weekly',
            preferredSessionType: 'Video Calls',
            commitmentLevel: '6+ months',
          },
          progress: {
            completedSessions: 8,
            activeGoals: res.data.goals?.length || 3,
            mentorshipStreak: '3 months',
          },
          interests: res.data.goals || [],
        };
        setMentee(menteeData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load mentee profile');
        setLoading(false);
      });
  }, [id]);

  const experienceColors = {
    Beginner: 'bg-green-100 text-green-700 border-green-200',
    Intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
    Advanced: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="ml-3 text-slate-600 font-medium">Loading mentee profile...</span>
      </div>
    );
  }

  if (error || !mentee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-slate-600 font-medium mb-4">{error || 'Mentee not found'}</p>
          <Link to="/my-mentees" className="text-blue-600 hover:text-blue-700">
            Back to My Mentees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-slate-900">MentorMatch</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <LogoutButton className="text-slate-600 hover:text-slate-900" />
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                ER
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/my-mentees" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to My Mentees
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600" />

              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <img
                    src={mentee.image}
                    alt={`${mentee.firstName} ${mentee.lastName}`}
                    className="w-32 h-32 -mt-16 shrink-0 rounded-xl object-cover border-4 border-white shadow-lg"
                  />

                  <div className="flex-1 pt-0 sm:pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                          {mentee.firstName} {mentee.lastName}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{mentee.email}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Mentee</span>
                          </div>
                        </div>

                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${
                            experienceColors[mentee.experienceLevel as keyof typeof experienceColors]
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          {mentee.experienceLevel} Level
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-slate-900">{mentee.progress.completedSessions}</div>
                        <div className="text-sm text-slate-600">Sessions Completed</div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-slate-900">{mentee.progress.activeGoals}</div>
                        <div className="text-sm text-slate-600">Active Goals</div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-slate-900">{mentee.progress.mentorshipStreak}</div>
                        <div className="text-sm text-slate-600">Learning Streak</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>

              <p className="text-slate-600 leading-relaxed">{mentee.bio}</p>
            </motion.div>

            {/* Learning Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />

                <h2 className="text-xl font-bold text-slate-900">Learning Goals</h2>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {mentee.learningGoals.map((goal: string, index: number) => (
                  <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                    {goal}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Custom Goals</h3>

                <div className="space-y-3">
                  {mentee.customGoals.map((goal: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />

                      <span className="text-slate-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Learning Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-600" />

                <h2 className="text-xl font-bold text-slate-900">Learning Style</h2>
              </div>

              <div className="border border-indigo-100 bg-indigo-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-indigo-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{mentee.learningStyle.type}</h3>

                    <p className="text-sm text-slate-600">Preferred mentorship approach</p>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed">{mentee.learningStyle.description}</p>
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-cyan-600" />

                <h2 className="text-xl font-bold text-slate-900">Interests & Focus Areas</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {mentee.interests.map((interest: string, index: number) => (
                  <span key={index} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Mentorship Preferences</h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />

                  <div>
                    <div className="font-medium text-slate-900">Session Frequency</div>

                    <div className="text-sm text-slate-600">{mentee.mentorshipPreferences.sessionFrequency}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />

                  <div>
                    <div className="font-medium text-slate-900">Preferred Format</div>

                    <div className="text-sm text-slate-600">{mentee.mentorshipPreferences.preferredSessionType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />

                  <div>
                    <div className="font-medium text-slate-900">Commitment</div>

                    <div className="text-sm text-slate-600">{mentee.mentorshipPreferences.commitmentLevel}</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-indigo-600" />

                  <h3 className="font-semibold text-slate-900">Availability</h3>
                </div>

                <div className="space-y-3">
                  {mentee.availability.map((slot: string, index: number) => (
                    <div key={index} className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-sm font-medium text-slate-700">{slot}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
