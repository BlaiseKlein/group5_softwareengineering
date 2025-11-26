/**
 * Landing page(homepage) after log-in.
 */
import './landing.css';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getLanguageMeta } from "../src/components/utils/LanguageSuggest"
import QuickGuide from "./pages/quickguide/QuickGuide";
import Loading from '../src/pages/status/Loading';
import GalleryPage from './components/card/GalleryPage';
import Card from './components/card/Cards';
import Logout from './components/Logout';

export default function Landing() {
  const [params, setParams] = useSearchParams();
  const [name, setName] = useState("Language Learner");
  const [lang, setLang] = useState("FR");
  const [loading, setLoading] = useState(true);
  const showGuide = params.get("guide") === "1";
  const navigate = useNavigate();
  const langMeta = getLanguageMeta(lang);
  const displayFlag = langMeta?.flag ?? "🏳️";
  const displayCode = langMeta?.code ?? lang.toUpperCase();
  const displayName = langMeta?.label ?? "Unknown";

  const request_info = async() => {
      const response = await fetch(import.meta.env.VITE_SERVER_URL + "/userlearninginfo", {
          method: "get",
          headers: {"Content-Type": "application/json"},
          credentials: 'include',
        }
      )
      .then(function(response) { 
        if (response.status == 401) {
          window.location.href = "/login";
          return;
        }
        if (response.status == 429) {
          response.json().then(function(data) {
            alert(`${data.detail}. Retry after ${data.retry_after} seconds.`);
          });
          return;
        }
        return response.json();
      })
      .then(function(json) {
        setName(json.user_info.name);
        setLang(json.user_info.default_lang_id);
      });
      setLoading(false);
    }
  
    useEffect(()=>{
      const timer = setTimeout(() => {
        request_info();
      }, 1200);
      return () => clearTimeout(timer);
    }, [])
  
    if (loading) {
      return <Loading />;
    }

  return (
    <div className="min-h-screen bg-white">
      {showGuide && <QuickGuide />}

      <main className="mx-auto w-full max-w-[1080px] px-5 pb-24">
        <section className="flex justify-between align-text-bottom pt-10">
          <div className="text-left">
            <h1
            className="text-4xl font-extrabd leading-tight tracking-tight"
            data-guide="welcome-title"
            >
              Hello,<br />
              {name}!
            </h1>
          </div>

           <div className="text-right text-sm text-gray-600">
              <Logout />
           </div> 
        </section>

        <section>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            <button
              className="inline-flex items-center gap-1"
              onClick={() => setParams({ guide: "1" })}
              data-guide="quick-guide-button"
            >
              Quick Guide <span aria-hidden>→</span>
            </button>
  
            <button
              className="inline-flex items-center gap-2"
              data-guide="target-language"
              onClick={() => navigate("/user/userlearninginfo")}
            >
              <span>Target Language:</span>
              <span role="img" aria-label={`${displayName} flag`}> {displayFlag} {displayCode} </span>
              <span aria-hidden>✎</span>
            </button>
          </div>
        </section>

        {/* Quiz Card */}
        <section className="mt-6" data-guide="daily-quiz-card">
          <div className="overflow-hidden rounded-3xl bg-gray-100 shadow">
            <Card
              image="https://yt3.googleusercontent.com/8cgZMlfbExlkCdKjgJjxmHqa80xJ6WByNIbayrhS3AN3TbumcJO3TnujIq61nYh9vZWWMW7eUg=s900-c-k-c0x00ffffff-no-rj"
              title="Quiz Time!: Build Your Stack"
              description="I feel sleepy......I know you're also sleepy...."
            >
              <button
                className="mt-2 grid h-12 w-12 place-items-center rounded-full bg-gray-900 text-white"
                aria-label="Play"
                onClick={() => navigate("/quiz/start")}
              >
                ▶
              </button>
            </Card>
          </div>
        </section>

        {/* Likes / Search history */}
        <section className="mt-7" data-guide="likes-history">
          <div className="mt-4">
            <GalleryPage />
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <div className="fixed inset-x-0 bottom-6 z-50 flex items-center justify-center">
        <button
          className="grid h-24 w-24 place-items-center rounded-full"
          aria-label="Open Camera Translate"
        >
        </button>
      </div>
    </div>
  );
}
