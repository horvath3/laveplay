import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Gamepad2, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LanguageToggle } from "@/components/LanguageToggle";
import { GlassCard } from "@/components/GlassCard";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Lave Play" },
      { name: "description", content: "Sign in to Lave Play and reach your gaming PC from anywhere." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  // UI-only: no real auth yet. On submit we just route home.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/" });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <AnimatedBackground />

      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_28px_oklch(0.73_0.19_129/0.6)]">
            <Gamepad2 className="h-6 w-6" />
          </span>
          <span className="font-display text-2xl font-extrabold tracking-tight">
            LAVE <span className="text-primary">PLAY</span>
          </span>
        </Link>

        <GlassCard glow className="p-8">
          <h1 className="text-center font-display text-2xl font-bold text-foreground">
            {t("login.welcome")}
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">{t("login.subtitle")}</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">{t("login.email")}</span>
              <div className="glass flex items-center gap-2 rounded-xl px-3.5 py-3 focus-within:border-primary/60">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">{t("login.password")}</span>
              <div className="glass flex items-center gap-2 rounded-xl px-3.5 py-3 focus-within:border-primary/60">
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="toggle password"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 accent-primary" />
                {t("login.remember")}
              </label>
              <button type="button" className="font-medium text-primary hover:underline">
                {t("login.forgot")}
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary-glow hover:shadow-[0_0_28px_oklch(0.73_0.19_129/0.55)]"
            >
              <LogIn className="h-4 w-4" />
              {t("login.signIn")}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("login.or")}
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "Steam"].map((p) => (
              <button
                key={p}
                type="button"
                className="glass rounded-xl py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                {p}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("login.noAccount")}{" "}
            <button type="button" className="font-semibold text-primary hover:underline">
              {t("login.signUp")}
            </button>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
