import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Target, TrendingUp, Award, Calendar, CheckCircle, MessageSquare } from 'lucide-react';
import { useChatPanel } from './ChatPanel';

export function Progress() {
  const { openChat, ChatPortal } = useChatPanel();

  const goals = [
    {
      id: 1,
      name: 'Leadership Development',
      progress: 65,
      sessions: 8,
      target: 12,
      mentor: 'Dr. Sarah Chen',
      status: 'on-track',
      milestones: [
        { name: 'Communication Skills', completed: true },
        { name: 'Team Management', completed: true },
        { name: 'Strategic Thinking', completed: false },
        { name: 'Decision Making', completed: false },
      ],
    },
    {
      id: 2,
      name: 'Technical Skills',
      progress: 45,
      sessions: 5,
      target: 10,
      mentor: 'James Park',
      status: 'on-track',
      milestones: [
        { name: 'System Design Basics', completed: true },
        { name: 'Architecture Patterns', completed: true },
        { name: 'Scalability', completed: false },
        { name: 'Performance Optimization', completed: false },
      ],
    },
    {
      id: 3,
      name: 'Product Strategy',
      progress: 80,
      sessions: 10,
      target: 12,
      mentor: 'Marcus Williams',
      status: 'ahead',
      milestones: [
        { name: 'Market Analysis', completed: true },
        { name: 'User Research', completed: true },
        { name: 'Roadmap Planning', completed: true },
        { name: 'Metrics & KPIs', completed: false },
      ],
    },
  ];

  const achievements = [
    {
      name: 'First Session',
      icon: '🎯',
      date: 'Jan 15, 2026',
      description: 'Completed your first mentoring session',
    },
    {
      name: '10 Sessions',
      icon: '🏆',
      date: 'Feb 28, 2026',
      description: 'Reached 10 mentoring sessions',
    },
    {
      name: 'Goal Achiever',
      icon: '⭐',
      date: 'Mar 20, 2026',
      description: 'Completed your first learning goal',
    },
    {
      name: 'Consistent Learner',
      icon: '🔥',
      date: 'Apr 1, 2026',
      description: '4 weeks streak of weekly sessions',
    },
  ];

  const learningPath = [
    { month: 'Jan', sessions: 3, hours: 2.5 },
    { month: 'Feb', sessions: 5, hours: 4.0 },
    { month: 'Mar', sessions: 8, hours: 6.5 },
    { month: 'Apr', sessions: 7, hours: 5.5 },
  ];

  const skills = [
    { name: 'Leadership', level: 65, improvement: '+15%' },
    { name: 'Communication', level: 80, improvement: '+20%' },
    { name: 'Technical', level: 45, improvement: '+25%' },
    { name: 'Strategy', level: 75, improvement: '+18%' },
    { name: 'Team Building', level: 55, improvement: '+12%' },
  ];

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
                <Link to="/my-mentors" className="text-slate-600 hover:text-slate-900">
                  My Mentors
                </Link>
                <Link to="/progress" className="text-blue-600 font-medium">
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
                JD
              </div>
            </div>
          </div>
        </div>
        <ChatPortal />
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Progress</h1>
          <p className="text-slate-600">Track your learning journey and achievements</p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Overall Progress</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">63%</div>
            <div className="text-sm text-green-600">+12% this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Active Goals</span>
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">3</div>
            <div className="text-sm text-slate-600">In progress</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Sessions</span>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">23</div>
            <div className="text-sm text-green-600">7 this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-md border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Achievements</span>
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{achievements.length}</div>
            <div className="text-sm text-slate-600">Unlocked</div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Goals */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Goals</h2>
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md border border-slate-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{goal.name}</h3>
                        <p className="text-sm text-slate-600">Mentor: {goal.mentor}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          goal.status === 'ahead' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {goal.status === 'ahead' ? 'Ahead of schedule' : 'On track'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Progress</span>
                        <span className="text-sm font-semibold text-slate-900">{goal.progress}%</span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Sessions */}
                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {goal.sessions} of {goal.target} sessions completed
                        </span>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-3">Milestones</div>
                      <div className="grid grid-cols-2 gap-2">
                        {goal.milestones.map((milestone, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 p-2 rounded-lg border ${
                              milestone.completed
                                ? 'bg-green-50 border-green-100 text-green-700'
                                : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}
                          >
                            <CheckCircle
                              className={`w-4 h-4 ${milestone.completed ? 'text-green-600' : 'text-slate-400'}`}
                            />
                            <span className="text-sm">{milestone.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Learning Path Chart */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Learning Journey</h3>
              <div className="space-y-4">
                {learningPath.map((month, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">{month.month} 2026</span>
                      <div className="text-sm text-slate-600">
                        {month.sessions} sessions • {month.hours}h
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(month.sessions / 10) * 100}%` }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skill Development */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Skill Development</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600 font-medium">{skill.improvement}</span>
                        <span className="text-sm text-slate-600">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-sm"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-sm">{achievement.name}</div>
                      <div className="text-xs text-slate-600 mb-1">{achievement.description}</div>
                      <div className="text-xs text-slate-500">{achievement.date}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <Target className="w-10 h-10 mb-4" />
              <h3 className="text-lg font-bold mb-2">Set New Goals</h3>
              <p className="text-blue-100 text-sm mb-4">Keep growing! Add new learning objectives to your journey.</p>
              <Link
                to="/find-mentors"
                className="block w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-medium text-center hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Find a Mentor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
