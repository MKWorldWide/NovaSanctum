import React from 'react';

// Mock the dynamic import function for testing
const dynamic = (dynamicOptions, options) => {
  // If the dynamicOptions is a function, it's a dynamic import with options
  const loadableComponent = typeof dynamicOptions === 'function' 
    ? dynamicOptions
    : dynamicOptions.loadableGenerated?.modules?.[0] || (() => dynamicOptions);
  
  // Create a simple component that renders the loaded component
  const DynamicComponent = React.forwardRef((props, ref) => {
    const [Component, setComponent] = React.useState(() => {
      // Handle loading state if needed
      if (options?.loading) {
        return options.loading;
      }
      return null;
    });

    React.useEffect(() => {
      // Simulate dynamic import
      const loadComponent = async () => {
        try {
          // If it's a function, it's likely a dynamic import
          const module = typeof loadableComponent === 'function' 
            ? await loadableComponent()
            : { default: loadableComponent };
          
          // Get the default export or the module itself
          const LoadedComponent = module.default || module;
          
          // Set the loaded component
          setComponent(() => LoadedComponent);
        } catch (error) {
          console.error('Error loading dynamic component:', error);
          if (options?.error) {
            setComponent(() => options.error);
          }
        }
      };
      
      loadComponent();
    }, []);

    // If we have a component, render it with props
    return Component ? React.createElement(Component, { ...props, ref }) : null;
  });

  // Add display name for better debugging
  const displayName = options?.ssr ? 'DynamicComponent(SSR)' : 'DynamicComponent';
  DynamicComponent.displayName = displayName;
  
  // Add preload method for testing
  DynamicComponent.preload = async () => {
    // No-op for testing
    return Promise.resolve();
  };

  return DynamicComponent;
};
// Add static properties
dynamic.displayName = 'Dynamic';

export default dynamic;
