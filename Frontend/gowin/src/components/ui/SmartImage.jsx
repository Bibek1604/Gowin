import React, { useState } from 'react';
import { PLACEHOLDER_IMG } from '../../lib/placeholder';
import { responsiveImage } from '../../lib/images';

// Card-sized by default; heroes pass sizes="100vw", thumbnails a pixel width.
const DEFAULT_SIZES = '(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw';

/**
 * <img> that lazy-loads, decodes off the main thread, serves a right-sized
 * variant (srcset) for Unsplash / Wikimedia links and swaps in a branded
 * placeholder when the source is missing or fails. Use `priority` for the
 * first hero image so the browser fetches it early.
 */
const SmartImage = ({ src, alt = '', className = '', priority = false, sizes, fallback = PLACEHOLDER_IMG, ...rest }) => {
  const [failed, setFailed] = useState(false);
  const usable = !failed && typeof src === 'string' && src.trim();
  const { src: url, srcSet } = usable ? responsiveImage(src.trim()) : { src: fallback };
  return (
    <img
      src={url}
      srcSet={srcSet}
      sizes={srcSet ? (sizes || (priority ? '100vw' : DEFAULT_SIZES)) : undefined}
      alt={alt}
      // Intrinsic size hint (aspect ratio before CSS applies); every caller sizes the box with CSS.
      width={800}
      height={600}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => { if (!failed) setFailed(true); }}
      {...rest}
    />
  );
};

export default SmartImage;
