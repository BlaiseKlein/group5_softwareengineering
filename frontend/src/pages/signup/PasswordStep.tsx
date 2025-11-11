import React from "react";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import PasswordInputStep from "../../components/utils/PasswordInputStep";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function PasswordStep({ onNext, onPrev }: StepProps) {
  const [password, setPassword] = React.useState("");
  const { update, data } = useSignup();

  React.useEffect(() => {
    if (data?.password) setPassword(data.password);
  }, [data?.password]);

  const validatePassword = (s: string) => {
    if (!s) return "Please enter a password.";
    if (s.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const submitPassword = async (cleanPassword: string) => {
    update({ password: cleanPassword });
    onNext(); 
  };

  return (
    <SpringMotionLayout
      titleLines={["Create", "A", "Password"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <PasswordInputStep
        value={password}
        onChange={setPassword}
        inputName="password"
        placeholder="password"
        autoComplete="new-password"
        onPrevious={onPrev}
        onSubmit={submitPassword}
        validate={validatePassword}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
