import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import SingleCheckbox from "../../components/checkbox/SingleCheckbox";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function SignUpDifficulty({ onNext, onPrev }: StepProps) {
  const { update, data } = useSignup();
  const [difficulty, setDifficulty] = React.useState<string | null>(data?.difficulty ?? null);

  React.useEffect(() => {
    if (data?.difficulty) setDifficulty(data.difficulty);
  }, [data?.difficulty]);

  const options = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];

  const validate = (val: string | null) =>
    !val ? "Please select one difficulty." : null;

  const submitDifficulty = async (cleanValue: string) => {
    update({ difficulty: cleanValue });
    onNext(); // advance to next step without changing URL
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Level?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <SingleCheckbox
        value={difficulty}
        onChange={setDifficulty}
        options={options}
        inputName="learning-difficulty"
        onPrevious={onPrev}
        onSubmit={submitDifficulty}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
