import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import TextInputStep from "../../components/utils/TextInputStep";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function SetUpTargetLan({ onNext, onPrev }: StepProps) {
  const [targetLan, setTargetLan] = React.useState("");
  const { update, data } = useSignup();

  React.useEffect(() => {
    if (data?.targetLan) setTargetLan(data.targetLan);
  }, [data?.targetLan]);

  const validate = (s: string) => {
    if (!s) return "Please choose a target language.";
    if (s.length < 2) return "Language must be at least 2 characters.";
    return null;
  };

  const submitTargetLan = async (cleanTargetLan: string) => {
    update({ targetLan: cleanTargetLan });
    onNext(); 
  };

  return (
    <SpringMotionLayout
      titleLines={["Choose", "Target", "Language"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <TextInputStep
        value={targetLan}
        onChange={setTargetLan}
        inputName="targetlang"
        placeholder="e.g., English, 日本語, 한국어"
        autoComplete="off"
        onPrevious={onPrev}
        onSubmit={submitTargetLan}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
