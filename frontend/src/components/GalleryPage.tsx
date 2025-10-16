/**
 * Likes and Search History for the row 3, landing page(homepage) 
 * This component shows the data
 * 
 * 
 * TODO:
 * Implement likes, history data instead of hardcoded one
 * Make menu text centered
 */
import { useState } from "react";
import CardMenu from "./CardMenu";
import ImageFlipCard from "./ImageFlipCard";
type Tab = "likes" | "history";

// Hardcoded data
const likesData = [
  { id: 1, image_url: "https://picsum.photos/seed/a/600/400", word_english: "Sunset Dune" },
  { id: 2, image_url: "https://picsum.photos/seed/b/600/400", word_english: "River Stone" },
  { id: 3, image_url: "https://picsum.photos/seed/c/600/400", word_english: "Forest Path" },
];

const historyData = [
  { id: 4, image_url: "https://picsum.photos/seed/d/600/400", word_english: "Neon City" },
  { id: 5, image_url: "https://picsum.photos/seed/e/600/400", word_english: "Snow Ridge" },
  { id: 6, image_url: "https://picsum.photos/seed/f/600/400", word_english: "Sea Cliff" },
];

export default function GalleryPage() {
  const [tab, setTab] = useState<"likes" | "history">("likes");
  const [history, setHistory] = useState([])
  const [data, setData] = useState(tab === "likes" ? likesData : history);
  // const data = tab ==="likes" ? likesData : historyData;

  const tabMaking = (new_tab: Tab) => {
      setTab(new_tab);
      request_info();
  }

  const request_info = async() => {
    const response = await fetch(import.meta.env.VITE_SERVER_URL + "/get_user_history?page=1", {
      method: "GET",
      credentials: 'include'
    })
    .then(function(response) { return response.json(); })
    .then(function(json) {
      // use the json
      for (let i = 0; i < json.history.length; i++){
        json.history[i].id = i;
      }

    
      setHistory(json.history)
      setData(tab === "likes" ? likesData : history)
      console.log(data);
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Text center doesn't work? */}
      <div className="text-center">
        <CardMenu tab={tab} onChange={tabMaking} />
      </div>

      {/* Image cards under the grey row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <ImageFlipCard key={item.id} image={item.image_url} title={item.word_english} />
        ))}
      </div>
    </div>
  );
}
