import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  Target,
  BookOpen,
  Award,
  Video,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Zap,
  Loader2,
} from 'lucide-react';
import { useChatPanel } from './ChatPanel';
import { LogoutButton } from './LogoutButton';
import axiosClient from '../../api/axiosClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionStatus = 'completed' | 'upcoming' | 'cancelled';

interface Session {
  id: number;
  topic: string;
  date: string;
  duration: string;
  status: SessionStatus;
  notes?: string;
}

interface Skill {
  name: string;
  current: number;
  target: number;
}

interface Mentee {
  id: number;
  name: string;
  image: string;
  title: string;
  company: string;
  goal: string;
  overallProgress: number;
  sessionsCompleted: number;
  totalSessions: number;
  nextSession: string | null;
  joinedDate: string;
  status: 'active' | 'on-track' | 'needs-attention';
  rating: number;
  reviewCount: number;
  skills: Skill[];
  recentSessions: Session[];
  lastNote: string;
  email?: string;
  experienceLevel?: string;
  learningStyle?: string;
  availability?: string;
  goals?: string[];
}

interface MenteeResponse {
  id: number;
  name: string;
  email: string;
  title: string;
  company: string;
  rating?: number;
  reviewCount?: number;
  experienceLevel?: string;
  learningStyle?: string;
  availability?: string;
  goals?: string[];
}

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

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Mentee['status'] }) {
  const map = {
    'on-track': {
      label: 'On track',
      icon: CheckCircle,
      cls: 'bg-green-50 text-green-700 border-green-200',
    },
    active: {
      label: 'Active',
      icon: Zap,
      cls: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    'needs-attention': {
      label: 'Needs attention',
      icon: AlertCircle,
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  };
  const { label, icon: Icon, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-600">{skill.name}</span>
        <span className="text-xs text-slate-500">
          <span className="font-semibold text-slate-800">{skill.current}%</span>
          <span className="text-slate-400"> / {skill.target}%</span>
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        {/* target ghost bar */}
        <div className="h-full bg-indigo-100 rounded-full absolute" style={{ width: `${skill.target}%` }} />
        <motion.div
          className="h-full bg-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${skill.current}%` }}
          transition={{ duration: 0.7, delay }}
        />
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: Session }) {
  const statusMap: Record<SessionStatus, { cls: string; label: string }> = {
    completed: { cls: 'bg-green-100 text-green-700', label: 'Done' },
    upcoming: { cls: 'bg-blue-100 text-blue-700', label: 'Upcoming' },
    cancelled: { cls: 'bg-slate-100 text-slate-500', label: 'Cancelled' },
  };
  const { cls, label } = statusMap[session.status];
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
        {session.status === 'completed' ? (
          <CheckCircle className="w-3 h-3 text-indigo-600" />
        ) : (
          <Clock className="w-3 h-3 text-indigo-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-slate-800 truncate">{session.topic}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${cls}`}>{label}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{session.date}</span>
          <span>·</span>
          <span>{session.duration}</span>
        </div>
        {session.notes && <p className="text-xs text-slate-500 mt-1 italic">"{session.notes}"</p>}
      </div>
    </div>
  );
}

function MenteeCard({ mentee, openChat }: { mentee: Mentee; openChat: () => void }) {
  const [expanded] = useState(false);

  const progressColor =
    mentee.overallProgress >= 70 ? 'bg-green-500' : mentee.overallProgress >= 40 ? 'bg-indigo-500' : 'bg-amber-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
    >
      {/* ── Card header ── */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={mentee.image}
              alt={mentee.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-slate-100"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                mentee.status === 'needs-attention' ? 'bg-amber-400' : 'bg-green-400'
              }`}
            />
          </div>

          {/* Name / role */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">{mentee.name}</h3>
                <p className="text-sm text-slate-500 truncate">
                  {mentee.title} · {mentee.company}
                </p>
              </div>
              <StatusBadge status={mentee.status} />
            </div>

            {/* Goal */}
            <div className="flex items-center gap-1.5 mt-2">
              <Target className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="text-xs text-slate-600 font-medium truncate">{mentee.goal}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500">Overall progress</span>
            <span className="text-xs font-bold text-slate-700">{mentee.overallProgress}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${progressColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${mentee.overallProgress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-slate-900">
              {mentee.sessionsCompleted}
              <span className="text-xs text-slate-400 font-normal">/{mentee.totalSessions}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Sessions</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-slate-900 flex items-center justify-center gap-0.5">
              {mentee.rating}
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mb-0.5" />
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Rating</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <div className="text-xs font-bold text-slate-900 leading-tight mt-0.5">
              {mentee.nextSession ? mentee.nextSession.split(',')[0] : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Next session</div>
          </div>
        </div>

        {/* Mentor note */}
        {mentee.lastNote && (
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-700">Your note</span>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed">{mentee.lastNote}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {mentee.nextSession ? (
            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
              <Video className="w-4 h-4" />
              Join session
            </button>
          ) : (
            <Link
              to={`/book/${mentee.id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Book session
            </Link>
          )}

          <button
            onClick={openChat}
            className="flex items-center gap-1.5 px-3.5 py-2 border-2 border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </button>

          <Link
            to={`/mentee/${mentee.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 border-2 border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <Users className="w-4 h-4" />
            View profile
          </Link>

          {/*<button
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto flex items-center gap-1 px-3 py-2 text-slate-500 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            {expanded ? (
              <>
                Hide details <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                More details <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>*/}
        </div>
      </div>

      {/* ── Expanded panel ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50/60">
              {/* Skills */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  Skill development
                </h4>
                <div className="space-y-3 relative">
                  {mentee.skills.map((skill, i) => (
                    <SkillBar key={skill.name} skill={skill} delay={i * 0.1} />
                  ))}
                </div>
              </div>

              {/* Session history */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Session history
                </h4>
                <div className="bg-white rounded-xl border border-slate-200 px-4 py-2">
                  {mentee.recentSessions.map((s) => (
                    <SessionRow key={s.id} session={s} />
                  ))}
                </div>
              </div>
            </div>

            {/* Update progress CTA */}
            <div className="px-6 pb-5 bg-slate-50/60">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-50 transition-colors">
                <Award className="w-4 h-4" />
                Update {mentee.name.split(' ')[0]}'s progress after session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────

export function MyMentees() {
  const { openChat, ChatPortal } = useChatPanel();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Mentee['status']>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get('/mentees')
      .then((res) => {
        const menteesWithImages = res.data.map((m: MenteeResponse, i: number) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          title: m.title,
          company: m.company,
          image: imageUrls[i],
          rating: m.rating ?? 4.5,
          reviewCount: m.reviewCount ?? 0,
          experienceLevel: m.experienceLevel,
          learningStyle: m.learningStyle,
          availability: m.availability,
          goals: m.goals,
          // Mock data for demo
          goal: m.goals?.[0] || 'Personal Development',
          overallProgress: 60,
          sessionsCompleted: 3,
          totalSessions: 6,
          nextSession: 'Coming Soon',
          joinedDate: 'Apr 1, 2026',
          status: 'active' as const,
          skills: [],
          recentSessions: [],
          lastNote: 'Great progress!',
        }));
        setMentees(menteesWithImages);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filtered = mentees.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) || m.goal.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalSessions = mentees.reduce((a, m) => a + m.sessionsCompleted, 0);
  const avgProgress =
    mentees.length > 0 ? Math.round(mentees.reduce((a, m) => a + m.overallProgress, 0) / mentees.length) : 0;
  const needsAttention = mentees.filter((m) => m.status === 'needs-attention').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="ml-3 text-slate-600 font-medium">Loading your mentees...</span>
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
                <Link to="/mentor-dashboard" className="text-slate-600 hover:text-slate-900">
                  Dashboard
                </Link>
                <Link to="/my-mentees" className="text-indigo-600 font-medium">
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
                SC
              </div>
            </div>
          </div>
          <ChatPortal />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">My Mentees</h1>
            <p className="text-slate-600">Track each mentee's progress toward their goals</p>
          </div>
          <Link
            to="/mentor-dashboard"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
          >
            Review new requests
          </Link>
        </div>

        {/* ── Summary stats ── */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Active mentees',
              value: mentees.length,
              icon: Users,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
            },
            {
              label: 'Total sessions',
              value: totalSessions,
              icon: Calendar,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'Avg. progress',
              value: `${avgProgress}%`,
              icon: TrendingUp,
              color: 'text-green-600',
              bg: 'bg-green-50',
            },
            {
              label: 'Need attention',
              value: needsAttention,
              icon: AlertCircle,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
            },
          ].map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4"
            >
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Search & filter ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mentees or goals…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {(['all', 'on-track', 'active', 'needs-attention'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                {f === 'all' ? 'All' : f === 'on-track' ? 'On track' : f === 'active' ? 'Active' : 'Needs attention'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mentee cards ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No mentees match your search</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filtered.map((mentee) => (
              <MenteeCard key={mentee.id} mentee={mentee} openChat={openChat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
