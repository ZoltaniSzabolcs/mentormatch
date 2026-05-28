import { Link, useParams, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  Users,
  ArrowLeft,
  Star,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  MessageSquare,
  Video,
  CheckCircle,
  Loader2,
  UserCircle,
} from 'lucide-react';

import { useChatPanel } from './ChatPanel';
import { LogoutButton } from './LogoutButton';

import axiosClient from '../../api/axiosClient';

interface MentorDetail {
  id: number;
  name: string;
  title: string;
  company: string;
  rating: number;
  reviewCount: number;
  profileBio: string;
  skills: string[];
  // UI-only fields not yet in DTO
  image?: string;
  location?: string;
  sessionsCompleted?: number;
  responseTime?: string;

  experiences: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: { degree: string; school: string; year: string }[];
  availability: { day: string; slotTime: string }[];
  reviews: {
    reviewerName: string;
    reviewerRole: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}

// Static fallback data for fields the backend doesn't serve yet
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDcwOTI5fDA&ixlib=rb-4.1.0&q=80&w=800';

export function MentorProfile() {
  const { id } = useParams();
  const location = useLocation();
  const { openChat, ChatPortal } = useChatPanel();

  // If navigating from FindMentors, state already has the mentor (avoids an extra request)
  const statementor = location.state?.mentor;

  const [mentor, setMentor] = useState<MentorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    axiosClient
      .get(`/mentors/${id}`)
      .then((res) => {
        setMentor({
          ...res.data,
          skills: res.data.skills ?? [],
          experiences: res.data.experiences ?? [],
          education: res.data.education ?? [],
          availability: res.data.availability ?? [],
          reviews: res.data.reviews ?? [],
        });
        setLoading(false);
      })
      .catch(() => {
        if (!statementor) setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="ml-3 text-slate-600 font-medium">Loading profile...</span>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-slate-600 text-lg">Mentor not found.</p>
        <Link to="/find-mentors" className="text-blue-600 hover:underline">
          ← Back to search
        </Link>
      </div>
    );
  }

  // Merge API data with UI-only mock fields
  const image = mentor.image ?? statementor?.image ?? FALLBACK_IMAGE;
  const location_ = mentor.location ?? statementor?.location ?? 'Cluj-Napoca, RO';
  const sessionsCompleted = mentor.sessionsCompleted ?? mentor.reviewCount;
  const responseTime = mentor.responseTime ?? 'Within 2 hours';

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-slate-900">MentorMatch</span>
            </Link>
            <div className="flex items-center gap-4">
              <LogoutButton className="text-slate-600 hover:text-slate-900" />
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                AI
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/find-mentors" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <img
                    src={image}
                    alt={mentor.name}
                    className="w-32 h-32 -mt-16 shrink-0 rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                  <div className="flex-1 pt-0 sm:pt-2">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">{mentor.name}</h1>
                    <p className="text-lg text-slate-600 mb-2">{mentor.title}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{mentor.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{location_}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-slate-900">{mentor.rating}</span>
                        <span className="text-slate-600">({mentor.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>{sessionsCompleted} sessions</span>
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
              <p className="text-slate-600 leading-relaxed">{mentor.profileBio}</p>
            </motion.div>

            {/* Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {(mentor.skills ?? []).map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Experience — mock until backend supports it */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Experience</h2>
              <div className="space-y-6">
                {mentor.experiences.map((exp, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                      <p className="text-sm text-slate-600">{exp.company}</p>
                      <p className="text-sm text-slate-500 mb-1">{exp.period}</p>
                      <p className="text-sm text-slate-600">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education — mock until backend supports it */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Education</h2>
              <div className="space-y-4">
                {mentor.education.map((edu, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                      <p className="text-sm text-slate-600">{edu.school}</p>
                      <p className="text-sm text-slate-500">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews — mock until backend supports it */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Reviews</h2>
              <div className="space-y-6">
                {mentor.reviews.map((review, i) => (
                  <div key={i} className="pb-6 border-b border-slate-200 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <UserCircle className="w-12 h-12 text-slate-400 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-slate-900">{review.reviewerName}</div>
                            <div className="text-sm text-slate-600">{review.reviewerRole}</div>
                          </div>
                          <div className="text-sm text-slate-500">{review.createdAt}</div>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-slate-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-slate-900 mb-2">Free</div>
                <p className="text-sm text-slate-600">Sessions offered on volunteer basis</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Video className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600">Video sessions available</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600">Responds {responseTime}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600">Flexible scheduling</span>
                </div>
              </div>

              <Link
                to={`/book/${id}`}
                className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition-colors mb-3"
              >
                Book a Session
              </Link>
              <button
                onClick={() => openChat()}
                className="w-full px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Send Message
              </button>
              <ChatPortal />

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Why mentees choose {mentor.name.split(' ')[0]}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Response rate</span>
                    <span className="font-semibold text-slate-900">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Avg. response time</span>
                    <span className="font-semibold text-slate-900">{responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Completion rate</span>
                    <span className="font-semibold text-slate-900">98%</span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Available slots</h3>
                <div className="space-y-3">
                  {Object.entries(
                    mentor.availability.reduce(
                      (acc, slot) => {
                        acc[slot.day] = [...(acc[slot.day] ?? []), slot.slotTime];
                        return acc;
                      },
                      {} as Record<string, string[]>,
                    ),
                  ).map(([day, slots], i) => (
                    <div key={i}>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-1">{day}</p>
                      <div className="flex flex-wrap gap-2">
                        {slots.map((slot, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
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
