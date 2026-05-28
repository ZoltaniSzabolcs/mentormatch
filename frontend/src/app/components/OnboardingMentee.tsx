import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, ArrowRight, ArrowLeft } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export function OnboardingMentee() {
  const [step, setStep] = useState(1);
  const [customGoal, setCustomGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    goals: [] as string[],
    experienceLevel: '',
    learningStyle: '',
    availability: '',
  });

  const goalOptions = [
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

  const skillLevels = [
    { value: 'BEGINNER', label: 'Beginner', description: 'Just starting out' },
    { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some experience' },
    { value: 'ADVANCED', label: 'Advanced', description: 'Experienced professional' },
  ];

  const learningStyles = [
    { value: 'STRUCTURED', label: 'Structured', description: 'Step-by-step guidance' },
    { value: 'EXPLORATORY', label: 'Exploratory', description: 'Open-ended discussions' },
    { value: 'PROJECT_BASED', label: 'Project-based', description: 'Hands-on learning' },
  ];

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.experienceLevel) {
        return 'Please select your experience level.';
      }
    }
    if (currentStep === 2 && formData.goals.length === 0) {
      return 'Please select at least one learning goal.';
    }
    if (currentStep === 3 && !formData.learningStyle) {
      return 'Please select your learning style.';
    }
    if (currentStep === 4 && !formData.availability) {
      return 'Please select your availability.';
    }
    return '';
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axiosClient.post('/mentees/profile', {
        experienceLevel: formData.experienceLevel,
        learningStyle: formData.learningStyle,
        availability: formData.availability,
        goals: formData.goals,
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { status?: number } }).response;
        if (response?.status === 401) {
          setError('Your session expired. Please sign in again.');
        } else {
          setError('We could not save your profile. Please try again.');
        }
      } else {
        setError('We could not save your profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    const validationMessage = validateStep(step);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setError('');
      setStep(step - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }));
  };

  const addCustomGoal = () => {
    const trimmedGoal = customGoal.trim();
    if (!trimmedGoal || formData.goals.includes(trimmedGoal)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      goals: [...prev.goals, trimmedGoal],
    }));
    setCustomGoal('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <Users className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-slate-900">MentorMatch</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Let's create your profile</h1>
          <p className="text-slate-600">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tell us about yourself</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Experience Level</label>
                  <div className="space-y-2">
                    {skillLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setFormData({ ...formData, experienceLevel: level.value })}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          formData.experienceLevel === level.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{level.label}</div>
                        <div className="text-sm text-slate-600">{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">What are your learning goals?</h2>
              <p className="text-slate-600 mb-6">Select all areas where you'd like guidance</p>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomGoal();
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Add a custom learning goal"
                />
                <button
                  type="button"
                  onClick={addCustomGoal}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.goals.includes(goal)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
                {formData.goals
                  .filter((goal) => !goalOptions.includes(goal))
                  .map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.goals.includes(goal)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">What's your learning style?</h2>
              <p className="text-slate-600 mb-6">This helps us match you with compatible mentors</p>
              <div className="space-y-3">
                {learningStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setFormData({ ...formData, learningStyle: style.value })}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.learningStyle === style.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{style.label}</div>
                    <div className="text-sm text-slate-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">When are you available?</h2>
              <p className="text-slate-600 mb-6">We'll match you with mentors who have compatible schedules</p>
              <div className="space-y-3">
                {[
                  { value: 'WEEKDAYS_MORNING', label: 'Weekday Mornings', time: '9:00 AM - 12:00 PM' },
                  { value: 'WEEKDAYS_AFTERNOON', label: 'Weekday Afternoons', time: '12:00 PM - 5:00 PM' },
                  { value: 'WEEKDAYS_EVENING', label: 'Weekday Evenings', time: '5:00 PM - 9:00 PM' },
                  { value: 'WEEKENDS', label: 'Weekends', time: 'Flexible hours' },
                ].map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => setFormData({ ...formData, availability: slot.value })}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.availability === slot.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{slot.label}</div>
                    <div className="text-sm text-slate-600">{slot.time}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              step === 1
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-400 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm ${
              isLoading ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Saving...' : step === totalSteps ? 'Complete' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
