/**
 * The final page from sign up
 * 
 * TODO:
 * Connect with DB
 * Add guideline logic
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";

export default function SignUpAllSet() {
  const navigate = useNavigate();

  const StartGuideLine = () => {
    const redirect = "http://localhost:3000/?guide=1";
    window.location.replace(redirect);
  };

    useEffect(() => {
    const timer = setTimeout(() => {
      StartGuideLine();
    }, 2000); // 2000 ms = 2 seconds

    // cleanup on unmount to prevent memory leaks
    return () => clearTimeout(timer);
  }, []);

  return (
    // Add dynamic username
    <SpringMotionLayout
      titleLines={["Username,", "You're", "All Set!"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >

    <p> Quick app tour guide will be started soon </p>

    </SpringMotionLayout>
  );
}
