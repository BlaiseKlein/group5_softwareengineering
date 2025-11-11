import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import TextInputStep from "../../components/utils/TextInputStep";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function EmailStep({ onNext, onPrev }: StepProps) {
  const [email, setEmail] = React.useState("");
  const { update, data } = useSignup();

  React.useEffect(() => {
    if (data?.email) setEmail(data.email);
  }, [data?.email]);

  const validateEmail = (s: string) => {
    if (!s) return "Please enter your email.";

    const hasAt = s.indexOf("@") > 0;
    const hasDotAfterAt = s.lastIndexOf(".") > s.indexOf("@") + 1;
    return hasAt && hasDotAfterAt ? null : "Please enter a valid email.";
  };

  const submitEmail = async (cleanEmail: string) => {
    update({ email: cleanEmail });
    onNext();
  };

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Email?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <TextInputStep
        value={email}
        onChange={setEmail}
        inputName="email"
        placeholder="your@email.com"
        autoComplete="email"
        onPrevious={onPrev}
        onSubmit={submitEmail}
        validate={validateEmail}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
