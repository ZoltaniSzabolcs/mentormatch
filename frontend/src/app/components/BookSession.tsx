import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, ArrowLeft, Calendar, Clock, MessageSquare, Video } from 'lucide-react';

import axiosClient from '../../api/axiosClient';

export function BookSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('video');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const mentor = {
    name: 'Dr. Sarah Chen',
    title: 'Chief Technology Officer at Amazon',
    image:
      'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzc1NDcwOTI5fDA&ixlib=rb-4.1.0&q=80&w=400',
  };

  const availableDates = [
    { date: '2026-04-08', display: 'Tue, Apr 8' },
    { date: '2026-04-09', display: 'Wed, Apr 9' },
    { date: '2026-04-10', display: 'Thu, Apr 10' },
    { date: '2026-04-11', display: 'Fri, Apr 11' },
    { date: '2026-04-14', display: 'Mon, Apr 14' },
    { date: '2026-04-15', display: 'Tue, Apr 15' },
  ];

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const topics = [
    'Career Growth Strategy',
    'Leadership Development',
    'Technical Skills',
    'Interview Preparation',
    'General Advice',
    'Other',
  ];

  const handleBooking = async () => {
    const payload = {
      mentorId: Number(id), // Pulls the mentor ID from the /book/:id URL parameter
      menteeId: 6, // Hardcoded to 6 (Alex Ionescu) for the prototype demo
      sessionDate: selectedDate, // e.g., "2026-04-08"
      sessionTime: selectedTime, // e.g., "9:00 AM"
      sessionType: sessionType, // "video" or "chat"
      topic: topic, // e.g., "Career Growth Strategy"
      notes: notes,
    };

    try {
      await axiosClient.post('/sessions/book', payload);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

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
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/mentor/${id}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to profile
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
            >
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Book a Session</h1>
              <p className="text-slate-600 mb-8">Schedule a mentoring session with {mentor.name}</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Session Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSessionType('video')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        sessionType === 'video'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <Video className="w-5 h-5 text-blue-600 mb-2" />
                      <div className="font-semibold text-slate-900">Video Call</div>
                      <div className="text-sm text-slate-600">Face-to-face session</div>
                    </button>
                    <button
                      onClick={() => setSessionType('chat')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        sessionType === 'chat'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 text-blue-600 mb-2" />
                      <div className="font-semibold text-slate-900">Chat Only</div>
                      <div className="text-sm text-slate-600">Text-based session</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    What would you like to discuss?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {topics.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTopic(t)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          topic === t
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Select a Date</label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableDates.map((dateOption) => (
                      <button
                        key={dateOption.date}
                        onClick={() => setSelectedDate(dateOption.date)}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          selectedDate === dateOption.date
                            ? 'border-blue-600 bg-blue-50 shadow-inner'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-slate-900">{dateOption.display}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Select a Time</label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedTime === time
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Additional Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                    placeholder="Share any specific topics or questions you'd like to cover..."
                  />
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || !topic}
                  className={`w-full py-4 rounded-lg font-medium transition-all shadow-sm ${
                    selectedDate && selectedTime && topic
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-8"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Booking Summary</h3>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                <img src={mentor.image} alt={mentor.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-slate-900">{mentor.name}</div>
                  <div className="text-sm text-slate-600">{mentor.title}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Session Type</div>
                  <div className="font-medium text-slate-900">
                    {sessionType === 'video' ? 'Video Call' : 'Chat Only'}
                  </div>
                </div>

                {topic && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Topic</div>
                    <div className="font-medium text-slate-900">{topic}</div>
                  </div>
                )}

                {selectedDate && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Date</div>
                    <div className="font-medium text-slate-900">
                      {availableDates.find((d) => d.date === selectedDate)?.display}
                    </div>
                  </div>
                )}

                {selectedTime && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Time</div>
                    <div className="font-medium text-slate-900">{selectedTime}</div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-semibold text-slate-900">60 minutes</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-600">Price</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex gap-2">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Cancellation Policy</p>
                    <p className="text-blue-700">You can cancel or reschedule up to 24 hours before the session.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
