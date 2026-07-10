import { useState, useEffect } from 'react';

// Delays updating the returned value until `delay` ms after the input stops
// changing — used to avoid firing a search API call on every keystroke.
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
