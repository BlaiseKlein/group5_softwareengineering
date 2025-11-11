import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import TextInputStep from "../../components/utils/TextInputStep";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function NameStep({ onNext, onPrev }: StepProps) {
  const [username, setUserName] = React.useState("");
  const { update, data } = useSignup();

  React.useEffect(() => {
    if (data?.username) setUserName(data.username);
  }, [data?.username]);

  const validateName = (s: string) => {
    if (!s) return "Please enter your name.";
    if (s.length < 2) return "Name must be at least 2 characters.";
    return null;
  };

  const submitName = async (cleanName: string) => {
    update({ username: cleanName });
    onNext(); 
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Name?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <TextInputStep
        value={username}
        onChange={setUserName}
        inputName="username"
        placeholder="Your Name"
        autoComplete="username"
        onPrevious={onPrev}    
        onSubmit={submitName}  
        validate={validateName}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
