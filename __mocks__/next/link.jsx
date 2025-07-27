import React from 'react';

const Link = ({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref = false,
  prefetch = true,
  locale,
  className = '',
  style = {},
  onClick,
  onMouseEnter,
  ...props
}) => {
  // Handle different href formats (string or object with pathname)
  const actualHref = typeof href === 'string' 
    ? href 
    : href?.pathname || '';

  // Add data-testid for easier testing
  return (
    <a
      href={actualHref}
      className={`next-link ${className}`}
      style={style}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      onMouseEnter={(e) => {
        if (onMouseEnter) {
          onMouseEnter(e);
        }
        // Simulate prefetch on hover if enabled
        if (prefetch) {
          // No-op for testing
        }
      }}
      data-testid="next-link"
      data-replace={replace}
      data-scroll={scroll}
      data-shallow={shallow}
      data-prefetch={prefetch}
      data-locale={locale}
      {...props}
    >
      {children}
    </a>
  );
};

// Add display name for better debugging
Link.displayName = 'NextLink';

export default Link;
