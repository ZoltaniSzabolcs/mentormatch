import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Search, Star, MapPin, Briefcase, Loader2, MessageSquare } from 'lucide-react';

import { useChatPanel } from './ChatPanel';
import { LogoutButton } from './LogoutButton';
import axiosClient from '../../api/axiosClient';
import { computeMatchScore } from './utils/computeMatchScore';

interface MenteeData {
  id: number;
  goals: string[];
  learningStyle: string;
  availability: string;
  experienceLevel: string;
}

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

export function FindMentors() {
  const { openChat, ChatPortal } = useChatPanel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: 'all', label: 'All Mentors' },
    { id: 'high-match', label: 'Top Matches' },
    { id: 'available', label: 'Available This Week' },
    { id: 'popular', label: 'Most Popular' },
  ];

  const imageUrls = [
    'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDcwOTI5fDA&ixlib=rb-4.1.0&q=80&w=400',
    'https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWFuJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc1NTQ5MTc3fDA&ixlib=rb-4.1.0&q=80&w=400',
    'https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwd29tYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc1NTQ5MTc3fDA&ixlib=rb-4.1.0&q=80&w=400',
    'https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTU0OTA0OXww&ixlib=rb-4.1.0&q=80&w=400',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3J8ZW58MXx8fHwxNzc1NTQ5MTc3fDA&ixlib=rb-4.1.0&q=80&w=400',
    // man
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    // man
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    // man
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    // woman
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    // woman
    'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
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
        console.log('GET /mentees/me result:', menteeRes.data);
        const menteeData: MenteeData = {
          id: menteeRes.data.id,
          goals: menteeRes.data.goals || [],
          learningStyle: menteeRes.data.learningStyle || '',
          availability: menteeRes.data.availability || '',
          experienceLevel: menteeRes.data.experienceLevel || 'Intermediate',
        };

        const populatedData = mentorsRes.data.map((m, index: number) => {
          const mentorObj: Mentor = {
            id: m.id,
            name: m.name,
            title: m.title,
            company: m.company,
            rating: m.rating || 4.8,
            sessions: m.reviewCount || 15,
            bio: m.profileBio || 'Experienced professional passionate about mentoring.',
            expertise: m.skills || [],
            image: imageUrls[index % imageUrls.length] || '',
            matchScore: 0,
            location: 'Cluj-Napoca, RO',
            availability: 'Available this week',
          };

          mentorObj.matchScore = computeMatchScore(mentorObj, menteeData);
          return mentorObj;
        });

        setMentors(populatedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const query = (searchQuery || '').toLowerCase().trim();

      const name = (mentor.name || '').toLowerCase();
      const title = (mentor.title || '').toLowerCase();
      const company = (mentor.company || '').toLowerCase();
      const expertiseMatch = Array.isArray(mentor.expertise)
        ? mentor.expertise.some((skill) => (skill || '').toLowerCase().includes(query))
        : false;

      const matchesSearch = name.includes(query) || title.includes(query) || company.includes(query) || expertiseMatch;

      let matchesTab = true;
      if (selectedFilter === 'high-match') {
        matchesTab = (mentor.matchScore || 0) >= 90;
      } else if (selectedFilter === 'available') {
        matchesTab = (mentor.availability || '') === 'Available this week';
      } else if (selectedFilter === 'popular') {
        matchesTab = (mentor.sessions || 0) >= 15 || (mentor.rating || 0) >= 4.9;
      }

      return matchesSearch && matchesTab;
    });
  }, [mentors, searchQuery, selectedFilter]);

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
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-600 hover:text-slate-900">
                  Dashboard
                </Link>
                <Link to="/find-mentors" className="text-blue-600 font-medium">
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
                AI
              </div>
            </div>
          </div>
        </div>
        <ChatPortal />
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Your Perfect Mentor</h1>
          <p className="text-slate-600">Discover experienced professionals matched to your goals and learning style</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, expertise, or company..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-300 shadow-sm'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredMentors.length}</span> mentors
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <span className="ml-3 text-slate-600 font-medium">Finding the best mentors...</span>
          </div>
        )}

        {!loading && filteredMentors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No mentors match your search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="mt-2 text-blue-600 hover:underline text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/mentor/${mentor.id}`}
                  state={{ mentor }}
                  className="block bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all"
                >
                  <div className="relative">
                    <img src={mentor.image} alt={mentor.name} className="w-full h-48 object-cover bg-slate-100" />
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-sm font-semibold shadow-sm ${
                        (() => {
                          if (mentor.matchScore >= 90) return 'bg-green-500';
                          if (mentor.matchScore >= 75) return 'bg-blue-500';
                          return 'bg-slate-500';
                        })()
                      }`}
                    >
                      {mentor.matchScore}% Match
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{mentor.name}</h3>
                    <p className="text-sm text-slate-600 mb-1">{mentor.title}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{mentor.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{mentor.location.split(',')[0]}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-3 line-clamp-2 italic">"{mentor.bio}"</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.slice(0, 2).map((skill, idx) => (
                        <span
                          key={`${skill}-${idx}`}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100"
                        >
                          {skill}
                        </span>
                      ))}
                      {mentor.expertise.length > 2 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                          +{mentor.expertise.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-slate-900">{mentor.rating}</span>
                        <span className="text-slate-600">({mentor.sessions})</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                        {mentor.availability}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}