import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  Search,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Clock,
  PlayCircle,
  Download,
  Filter,
  Brain,
  Trophy,
  ChevronRight,
  Calendar,
  Sparkles,
  PenTool,
  Target,
  MessageSquare,
  Mic,
  Book,
} from 'lucide-react';
import { useChatPanel } from './ChatPanel';

export function MenteeResourcesPage() {
  const { openChat, ChatPortal } = useChatPanel();

  const [selectedTab, setSelectedTab] = useState('all');

  const resources = [
    {
      id: 1,
      title: 'Leadership Fundamentals for First-Time Managers',
      type: 'PDF Guide',
      category: 'Leadership Development',
      mentor: 'Dr. Sarah Chen',
      progress: 75,
      dueDate: 'May 25',
      status: 'In Progress',
      icon: FileText,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 101,
      title: 'Atomic Habits',
      type: 'Book Recommendation',
      category: 'Personal Growth',
      mentor: 'System Recommended',
      progress: 0,
      dueDate: 'Self-paced',
      status: 'Not Started',
      icon: Book,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      id: 2,
      title: 'Product Strategy Workshop Recording',
      type: 'Video Lesson',
      category: 'Product Management',
      mentor: 'Michael Foster',
      progress: 100,
      dueDate: 'Completed',
      status: 'Completed',
      icon: Video,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 102,
      title: 'The Tim Ferriss Show: Mastery',
      type: 'Podcast',
      category: 'Productivity',
      mentor: 'Michael Foster',
      progress: 30,
      dueDate: 'June 5',
      status: 'In Progress',
      icon: Mic,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 3,
      title: 'AI Career Transition Roadmap',
      type: 'Interactive Exercise',
      category: 'AI & Machine Learning',
      mentor: 'Lisa Wong',
      progress: 20,
      dueDate: 'May 30',
      status: 'Assigned',
      icon: Brain,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 103,
      title: 'Project Management 101',
      type: 'Read Article',
      category: 'Management',
      mentor: 'Harvard Business Review',
      progress: 0,
      dueDate: 'May 28',
      status: 'Assigned',
      icon: FileText,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 4,
      title: 'Public Speaking Confidence Builder',
      type: 'Exercise Sheet',
      category: 'Communication Skills',
      mentor: 'Emma Brooks',
      progress: 45,
      dueDate: 'June 2',
      status: 'In Progress',
      icon: PenTool,
      color: 'bg-green-100 text-green-600',
    },
  ];

  const exercises = [
    {
      title: 'Leadership Reflection Exercise',
      mentor: 'Dr. Sarah Chen',
      difficulty: 'Intermediate',
      questions: 12,
      estimatedTime: '25 min',
      completed: false,
    },
    {
      title: 'AI Product Strategy Case Study',
      mentor: 'Lisa Wong',
      difficulty: 'Advanced',
      questions: 8,
      estimatedTime: '40 min',
      completed: false,
    },
    {
      title: 'Stakeholder Communication Quiz',
      mentor: 'Emma Brooks',
      difficulty: 'Beginner',
      questions: 15,
      estimatedTime: '20 min',
      completed: true,
    },
  ];

  // Szűrés logika
  const filteredResources = resources.filter((resource) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'assigned') return resource.status === 'Assigned' || resource.status === 'In Progress';
    if (selectedTab === 'completed') return resource.status === 'Completed';
    if (selectedTab === 'podcasts') return resource.type === 'Podcast';
    if (selectedTab === 'books') return resource.type === 'Book Recommendation';
    if (selectedTab === 'articles') return resource.type === 'Read Article' || resource.type === 'PDF Guide';
    return true;
  });

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
                <Link to="/find-mentors" className="text-slate-600 hover:text-slate-900">
                  Find Mentors
                </Link>
                <Link to="/my-mentors" className="text-slate-600 hover:text-slate-900">
                  My Mentors
                </Link>
                <Link to="/progress" className="text-slate-600 hover:text-slate-900">
                  Progress
                </Link>
                <Link to="/mentee-resources" className="text-blue-600 font-medium">
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
                JD
              </div>
            </div>
          </div>
        </div>
        <ChatPortal />
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Learning Resources</h1>
            <p className="text-slate-600 text-lg">Browse mentor-assigned resources and complete exercises.</p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 rounded-2xl border border-blue-100">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-slate-500">Current Learning Streak</div>
              <div className="font-semibold text-slate-900">12 Days Active</div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Assigned Resources', value: '18', icon: BookOpen },
            { label: 'Completed', value: '11', icon: CheckCircle },
            { label: 'Exercises Solved', value: '27', icon: Trophy },
            { label: 'Pending Tasks', value: '5', icon: Clock },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <Sparkles className="w-5 h-5 text-slate-300" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs - Frissítve: Bekerült az Articles is */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'assigned', label: 'Assigned' },
            { id: 'completed', label: 'Completed' },
            { id: 'exercises', label: 'Exercises' },
            { id: 'books', label: 'Books' },
            { id: 'podcasts', label: 'Podcasts' },
            { id: 'articles', label: 'Articles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your resources..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50">
              <Filter className="w-5 h-5" /> Filter
            </button>
          </div>
        </div>

        {/* Resources List */}
        {selectedTab !== 'exercises' && (
          <div className="grid gap-6 mb-10">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${resource.color}`}>
                      <resource.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-900">{resource.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            resource.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : resource.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {resource.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {resource.category}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {resource.mentor}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {resource.dueDate}
                        </div>
                        <div className="flex items-center gap-1 font-medium text-blue-600">{resource.type}</div>
                      </div>
                      <div className="w-full lg:w-80">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-slate-900">{resource.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${resource.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm">
                      {resource.type === 'Podcast' ? (
                        <Mic className="w-4 h-4" />
                      ) : resource.type.includes('Video') ? (
                        <PlayCircle className="w-4 h-4" />
                      ) : (
                        <BookOpen className="w-4 h-4" />
                      )}
                      {resource.type === 'Podcast'
                        ? 'Listen Now'
                        : resource.type.includes('Book')
                          ? 'Read Book'
                          : 'Open Resource'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Exercises Section */}
        {selectedTab === 'exercises' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{exercise.title}</h3>
                    <p className="text-slate-600">Assigned by {exercise.mentor}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${exercise.completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {exercise.completed ? 'Completed' : 'Active'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-sm text-slate-500 mb-1">Difficulty</div>
                    <div className="font-semibold text-slate-900">{exercise.difficulty}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-sm text-slate-500 mb-1">Questions</div>
                    <div className="font-semibold text-slate-900">{exercise.questions}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-sm text-slate-500 mb-1">Duration</div>
                    <div className="font-semibold text-slate-900">{exercise.estimatedTime}</div>
                  </div>
                </div>
                <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm">
                  {exercise.completed ? (
                    <>
                      <CheckCircle className="w-5 h-5" /> Review Answers
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-5 h-5" /> Start Exercise
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
