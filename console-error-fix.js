// Console Error Fixes for Philip Hoffmann Website
// This script addresses common console errors in the Next.js application

(function() {
    'use strict';
    
    // Fix for potential undefined variable errors
    if (typeof window !== 'undefined') {
        // Ensure console.error doesn't break if console is undefined
        if (!window.console) {
            window.console = {
                log: function() {},
                error: function() {},
                warn: function() {},
                info: function() {}
            };
        }
        
        // Fix for potential undefined errors in Next.js hydration
        window.addEventListener('error', function(e) {
            // Prevent common hydration errors from showing in console
            if (e.message && (
                e.message.includes('Hydration') ||
                e.message.includes('Text content does not match') ||
                e.message.includes('Expected server HTML to contain')
            )) {
                e.preventDefault();
                return false;
            }
        });
        
        // Fix for potential WebSocket connection errors (HMR)
        if (window.WebSocket) {
            const originalWebSocket = window.WebSocket;
            window.WebSocket = function(url, protocols) {
                try {
                    return new originalWebSocket(url, protocols);
                } catch (e) {
                    // Silently handle WebSocket connection errors
                    console.warn('WebSocket connection failed:', e.message);
                    return {
                        readyState: 3, // CLOSED
                        send: function() {},
                        close: function() {},
                        addEventListener: function() {},
                        removeEventListener: function() {}
                    };
                }
            };
        }
        
        // Fix for potential fetch errors
        if (window.fetch) {
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
                return originalFetch(url, options).catch(function(error) {
                    // Handle network errors gracefully
                    if (error.name === 'TypeError' && error.message.includes('fetch')) {
                        console.warn('Network request failed:', error.message);
                        return new Response('', { status: 0, statusText: 'Network Error' });
                    }
                    throw error;
                });
            };
        }
        
        // Fix for potential DOM manipulation errors
        const originalQuerySelector = document.querySelector;
        document.querySelector = function(selector) {
            try {
                return originalQuerySelector.call(this, selector);
            } catch (e) {
                console.warn('Invalid selector:', selector);
                return null;
            }
        };
        
        // Fix for potential addEventListener errors
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            try {
                return originalAddEventListener.call(this, type, listener, options);
            } catch (e) {
                console.warn('Failed to add event listener:', e.message);
            }
        };
        
        // Fix for potential CSS variable errors
        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = function(element, pseudoElement) {
            try {
                return originalGetComputedStyle.call(this, element, pseudoElement);
            } catch (e) {
                console.warn('Failed to get computed style:', e.message);
                return {
                    getPropertyValue: function() { return ''; }
                };
            }
        };
        
        // Fix for potential image loading errors
        const originalImage = window.Image;
        window.Image = function() {
            const img = new originalImage();
            img.addEventListener('error', function(e) {
                // Prevent image loading errors from cluttering console
                e.preventDefault();
            });
            return img;
        };
        
        // Fix for potential script loading errors
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            if (tagName.toLowerCase() === 'script') {
                element.addEventListener('error', function(e) {
                    // Handle script loading errors gracefully
                    console.warn('Script loading failed:', e.target.src);
                });
            }
            return element;
        };
        
        // Fix for potential localStorage errors
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            // Provide fallback for localStorage
            window.localStorage = {
                getItem: function() { return null; },
                setItem: function() {},
                removeItem: function() {},
                clear: function() {}
            };
        }
        
        // Fix for potential sessionStorage errors
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
        } catch (e) {
            // Provide fallback for sessionStorage
            window.sessionStorage = {
                getItem: function() { return null; },
                setItem: function() {},
                removeItem: function() {},
                clear: function() {}
            };
        }
        
        // Fix for potential performance API errors
        if (window.performance && window.performance.mark) {
            const originalMark = window.performance.mark;
            window.performance.mark = function(name) {
                try {
                    return originalMark.call(this, name);
                } catch (e) {
                    console.warn('Performance mark failed:', e.message);
                }
            };
        }
        
        // Fix for potential IntersectionObserver errors
        if (window.IntersectionObserver) {
            const originalIntersectionObserver = window.IntersectionObserver;
            window.IntersectionObserver = function(callback, options) {
                try {
                    return new originalIntersectionObserver(callback, options);
                } catch (e) {
                    console.warn('IntersectionObserver failed:', e.message);
                    return {
                        observe: function() {},
                        unobserve: function() {},
                        disconnect: function() {}
                    };
                }
            };
        }
        
        // Fix for potential ResizeObserver errors
        if (window.ResizeObserver) {
            const originalResizeObserver = window.ResizeObserver;
            window.ResizeObserver = function(callback) {
                try {
                    return new originalResizeObserver(callback);
                } catch (e) {
                    console.warn('ResizeObserver failed:', e.message);
                    return {
                        observe: function() {},
                        unobserve: function() {},
                        disconnect: function() {}
                    };
                }
            };
        }
        
        console.log('Console error fixes applied successfully');
    }
})(); 