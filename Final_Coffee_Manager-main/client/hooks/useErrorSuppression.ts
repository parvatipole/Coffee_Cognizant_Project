import { useEffect } from 'react';

import { useEffect } from 'react';

/**
 * Custom hook to suppress specific types of runtime errors
 * Particularly useful for third-party script errors that we can't control
 */
export function useErrorSuppression() {
  useEffect(() => {
    // Store the original console.error to filter out specific errors
    const originalConsoleError = console.error;
    
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ').toLowerCase();
      
      // Suppress common third-party errors that don't affect functionality
      const suppressedErrors = [
        'video element not found',
        'element not found for attaching listeners',
        'cannot read property',
        'cannot read properties of null',
        'failed to execute \'addeventlistener\' on \'element\': parameter 1',
        'non-error promise rejection captured',
      ];
      
      const shouldSuppress = suppressedErrors.some(suppressedError => 
        errorMessage.includes(suppressedError)
      );
      
      if (!shouldSuppress) {
        originalConsoleError.apply(console, args);
      } else {
        // Log suppressed errors to a different level for debugging
        console.warn('[Suppressed Error]:', ...args);
      }
    };
    
    // Cleanup function
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
}

/**
 * Custom hook for safely executing code that might throw video-related errors
 */
export function useSafeExecution() {
  const safeExecute = <T>(
    fn: () => T,
    fallback?: T,
    errorMessage?: string
  ): T | undefined => {
    try {
      return fn();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.warn(errorMessage || 'Safe execution caught error:', errorMsg);
      return fallback;
    }
  };

  const safeAsync = async <T>(
    fn: () => Promise<T>,
    fallback?: T,
    errorMessage?: string
  ): Promise<T | undefined> => {
    try {
      return await fn();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.warn(errorMessage || 'Safe async execution caught error:', errorMsg);
      return fallback;
    }
  };

  return { safeExecute, safeAsync };
}

/**
 * Hook to safely check for DOM elements that might not exist
 */
export function useSafeDOM() {
  const safeQuerySelector = (selector: string): Element | null => {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.warn(`Safe querySelector failed for: ${selector}`, error);
      return null;
    }
  };

  const safeQuerySelectorAll = (selector: string): NodeListOf<Element> | null => {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      console.warn(`Safe querySelectorAll failed for: ${selector}`, error);
      return null;
    }
  };

  const safeAddEventListener = (
    element: Element | null,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): boolean => {
    try {
      if (!element) {
        console.warn(`Element not found for event listener: ${event}`);
        return false;
      }
      
      element.addEventListener(event, handler, options);
      return true;
    } catch (error) {
      console.warn(`Failed to add event listener for ${event}:`, error);
      return false;
    }
  };

  return {
    safeQuerySelector,
    safeQuerySelectorAll,
    safeAddEventListener,
  };
}
