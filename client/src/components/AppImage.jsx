import React from 'react';
// import { cn } from '../lib/utils';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      // This "object-cover" class fixes the image distortion
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => {
        e.target.src = "/assets/images/no_image.png";
        e.target.srcset = "";
      }}
      {...props}
    />
  );
}

export default Image;