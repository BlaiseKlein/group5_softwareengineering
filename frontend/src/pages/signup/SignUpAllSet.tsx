import React, { useEffect } from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function SignUpAllSet({ onNext }: StepProps) {
  const { data, reset } = useSignup();

  useEffect(() => {
    let cancelled = false;

    // Connect with backend
    const submitAll = async () => {
      try {
        const res = await fetch(`...`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // { username, email, password, targetLan, goals, difficulty }
          credentials: "include",
        });

        // test
        console.log("data", res.body);

        if (!res.ok) throw new Error("Signup failed");
        await res.json().catch(() => ({}));

        if (!cancelled) {
          reset(); // clear draft storage

          window.location.href = "http://localhost:3000/?guide=1";
        }
      } catch (e) {
        console.error(e);
        // console.error("Could not complete signup. Please try again.");
      }
    };

    submitAll();
    return () => {
      cancelled = true;
    };
  }, [data, reset]);

  return (
    <SpringMotionLayout
      titleLines={[`${data.username || "User"},`, "You're", "All Set!"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <p>Finishing your account…</p>
      <p className="text-sm text-gray-500">Launching a quick tour next.</p>
    </SpringMotionLayout>
  );
}
