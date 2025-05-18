// RootLayout.jsx
import React from 'react';
import './globals.css'; // Assuming a globals.css file exists with Tailwind and custom styles
import { ThemeProvider } from './theme-provider'; // Assuming ThemeProvider is a custom component

// Inline CSS for fonts (simulating next/font/google)
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Caveat:wght@400;500;600;700&display=swap');

  :root {
    --font-sans: 'Inter', sans-serif;
    --font-caveat: 'Caveat', cursive;
  }

  body {
    font-family: var(--font-sans);
  }
`;

// Inject font styles into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = fontStyles;
document.head.appendChild(styleSheet);

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Premium Travel Destinations | Discover Your Dream Getaway</title>
        <meta
          name="description"
          content="Explore the world's most beautiful destinations with our premium travel experiences"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}