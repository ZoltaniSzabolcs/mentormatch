import { createBrowserRouter } from 'react-router-dom';
import { Root } from './components/Root';
import { Home } from './components/Home';
import { SignUp } from './components/SignUp';
import { OnboardingMentee } from './components/OnboardingMentee';
import { OnboardingMentor } from './components/OnboardingMentor';
import { Dashboard } from './components/Dashboard';
import { FindMentors } from './components/FindMentors';
import { MentorProfile } from './components/MentorProfile';
import { BookSession } from './components/BookSession';
import { MyMentors } from './components/MyMentors';
import { Progress } from './components/Progress';
import { MentorDashboard } from './components/MentorDashboard';
import { Login } from './components/Login';
import { MyMentees } from './components/MyMentees';
import { MenteeProfile } from './components/MenteeProfile';
import { ResourcesPage } from './components/ResourcesPage';
import { MenteeResourcesPage } from './components/MenteeResourcesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'signup', Component: SignUp },
      { path: 'onboarding/mentee', Component: OnboardingMentee },
      { path: 'onboarding/mentor', Component: OnboardingMentor },
      { path: 'dashboard', Component: Dashboard },
      { path: 'find-mentors', Component: FindMentors },
      { path: 'mentor/:id', Component: MentorProfile },
      { path: 'mentee/:id', Component: MenteeProfile },
      { path: 'book/:id', Component: BookSession },
      { path: 'my-mentors', Component: MyMentors },
      { path: 'my-mentees', Component: MyMentees },
      { path: 'progress', Component: Progress },
      { path: 'mentor-dashboard', Component: MentorDashboard },
      { path: 'login', Component: Login },
      { path: 'resources', Component: ResourcesPage },
      { path: 'mentee-resources', Component: MenteeResourcesPage },
    ],
  },
]);
