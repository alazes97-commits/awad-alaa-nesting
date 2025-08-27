// Haptic feedback utilities for better user experience

export function vibrateOnSuccess() {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]); // Short success pattern
  }
}

export function vibrateOnError() {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100, 50, 100]); // Error pattern
  }
}

export function vibrateOnAction() {
  if ('vibrate' in navigator) {
    navigator.vibrate(30); // Quick tap feedback
  }
}

// Visual feedback for buttons
export function animateButtonSuccess(button: HTMLElement) {
  button.style.transform = 'scale(0.95)';
  button.style.backgroundColor = 'rgb(34, 197, 94)'; // green-500
  button.style.transition = 'all 0.15s ease';
  
  setTimeout(() => {
    button.style.transform = '';
    button.style.backgroundColor = '';
  }, 150);
}

export function animateButtonError(button: HTMLElement) {
  button.style.transform = 'scale(0.95)';
  button.style.backgroundColor = 'rgb(239, 68, 68)'; // red-500
  button.style.transition = 'all 0.15s ease';
  
  setTimeout(() => {
    button.style.transform = '';
    button.style.backgroundColor = '';
  }, 150);
}

// Combined feedback function
export function provideFeedback(type: 'success' | 'error' | 'action', element?: HTMLElement) {
  // Visual feedback
  if (element) {
    if (type === 'success') {
      animateButtonSuccess(element);
    } else if (type === 'error') {
      animateButtonError(element);
    }
  }
  
  // Haptic feedback
  if (type === 'success') {
    vibrateOnSuccess();
  } else if (type === 'error') {
    vibrateOnError();
  } else if (type === 'action') {
    vibrateOnAction();
  }
}

// Custom hook for minimal feedback instead of toasts
export function useMinimalFeedback() {
  return {
    success: (element?: HTMLElement) => provideFeedback('success', element),
    error: (element?: HTMLElement) => provideFeedback('error', element),
    action: (element?: HTMLElement) => provideFeedback('action', element)
  };
}