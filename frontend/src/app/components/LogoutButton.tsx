import { useNavigate } from 'react-router-dom';

interface LogoutButtonProps {
  className?: string;
  label?: string;
}

const clearAuthStorage = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('mentorId');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('mentorId');
};

export function LogoutButton({
  className = 'text-slate-600 hover:text-slate-900',
  label = 'Logout',
}: LogoutButtonProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthStorage();
    navigate('/login');
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {label}
    </button>
  );
}
