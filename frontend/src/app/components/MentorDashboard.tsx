import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  Video, 
  FileText, 
  Loader2 
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useChatPanel } from './ChatPanel';
import { LogoutButton } from './LogoutButton';

// --- Types ---
interface Mentee {
  id: number;
  name: string;
  title: string;
  company: string;
  image?: string;
}

interface SessionRequest {
  id: number;
  mentee: Mentee;
  topic: string;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  type: string;
  status: string;
  notes: string;
  isFirstSession: boolean;
}

export function MentorDashboard() {
  const navigate = useNavigate();
  const { openChat, ChatPortal } = useChatPanel();
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [mentorId, setMentorId] = useState<number | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token') ?? localStorage.getItem('token');
    const role = sessionStorage.getItem('role') ?? localStorage.getItem('role');
    
    const storedUserId = localStorage.getItem('userId') || localStorage.getItem('mentorId');

    if (!token) {
      console.warn('No auth token found — redirecting to login.');
      navigate('/login');
      setLoading(false);
      return;
    }

    if (role !== 'MENTOR') {
      console.warn('Authenticated user is not a mentor — redirecting to dashboard.');
      navigate('/dashboard');
      setLoading(false);
      return;
    }

    if (storedUserId) {
      setMentorId(Number(storedUserId));
    } else {
      console.warn("User ID not found in localStorage. Using fallback ID: 1.");
      setMentorId(1); 
    }
  }, [navigate]);

  useEffect(() => {
    if (mentorId !== null) {
      fetchPendingRequests(mentorId);
    }
  }, [mentorId]);

  const fetchPendingRequests = async (id: number) => {
    try {
      const token = sessionStorage.getItem('token') ?? localStorage.getItem('token');
      const response = await axiosClient.get(`/sessions/mentor/${id}/pending`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (sessionId: number, action: 'ACCEPTED' | 'DECLINED') => {
    setActionLoading(sessionId);
    try {
      const token = sessionStorage.getItem('token') ?? localStorage.getItem('token');
      await axiosClient.patch(`/sessions/${sessionId}/status?status=${action}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setRequests((prev) => prev.filter((req) => req.id !== sessionId));
    } catch (error) {
      console.error(`Failed to ${action.toLowerCase()} request`, error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="ml-3 text-slate-600 font-medium">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ── */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <span className="text-lg font-bold text-slate-900">MentorMatch</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/mentor-dashboard" className="text-indigo-600 font-medium">
                  Dashboard
                </Link>
                <Link to="/my-mentees" className="text-slate-600 hover:text-slate-900">
                  My Mentees
                </Link>
                <Link to="/resources" className="text-slate-600 hover:text-slate-900">
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
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                MM
              </div>
            </div>
          </div>
        </div>
        <ChatPortal />
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mentor Dashboard</h1>
          <p className="text-slate-600">Manage your mentoring sessions and incoming match requests.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Pending Match Requests</h2>
            <p className="text-sm text-slate-600 mt-1">Review and accept or decline incoming session requests from mentees.</p>
          </div>

          <div className="divide-y divide-slate-200">
            <AnimatePresence>
              {requests.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-8 text-center text-slate-500"
                >
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-400" />
                  No pending requests at the moment.
                </motion.div>
              ) : (
                requests.map((req) => (
                  <motion.div 
                    key={req.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 text-xl border-2 border-indigo-200">
                          {req.mentee?.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {req.mentee?.name || 'Unknown Mentee'}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3">
                            {req.mentee?.title} {req.mentee?.company ? `at ${req.mentee?.company}` : ''}
                          </p>
                          
                          <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              <span className="font-medium">{req.sessionDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-indigo-500" />
                              <span className="font-medium">{req.sessionTime} ({req.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-indigo-500" />
                              <span className="capitalize">{req.type || 'Video'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-500" />
                              <span className="truncate max-w-[200px]">{req.topic}</span>
                            </div>
                          </div>

                          {req.notes && (
                            <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg text-sm text-slate-700 italic">
                              "{req.notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 lg:flex-col lg:min-w-[140px] shrink-0">
                        <button
                          onClick={() => handleRequestAction(req.id, 'ACCEPTED')}
                          disabled={actionLoading === req.id}
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, 'DECLINED')}
                          disabled={actionLoading === req.id}
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 text-slate-500" />}
                          Decline
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
