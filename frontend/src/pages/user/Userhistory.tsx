/**
 * This page displays user's likes and search history with pictures
 * 
 * TODO:
 * Connect with db
 * Make the menu text center aligned
 * When user clicks -> navigate ?
 */

import { useState, useEffect } from "react";
import GalleryPage from '../../components/card/GalleryPage';

export default function UserHistory() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const timer = setTimeout(() => { setLoading(false); }, 100);
      return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <div></div>;
  }
  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-white">
        {/* Likes / Search history */}
        <section className="mt-7">
          <div className="mt-4">
            <GalleryPage />
          </div>
        </section>
    </div>
  );
}
