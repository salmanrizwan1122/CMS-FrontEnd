"use-client";
import "./globals.css";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const metadata = {
  title: "Unit Factor",
  description: "Engineering The Future, Step By Step",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
      <AppRouterCacheProvider>
      <ToastContainer />
        {children}
      </AppRouterCacheProvider>
      </body>
    </html>
  );
}
