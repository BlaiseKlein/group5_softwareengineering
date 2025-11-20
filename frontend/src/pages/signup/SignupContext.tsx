import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export type SignupData = {
  name?: string;
  email?: string;
  password?: string;     
  targetLan?: string;
  goals?: string[];
  difficulty?: string;
};

type SignupCtx = {
  data: SignupData;
  update: (patch: Partial<SignupData>) => void;
  reset: () => void;
};

const Ctx = createContext<SignupCtx | null>(null);
const LS_KEY = "signup_wizard_draft_v1";

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignupData>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch {
      return {};
    }
  });

  // Persist draft between steps/refresh
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);

  const value = useMemo<SignupCtx>(
    () => ({
      data,
      update: (patch) => setData((d) => ({ ...d, ...patch })),
      reset: () => setData({}),
    }),
    [data]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSignup() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSignup must be used inside <SignupProvider>");
  return ctx;
}
