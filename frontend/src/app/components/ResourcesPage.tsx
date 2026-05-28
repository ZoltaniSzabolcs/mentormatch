import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Users,
  Upload,
  Search,
  Filter,
  FileText,
  Video,
  Link as LinkIcon,
  BookOpen,
  Send,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Plus,
  Calendar,
  User,
  Tag,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { useChatPanel } from './ChatPanel';
import { LogoutButton } from './LogoutButton';

export function ResourcesPage() {
  const [selectedTab, setSelectedTab] = useState('library');

  const { openChat, ChatPortal } = useChatPanel();

  const resources = [
    {
      id: 1,
      title: 'Leadership Fundamentals for First-Time Managers',
      type: 'PDF Guide',
      category: 'Leadership Development',
      uploadedBy: 'Dr. Sarah Chen',
      uploadDate: '2 days ago',
      assignedTo: 12,
      size: '4.2 MB',
      status: 'Published',
      icon: FileText,
      color: 'text-red-600 bg-red-100',
    },
    {
      id: 2,
      title: 'Product Strategy Workshop Recording',
      type: 'Video',
      category: 'Product Management',
      uploadedBy: 'Michael Foster',
      uploadDate: '1 week ago',
      assignedTo: 8,
      size: '128 MB',
      status: 'Published',
      icon: Video,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      id: 3,
      title: 'AI Career Transition Roadmap',
      type: 'Resource Link',
      category: 'AI & Machine Learning',
      uploadedBy: 'Lisa Wong',
      uploadDate: '5 days ago',
      assignedTo: 15,
      size: 'External',
      status: 'Draft',
      icon: LinkIcon,
      color: 'text-green-600 bg-green-100',
    },
  ];

  const assignments = [
    {
      mentee: 'Emily Rodriguez',
      resource: 'Leadership Fundamentals for First-Time Managers',
      assignedDate: 'Today',
      progress: 75,
      dueDate: 'May 25',
      status: 'In Progress',
    },
    {
      mentee: 'James Wilson',
      resource: 'Product Strategy Workshop Recording',
      assignedDate: 'Yesterday',
      progress: 100,
      dueDate: 'May 20',
      status: 'Completed',
    },
    {
      mentee: 'Sophia Martinez',
      resource: 'AI Career Transition Roadmap',
      assignedDate: '3 days ago',
      progress: 20,
      dueDate: 'May 30',
      status: 'Started',
    },
  ];

  const categories = [
    'Leadership Development',
    'Career Transition',
    'Technical Skills',
    'Communication Skills',
    'Data Analysis',
    'Project Management',
    'Public Speaking',
    'AI & Machine Learning',
    'Product Management',
    'Entrepreneurship',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
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
                <Link to="/my-mentees" className="text-slate-600 hover:text-slate-900">
                  My Mentees
                </Link>
                <Link to="/resources" className="text-indigo-600 font-medium">
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Learning Resources</h1>

            <p className="text-slate-600 text-lg">Upload, organize, and assign educational content to mentees.</p>
          </div>

          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Upload className="w-5 h-5" />
            Upload Resource
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Resources',
              value: '48',
              icon: BookOpen,
            },
            {
              label: 'Assigned Resources',
              value: '126',
              icon: Send,
            },
            {
              label: 'Completed Assignments',
              value: '84',
              icon: CheckCircle,
            },
            {
              label: 'Pending Reviews',
              value: '12',
              icon: Clock,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'library', label: 'Resource Library' },
            { id: 'assignments', label: 'Assignments' },
            { id: 'upload', label: 'Upload Center' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resource Library */}
        {selectedTab === 'library' && (
          <div className="space-y-6">
            {/* Search & Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50">
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
              </div>
            </div>

            {/* Resource Cards */}
            <div className="grid gap-6">
              {resources.map((resource, index) => (
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
                              resource.status === 'Published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {resource.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            {resource.category}
                          </div>

                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {resource.uploadedBy}
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {resource.uploadDate}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700">{resource.type}</span>

                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700">{resource.size}</span>

                          <span className="px-3 py-1 bg-blue-50 rounded-lg text-blue-700 font-medium">
                            Assigned to {resource.assignedTo} mentees
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50">
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>

                      <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50">
                        <Download className="w-4 h-4" />
                        Download
                      </button>

                      <button className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                        <Send className="w-4 h-4" />
                        Assign
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments */}
        {selectedTab === 'assignments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Resource Assignments</h2>

              <p className="text-slate-600 mt-1">Track mentee progress across assigned learning materials.</p>
            </div>

            <div className="divide-y divide-slate-200">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{assignment.mentee}</h3>

                      <p className="text-slate-600 mb-4">{assignment.resource}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span>Assigned: {assignment.assignedDate}</span>

                        <span>Due: {assignment.dueDate}</span>

                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            assignment.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : assignment.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </div>
                    </div>

                    <div className="min-w-[220px]">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Progress</span>

                        <span className="font-medium text-slate-900">{assignment.progress}%</span>
                      </div>

                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${assignment.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Center */}
        {selectedTab === 'upload' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Learning Resource</h2>

              <div className="space-y-6">
                {/* Upload Box */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-blue-400 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Drag & drop files here</h3>

                  <p className="text-slate-500 mb-4">Upload PDFs, videos, slides, worksheets, or external links.</p>

                  <button className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                    Browse Files
                  </button>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Resource Title</label>

                    <input
                      type="text"
                      placeholder="Enter resource title"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>

                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select category</option>

                      {categories.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>

                  <textarea
                    rows={5}
                    placeholder="Describe what mentees will learn from this resource..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                    Publish Resource
                  </button>

                  <button className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
                    Save Draft
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Supported Content</h3>

                <div className="space-y-4">
                  {[
                    'PDFs & Worksheets',
                    'Video Tutorials',
                    'External Links',
                    'Presentation Slides',
                    'Case Studies',
                    'Templates & Guides',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />

                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold mb-2">Build Learning Paths</h3>

                <p className="text-blue-100 leading-relaxed mb-6">
                  Combine multiple resources into guided mentorship journeys for your mentees.
                </p>

                <button className="w-full px-5 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                  Create Learning Path
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
