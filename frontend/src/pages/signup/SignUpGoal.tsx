import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import MultiCheckbox from "../../components/checkbox/MultiCheckbox";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function SignUpGoal({ onNext, onPrev }: StepProps) {
  const { update, data } = useSignup();
  const [goals, setGoals] = React.useState<string[]>(data?.goals ?? []);

  React.useEffect(() => {
    if (data?.goals) setGoals(data.goals);
  }, [data?.goals]);

  const options = [
    { label: "Image Translation", value: "image-translation" },
    { label: "Travel", value: "travel" },
    { label: "Work", value: "work" },
    { label: "Study", value: "study" },
    { label: "Etc(s)", value: "etc" },
  ];

  const validate = (vals: string[]) =>
    vals.length === 0 ? "Please select at least one goal." : null;

  const submitGoal = async (cleanValues: string[]) => {
    update({ goals: cleanValues });
    onNext(); 
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Learning Goal?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <MultiCheckbox
        values={goals}
        onChange={setGoals}
        options={options}
        inputName="learning-goals"
        onPrevious={onPrev}
        onSubmit={submitGoal}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
