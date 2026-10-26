import React, { useState } from 'react';
import { PLACEHOLDER_IMG } from '../../lib/placeholder';

/**
 * <img> that lazy-loads, decodes off the main thread and swaps in a branded
 * placeholder when the source is missing or fails. Use `priority` for the
 * first hero image so the browser fetches it early.
 */
const SmartImage = ({ src, alt = '', className = '', priority = false, fallback = PLACEHOLDER_IMG, ...rest }) => {
  const [failed, setFailed] = useState(false);
  const url = !failed && typeof src === 'string' && src.trim() ? src : fallback;
  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => { if (!failed) setFailed(true); }}
      {...rest}
    />
  );
};

export default SmartImage;
