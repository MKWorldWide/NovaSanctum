import React from 'react';

const Image = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  style = {},
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  unoptimized = false,
  ...props
}) => {
  // Use the image source directly for testing
  const imgSrc = 
    typeof src === 'string' 
      ? src 
      : typeof src === 'object' && src?.default?.src 
        ? src.default.src 
        : '';

  // Add data-testid for easier testing
  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={`next-image ${className}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        ...style,
      }}
      data-testid="next-image"
      data-priority={priority}
      data-placeholder={placeholder}
      data-unoptimized={unoptimized}
      {...props}
    />
  );
};

// Add display name for better debugging
Image.displayName = 'NextImage';

export default Image;
