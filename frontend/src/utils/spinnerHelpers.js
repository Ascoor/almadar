import { useSpinner } from '../context/SpinnerContext';

export const useDelayedSpinner = () => {
  const { showSpinner, hideSpinner } = useSpinner();

  const runWithSpinner = async (fn, delay = 2000) => {
    showSpinner();
    const start = Date.now();

    const result = await fn();

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, delay - elapsed);

    setTimeout(() => {
      hideSpinner();
    }, remaining);

    return result;
  };

  return { runWithSpinner };
};
