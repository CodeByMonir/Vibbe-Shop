
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
} from "lucide-react";

import { signIn, authClient } from "../lib/auth-client";
import { useAuth } from "@/components/context/AuthContext";

const INITIAL_MODAL_STATE = {
  show: false,
  type: "error",
  message: "",
  onAction: null,
};

export default function AuthPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState("signin");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] =
    useState(false);

  // General state
  const [loading, setLoading] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(
    INITIAL_MODAL_STATE
  );

  // Password strength
  const getPasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        label: "",
        color: "bg-transparent",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        score: 1,
        label: "Weak",
        color: "bg-[#d95338]",
      };
    }

    if (score <= 3) {
      return {
        score: 2,
        label: "Medium",
        color: "bg-[#eab308]",
      };
    }

    return {
      score: 3,
      label: "Strong",
      color: "bg-[#15803d]",
    };
  };

  const passwordStrength = getPasswordStrength(regPassword);

  // Modal helpers
  const showFeedback = (type, message, onAction = null) => {
    setFeedbackModal({
      show: true,
      type,
      message,
      onAction,
    });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal(INITIAL_MODAL_STATE);
  };

  const handleFeedbackContinue = async () => {
    const action = feedbackModal.onAction;

    closeFeedbackModal();

    if (action) {
      await action();
    }
  };

  // Close modal using Escape key
  useEffect(() => {
    if (!feedbackModal.show) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeFeedbackModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [feedbackModal.show]);

  // Redirect after successful authentication
  const redirectAfterAuth = async () => {
    try {
      if (refreshSession) {
        await refreshSession();
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Session refresh failed:", error);

      showFeedback(
        "error",
        "Authentication succeeded, but session synchronization failed. Please refresh the page."
      );
    }
  };

  // Switch authentication tabs
  const switchTab = (tab) => {
    if (loading || tab === activeTab) return;

    setActiveTab(tab);
  };

  // Login handler
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (loading) return;

    const email = loginEmail.trim();

    if (!email || !loginPassword) {
      showFeedback(
        "error",
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password: loginPassword,
      });

      if (res?.error) {
        showFeedback(
          "error",
          res.error.message || "Invalid email or password."
        );
        return;
      }

      showFeedback(
        "success",
        "Signed in successfully. Click Continue to proceed.",
        redirectAfterAuth
      );
    } catch (error) {
      console.error("Sign in error:", error);

      showFeedback(
        "error",
        error?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = regName.trim();
    const email = regEmail.trim();

    // Validate name
    if (!name) {
      showFeedback("error", "Please enter your full name.");
      return;
    }

    // Validate email
    if (!email) {
      showFeedback("error", "Please enter your email address.");
      return;
    }

    // Validate password
    if (regPassword.length < 8) {
      showFeedback(
        "error",
        "Password must contain at least 8 characters."
      );
      return;
    }

    // Confirm password
    if (regPassword !== regConfirmPassword) {
      showFeedback(
        "error",
        "Passwords do not match. Please try again."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password: regPassword,
      });

      if (res?.error) {
        showFeedback(
          "error",
          res.error.message || "Failed to create account."
        );
        return;
      }

      showFeedback(
        "success",
        "Account created successfully. Click Continue to proceed.",
        redirectAfterAuth
      );
    } catch (error) {
      console.error("Sign up error:", error);

      showFeedback(
        "error",
        error?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-[#111827] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#000000] selection:text-white overflow-hidden">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gray-300/40 rounded-full blur-3xl" />

        <div className="relative w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] opacity-[0.05] select-none">
          <Image
            src="/img/logo/vibbeLogo.png"
            alt=""
            fill
            sizes="(max-width: 640px) 340px, 540px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Page Heading */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#000000]">
          {activeTab === "signin"
            ? "Sign In"
            : "Create Account"}
        </h2>

        <p className="mt-2 text-xs text-[#555555]">
          {activeTab === "signin"
            ? "Enter your credentials to access your orders and saved wishlist."
            : "Join Vibbe for order tracking, drop alerts, and saved sizes."}
        </p>
      </div>

      {/* Authentication Container */}
      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border border-white/60 bg-white/05 p-1 mb-4 shadow-sm">
          <button
            type="button"
            disabled={loading}
            onClick={() => switchTab("signin")}
            className={`relative py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 ${
              activeTab === "signin"
                ? "text-white"
                : "text-[#71717A] hover:text-[#000000]"
            }`}
          >
            {activeTab === "signin" && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
                className="absolute inset-0 bg-[#000000]"
              />
            )}

            <span className="relative z-10">Sign In</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => switchTab("signup")}
            className={`relative py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 ${
              activeTab === "signup"
                ? "text-white"
                : "text-[#71717A] hover:text-[#000000]"
            }`}
          >
            {activeTab === "signup" && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
                className="absolute inset-0 bg-[#000000]"
              />
            )}

            <span className="relative z-10">Register</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="min-h-107.5 flex items-center justify-center bg-white/05  border border-white/70 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] p-5 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>

            {/* SIGN IN FORM */}
            {activeTab === "signin" ? (
              <motion.form
                key="signin-form"
                onSubmit={handleSignIn}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{
                  duration: 0.22,
                  ease: "easeInOut",
                }}
                className="w-full space-y-4"
              >
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5"
                  >
                    Email Address
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginEmail}
                    onChange={(e) =>
                      setLoginEmail(e.target.value)
                    }
                    placeholder="name@example.com"
                    className="w-full h-11 px-3 text-xs bg-white/70 backdrop-blur-sm border border-gray-200/80 text-[#000000] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={loginPassword}
                      onChange={(e) =>
                        setLoginPassword(e.target.value)
                      }
                      placeholder="••••••••"
                      className="w-full h-11 pl-3 pr-10 text-xs bg-white/70 backdrop-blur-sm border border-gray-200/80 text-[#000000] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:border-[#000000] transition-colors"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowLoginPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#000000] transition-colors cursor-pointer"
                      aria-label={
                        showLoginPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-4 bg-[#000000] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#222222] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}

                  <span>
                    {loading
                      ? "Signing In..."
                      : "Sign In with Email"}
                  </span>
                </button>
              </motion.form>
            ) : (

              /* SIGN UP FORM */
              <motion.form
                key="signup-form"
                onSubmit={handleSignUp}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{
                  duration: 0.22,
                  ease: "easeInOut",
                }}
                className="w-full space-y-3"
              >
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#000000] mb-1"
                  >
                    Full Name
                  </label>

                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={regName}
                    onChange={(e) =>
                      setRegName(e.target.value)
                    }
                    placeholder="Your full name"
                    className="w-full h-9 px-3 text-xs bg-white/70 backdrop-blur-sm border border-gray-200/80 text-[#000000] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#000000] mb-1"
                  >
                    Email Address
                  </label>

                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={regEmail}
                    onChange={(e) =>
                      setRegEmail(e.target.value)
                    }
                    placeholder="name@example.com"
                    className="w-full h-9 px-3 text-xs bg-white/70 backdrop-blur-sm border border-gray-200/80 text-[#000000] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="reg-password"
                      className="block text-[11px] font-bold uppercase tracking-wider text-[#000000]"
                    >
                      Password
                    </label>

                    {regPassword && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                        Strength:{" "}
                        <span className="text-[#000000]">
                          {passwordStrength.label}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={regPassword}
                      onChange={(e) =>
                        setRegPassword(e.target.value)
                      }
                      placeholder="Minimum 8 characters"
                      className="w-full h-9 pl-3 pr-10 text-xs bg-white/70 backdrop-blur-sm border border-gray-200/80 text-[#000000] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:border-[#000000] transition-colors"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowRegPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#000000] transition-colors cursor-pointer"
                      aria-label={
                        showRegPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Bars */}
                  {regPassword && (
                    <div className="grid grid-cols-3 gap-1 mt-1.5">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 rounded-none transition-colors ${
                            passwordStrength.score >= level
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="reg-confirm-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#000000] mb-1"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      id="reg-confirm-password"
                      type={
                        showRegConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={regConfirmPassword}
                      onChange={(e) =>
                        setRegConfirmPassword(e.target.value)
                      }
                      placeholder="Re-type password"
                      className="w-full h-9 pl-3 pr-10 text-xs bg-white/70 backdrop-blur-sm border border-gray-200/80 text-[#000000] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:border-[#000000] transition-colors"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowRegConfirmPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#000000] transition-colors cursor-pointer"
                      aria-label={
                        showRegConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showRegConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Live Password Match Feedback */}
                  {regConfirmPassword && (
                    <p
                      className={`mt-1 text-[10px] font-semibold ${
                        regPassword === regConfirmPassword
                          ? "text-[#15803d]"
                          : "text-[#d95338]"
                      }`}
                    >
                      {regPassword === regConfirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 mt-1 bg-[#000000] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#222222] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}

                  <span>
                    {loading
                      ? "Creating..."
                      : "Create Account"}
                  </span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeFeedbackModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-modal-title"
              aria-describedby="feedback-modal-description"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="relative w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/60 p-6 shadow-2xl z-10"
            >
              <button
                type="button"
                onClick={closeFeedbackModal}
                className="absolute top-4 right-4 text-[#71717A] hover:text-[#000000] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center pt-2">

                {/* Status Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    feedbackModal.type === "success"
                      ? "bg-[#f0fdf4] text-[#15803d]"
                      : "bg-[#fff5f5] text-[#d95338]"
                  }`}
                >
                  {feedbackModal.type === "success" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </div>

                <h3
                  id="feedback-modal-title"
                  className="text-base font-black uppercase tracking-tight text-[#000000]"
                >
                  {feedbackModal.type === "success"
                    ? "Success"
                    : "Notice"}
                </h3>

                <p
                  id="feedback-modal-description"
                  className="text-xs text-[#555555] mt-2 mb-6 leading-relaxed"
                >
                  {feedbackModal.message}
                </p>

                <button
                  type="button"
                  onClick={
                    feedbackModal.type === "success"
                      ? handleFeedbackContinue
                      : closeFeedbackModal
                  }
                  className="w-full h-10 bg-[#000000] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#222222] transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
