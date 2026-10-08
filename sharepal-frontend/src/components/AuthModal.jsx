import {
  useEffect,
  useRef,
  useState
} from "react";

import { useAuth } from "../context/AuthContext.jsx";

function normalizePhone(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

export default function AuthModal({ onClose }) {
  const {
    sendOtp,
    verifyOtp
  } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("phone");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [resendIn, setResendIn] = useState(0);

  const otpRef = useRef(null);

  useEffect(() => {
    if (
      step !== "otp" ||
      !resendIn
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendIn((value) =>
        Math.max(0, value - 1)
      );
    }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [step, resendIn]);

  useEffect(() => {
    if (step === "otp") {
      otpRef.current?.focus();
    }
  }, [step]);

  const handleSendOtp = async (event) => {
    event.preventDefault();

    setError("");

    const cleanPhone =
      normalizePhone(phone);

    if (cleanPhone.length !== 10) {
      setError(
        "Please enter a valid 10-digit WhatsApp number."
      );

      return;
    }

    setLoading(true);

    try {
      const result =
        await sendOtp(cleanPhone);

      if (result?.devOtp) {
        console.info(
          `SharePal development OTP: ${result.devOtp}`
        );
      }

      setStep("otp");
      setResendIn(30);
    } catch (err) {
      setError(
        err.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");

    const cleanOtp = otp
      .replace(/\D/g, "")
      .slice(0, 6);

    if (cleanOtp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    setLoading(true);

    try {
      await verifyOtp(
        normalizePhone(phone),
        cleanOtp
      );

      onClose?.();
    } catch (err) {
      setError(
        err.message ||
          "Unable to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (
      resendIn > 0 ||
      loading
    ) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result =
        await sendOtp(
          normalizePhone(phone)
        );

      if (result?.devOtp) {
        console.info(
          `SharePal development OTP: ${result.devOtp}`
        );
      }

      setResendIn(30);
      setOtp("");
    } catch (err) {
      setError(
        err.message ||
          "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const goBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setError("");
  };

  return (
    <div
      className="auth-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <div
        className="auth-modal auth-modal--sharepal"
        role="dialog"
        aria-modal="true"
        aria-label="Login or signup"
      >
        <button
          type="button"
          className="auth-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div
          className="auth-modal__brand"
          aria-label="SharePal"
        >
          <span>Share</span>
          <em>Pal</em>
        </div>

        {step === "phone" ? (
          <>
            <h2>
              Login/Signup to Your Account
            </h2>

            <p className="auth-modal__subtitle">
              Enter your WhatsApp number to
              continue
            </p>

            <form
              className="auth-phone-form"
              onSubmit={handleSendOtp}
            >
              <div className="phone-field">
                <button
                  type="button"
                  className="phone-field__country"
                  aria-label="Country code"
                >
                  +91 <span>⌄</span>
                </button>

                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Enter your number"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      normalizePhone(
                        event.target.value
                      )
                    )
                  }
                  maxLength={10}
                  aria-label="WhatsApp number"
                />
              </div>

              <div className="auth-coupon">
                <div
                  className="auth-coupon__art"
                  aria-hidden="true"
                >
                  <span>✦</span>
                  <span>◈</span>
                  <span>✧</span>
                </div>

                <div>
                  <div>
                    <strong>
                      Use code SHAREPAL &amp; get
                      10%
                    </strong>{" "}
                    on orders above ₹1500.{" "}
                    <b>
                      Maximum discount: ₹300
                    </b>
                  </div>

                  <div className="auth-coupon__code">
                    Use Coupon - SHAREPAL
                  </div>
                </div>
              </div>

              {error && (
                <div className="auth-modal__error">
                  {error}
                </div>
              )}

              <button
                className="auth-otp-button"
                type="submit"
                disabled={
                  loading ||
                  phone.length !== 10
                }
              >
                {loading ? (
                  "Sending OTP..."
                ) : (
                  <>
                    Get OTP{" "}
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Enter OTP</h2>

            <p className="auth-modal__subtitle">
              Enter the 6-digit OTP sent to
              +91 {phone}
            </p>

            <form
              className="auth-phone-form"
              onSubmit={handleVerifyOtp}
            >
              <input
                ref={otpRef}
                className="otp-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter OTP"
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                maxLength={6}
                aria-label="OTP"
              />

              {error && (
                <div className="auth-modal__error">
                  {error}
                </div>
              )}

              <button
                className="auth-otp-button auth-otp-button--active"
                type="submit"
                disabled={
                  loading ||
                  otp.length !== 6
                }
              >
                {loading
                  ? "Verifying..."
                  : (
                    <>
                      Verify &amp; Continue{" "}
                      <span>→</span>
                    </>
                  )}
              </button>
            </form>

            <div className="auth-modal__otp-actions">
              <button
                type="button"
                onClick={goBackToPhone}
              >
                Change number
              </button>

              <button
                type="button"
                onClick={resendOtp}
                disabled={
                  resendIn > 0 ||
                  loading
                }
              >
                {resendIn > 0
                  ? `Resend OTP in ${resendIn}s`
                  : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        <p className="auth-modal__terms">
          By continuing, you agree to the{" "}
          <a
            href="#terms"
            onClick={(event) =>
              event.preventDefault()
            }
          >
            Terms of Service
          </a>{" "}
          and
          <br />
          acknowledge the{" "}
          <a
            href="#privacy"
            onClick={(event) =>
              event.preventDefault()
            }
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}