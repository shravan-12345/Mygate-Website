import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

// Convenience hook so components write `const { user, login } = useAuth()`
// instead of importing useContext + AuthContext everywhere.
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
