import React from 'react';

const Script = ({
  src,
  strategy = 'afterInteractive',
  onLoad,
  onError,
  onReady,
  id,
  className,
  children,
  ...props
}) => {
  const [isReady, setIsReady] = React.useState(false);
  const scriptRef = React.useRef(null);

  React.useEffect(() => {
    // Skip execution in test environment
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    // Handle different loading strategies
    const executeScript = () => {
      if (!src) return;

      const script = document.createElement('script');
      script.src = src;
      script.async = strategy === 'afterInteractive' || strategy === 'lazyOnload';
      script.defer = strategy === 'afterInteractive' || strategy === 'lazyOnload';
      
      if (id) script.id = id;
      if (className) script.className = className;

      const handleLoad = () => {
        if (onLoad) onLoad();
        if (onReady) onReady();
        setIsReady(true);
      };

      const handleError = (error) => {
        if (onError) onError(error);
      };

      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);

      document.body.appendChild(script);
      scriptRef.current = script;

      // Cleanup
      return () => {
        if (scriptRef.current) {
          scriptRef.current.removeEventListener('load', handleLoad);
          scriptRef.current.removeEventListener('error', handleError);
          document.body.removeChild(scriptRef.current);
        }
      };
    };

    // Execute based on strategy
    switch (strategy) {
      case 'afterInteractive':
        executeScript();
        break;
      case 'lazyOnload':
        window.addEventListener('load', executeScript);
        return () => window.removeEventListener('load', executeScript);
      case 'beforeInteractive':
      case 'worker':
        // These would be handled by Next.js in a real environment
        break;
      default:
        break;
    }
  }, [src, strategy, onLoad, onError, onReady, id, className]);

  // In test environment, just render a placeholder
  if (process.env.NODE_ENV === 'test') {
    return (
      <div 
        data-testid="next-script" 
        data-src={src} 
        data-strategy={strategy}
        data-ready={isReady}
        {...props}
      >
        {children}
      </div>
    );
  }

  // In non-test environments, render nothing (script is added to document)
  return null;
};

Script.displayName = 'NextScript';

export default Script;
