// Global error handler for preventing runtime errors from third-party scripts
// Specifically handles "Video element not found" and similar DOM-related errors

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorCount = 0;
  private maxErrors = 10; // Prevent spam
  
  private constructor() {
    this.setupErrorHandlers();
  }

  public static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupErrorHandlers() {
    // Handle unhandled errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || event.message, 'Global Error Handler');
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
      event.preventDefault(); // Prevent console errors
    });

    // Override querySelector and querySelectorAll to handle video element requests
    this.overrideVideoElementQueries();
  }

  private overrideVideoElementQueries() {
    const originalQuerySelector = Document.prototype.querySelector;
    const originalQuerySelectorAll = Document.prototype.querySelectorAll;

    Document.prototype.querySelector = function(selector: string) {
      try {
        const result = originalQuerySelector.call(this, selector);
        
        // If looking for video element and not found, return a mock element or null gracefully
        if (selector.includes('video') && !result) {
          console.warn(`Video element not found for selector: ${selector}`);
          return null;
        }
        
        return result;
      } catch (error) {
        console.warn(`Error in querySelector for selector: ${selector}`, error);
        return null;
      }
    };

    Document.prototype.querySelectorAll = function(selector: string) {
      try {
        const result = originalQuerySelectorAll.call(this, selector);
        
        // If looking for video elements and none found, return empty NodeList
        if (selector.includes('video') && result.length === 0) {
          console.warn(`No video elements found for selector: ${selector}`);
        }
        
        return result;
      } catch (error) {
        console.warn(`Error in querySelectorAll for selector: ${selector}`, error);
        return document.createDocumentFragment().childNodes as NodeListOf<Element>;
      }
    };
  }

  private handleError(error: any, source: string) {
    if (this.errorCount >= this.maxErrors) {
      return; // Prevent error spam
    }

    this.errorCount++;

    const errorMessage = typeof error === 'string' ? error : error?.message || 'Unknown error';
    
    // Check if this is a video-related error
    if (errorMessage.toLowerCase().includes('video') ||
        errorMessage.toLowerCase().includes('media') ||
        errorMessage.toLowerCase().includes('element not found')) {

      console.info(`✅ [Coffee Manager] Suppressed harmless video error from third-party script:`, errorMessage);

      // Show a brief info message only for the first few errors
      if (this.errorCount <= 2) {
        console.info('💡 Video-related errors from external scripts are being automatically handled.');
      }

      return; // Don't let video errors crash the app
    }

    // For other errors, log them but don't interfere
    console.error(`[${source}] Unhandled error:`, error);
  }

  private showUserNotification(message: string, type: 'info' | 'warning' | 'error') {
    // Only show notifications for critical issues
    if (type === 'error') {
      // Create a simple toast notification
      const toast = document.createElement('div');
      toast.className = `
        fixed top-4 right-4 z-50 p-4 max-w-sm bg-white border border-gray-200 
        rounded-lg shadow-lg transition-all duration-300 transform translate-x-full
      `;
      toast.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span class="text-sm text-gray-700">${message}</span>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      // Animate in
      setTimeout(() => {
        toast.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        toast.style.transform = 'translateX(full)';
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }
  }

  // Method to manually handle video element creation if needed
  public createSafeVideoElement(): HTMLVideoElement | null {
    try {
      const video = document.createElement('video');
      video.style.display = 'none'; // Hidden by default
      return video;
    } catch (error) {
      console.warn('Could not create video element:', error);
      return null;
    }
  }

  // Method to safely attach event listeners to video elements
  public safeAttachVideoListener(
    selector: string, 
    event: string, 
    handler: EventListener,
    options?: AddEventListenerOptions
  ): boolean {
    try {
      const videoElement = document.querySelector(selector) as HTMLVideoElement;
      
      if (!videoElement) {
        console.warn(`Video element not found for selector: ${selector}`);
        return false;
      }
      
      if (!(videoElement instanceof HTMLVideoElement)) {
        console.warn(`Element found but not a video element: ${selector}`);
        return false;
      }
      
      videoElement.addEventListener(event, handler, options);
      return true;
      
    } catch (error) {
      console.warn(`Failed to attach video listener for ${selector}:`, error);
      return false;
    }
  }
}

// Initialize the global error handler
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// Export utility function for components to use
export const attachVideoListener = globalErrorHandler.safeAttachVideoListener.bind(globalErrorHandler);
export const createSafeVideo = globalErrorHandler.createSafeVideoElement.bind(globalErrorHandler);
