import React from 'react';

const Head = ({ children }) => {
  // In test environment, we just render the children directly
  // without the actual head tag to avoid warnings
  return (
    <>
      {React.Children.map(children, (child) => {
        // Clone each child and add a data-testid for testing
        return child ? React.cloneElement(child, {
          'data-testid': 'head-element',
        }) : null;
      })}
    </>
  );
};

// Add display name for better debugging
Head.displayName = 'Head';

export default Head;
