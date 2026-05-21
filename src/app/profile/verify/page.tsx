"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, Phone, MapPin, Shield, Edit3,
  RefreshCw, Clock, AlertCircle, ArrowLeft, X, Map
} from "lucide-react";
import SidebarLayout from "@/components/SidebarLayout";
import { getUser, type VVUser } from "@/lib/auth";
import { AVATAR_SVGS } from "@/lib/avatarSvgs";

type Modal = null | "mobile-otp" | "mobile-edit" | "address-edit" | "confirmed";

export default function VerifyPage() {
  const router = useRouter();
  const [user, setUser] = useState<VVUser | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [address, setAddress] = useState(`"The Banyan House", Plot 42, Heritage Enclave,\nJayanagar 4th Block, Bengaluru,\nKarnataka - 560011`);
  const [mobileVerified, setMobileVerified] = useState(true);
  const [editMobileDraft, setEditMobileDraft] = useState("");
  const [editAddressDraft, setEditAddressDraft] = useState("");

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "Member";

  const sendOtp = () => { setOtpSent(true); setOtpError(false); setOtpValue(""); };

  const verifyOtp = () => {
    if (otpValue === "121212") {
      setMobileVerified(true);
      setOtpError(false);
      setModal("confirmed");
    } else {
      setOtpError(true);
    }
  };

  const saveMobile = () => {
    if (editMobileDraft.trim()) setMobile(editMobileDraft.trim());
    setModal(null);
  };

  const saveAddress = () => {
    if (editAddressDraft.trim()) setAddress(editAddressDraft.trim());
    setModal(null);
  };

  const handleConfirm = () => setModal("confirmed");

  return (
    <SidebarLayout title="Verify & Update">
      <div className="max-w-lg mx-auto">

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
            Family Profile Security
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Please review and confirm the current contact details for{" "}
            <strong style={{ color: "#0D2B1E" }}>{user?.name ?? "..."}</strong> to ensure their profile
            stays secure and the lineage records remain accurate.
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
            <Clock size={12} />
            Last Updated: Oct 24, 2023 · 2:15 PM
          </div>
        </div>

        {/* Member Card */}
        <div className="rounded-2xl border p-4 mb-4 flex items-center gap-4"
          style={{ background: "white", borderColor: "#DFC5A0" }}>
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2"
            style={{ borderColor: "#C4823A" }}>
            <img
              src={user ? (AVATAR_SVGS[user.avatar] ?? "") : ""}
              alt={user?.name ?? "Member"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: "#0D2B1E", fontFamily: "'Playfair Display', serif" }}>
              {user?.name ?? "Loading…"}
            </p>
            <p className="text-xs font-semibold tracking-widest mt-0.5" style={{ color: "#8B5E3C" }}>
              HEAD OF HOUSEHOLD · GEN 3
            </p>
          </div>
        </div>

        {/* Mobile Number Card */}
        <div className="rounded-2xl border p-4 mb-4" style={{ background: "white", borderColor: "#DFC5A0" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold tracking-widest text-gray-400">MOBILE NUMBER</p>
            <button
              onClick={() => { setEditMobileDraft(mobile); setModal("mobile-edit"); }}
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#1B4332" }}>
              <Edit3 size={11} /> Change
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-lg font-bold" style={{ color: "#0D2B1E" }}>{mobile}</p>
            {mobileVerified && <CheckCircle size={16} style={{ color: "#1B4332" }} />}
          </div>
          {/* Verify hint */}
          <div className="rounded-xl p-3" style={{ background: "#F0FBF4", border: "1px solid #B7E4C7" }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={13} style={{ color: "#1B4332" }} />
              <p className="text-xs font-semibold" style={{ color: "#1B4332" }}>
                Verify this number to maintain access
              </p>
            </div>
            <button
              onClick={() => { setOtpSent(false); setOtpValue(""); setOtpError(false); setModal("mobile-otp"); }}
              className="w-full py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
              Verify with OTP
            </button>
          </div>
        </div>

        {/* Residential Address Card */}
        <div className="rounded-2xl border p-4 mb-6" style={{ background: "white", borderColor: "#DFC5A0" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold tracking-widest text-gray-400">RESIDENTIAL ADDRESS</p>
            <button
              onClick={() => { setEditAddressDraft(address); setModal("address-edit"); }}
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#1B4332" }}>
              <Edit3 size={11} /> Edit
            </button>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#0D2B1E" }}>
            {address.split("\n").map((line, i) => (
              <span key={i}>{line}{i < address.split("\n").length - 1 && <br />}</span>
            ))}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 px-3 py-2 rounded-lg"
            style={{ background: "#F7F0E8" }}>
            <Map size={12} style={{ color: "#8B5E3C" }} />
            Pinned location on Ancestral Map
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #0D2B1E, #1B4332)", boxShadow: "0 4px 16px rgba(27,67,50,0.3)" }}>
            Confirm Current Details
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 rounded-2xl font-semibold text-sm border transition-all hover:bg-gray-50"
            style={{ borderColor: "#DFC5A0", color: "#374151" }}>
            Remind me in 30 days
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-gray-400 leading-relaxed">
          Your data security is our priority. These details are only visible to verified family members within the Vamsha Vruksha lineage tree.
        </p>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>

        {/* OTP Modal */}
        {modal === "mobile-otp" && (
          <ModalOverlay onClose={() => setModal(null)}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "#F0FBF4" }}>
                <Phone size={26} style={{ color: "#1B4332" }} />
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                Verify Mobile Number
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                We&apos;ll send a one-time code to <strong>{mobile}</strong>
              </p>
              {!otpSent ? (
                <button onClick={sendOtp}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
                  style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                  Send OTP
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                    OTP sent! Use <strong>121212</strong> for this demo.
                  </p>
                  <input
                    type="text" maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otpValue}
                    onChange={e => { setOtpValue(e.target.value.replace(/\D/g, "")); setOtpError(false); }}
                    className="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 border rounded-xl outline-none font-bold"
                    style={{ borderColor: otpError ? "#EF4444" : "#DFC5A0", color: "#0D2B1E" }}
                  />
                  {otpError && (
                    <p className="text-xs text-red-500 flex items-center justify-center gap-1">
                      <AlertCircle size={12} /> Incorrect OTP. Try 121212.
                    </p>
                  )}
                  <button onClick={verifyOtp} disabled={otpValue.length !== 6}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                    Verify &amp; Continue
                  </button>
                  <button onClick={sendOtp}
                    className="text-xs text-gray-400 flex items-center justify-center gap-1 mx-auto hover:text-gray-600">
                    <RefreshCw size={11} /> Resend OTP
                  </button>
                </div>
              )}
            </div>
          </ModalOverlay>
        )}

        {/* Mobile Edit Modal */}
        {modal === "mobile-edit" && (
          <ModalOverlay onClose={() => setModal(null)}>
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Update Mobile Number
            </h3>
            <p className="text-xs text-gray-400 mb-4">Enter your new mobile number below.</p>
            <p className="text-xs font-semibold text-gray-500 mb-1">CURRENT</p>
            <div className="px-4 py-3 rounded-xl mb-4 text-sm line-through text-gray-400"
              style={{ background: "#F7F0E8" }}>{mobile}</div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">NEW NUMBER</p>
            <input
              type="tel"
              value={editMobileDraft}
              onChange={e => setEditMobileDraft(e.target.value)}
              className="w-full px-4 py-3 text-sm border rounded-xl outline-none mb-4"
              style={{ borderColor: "#1B4332" }}
            />
            <div className="flex gap-3">
              <button onClick={saveMobile}
                disabled={!editMobileDraft.trim() || editMobileDraft === mobile}
                className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                Save Changes
              </button>
              <button onClick={() => setModal(null)}
                className="px-5 py-3 rounded-xl font-semibold text-sm border"
                style={{ borderColor: "#DFC5A0", color: "#374151" }}>
                Cancel
              </button>
            </div>
          </ModalOverlay>
        )}

        {/* Address Edit Modal */}
        {modal === "address-edit" && (
          <ModalOverlay onClose={() => setModal(null)}>
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
              Update Residential Address
            </h3>
            <p className="text-xs text-gray-400 mb-4">Edit your current address below.</p>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">ADDRESS</p>
            <textarea
              rows={4}
              value={editAddressDraft}
              onChange={e => setEditAddressDraft(e.target.value)}
              className="w-full px-4 py-3 text-sm border rounded-xl outline-none resize-none mb-4"
              style={{ borderColor: "#1B4332" }}
            />
            <div className="flex gap-3">
              <button onClick={saveAddress}
                disabled={!editAddressDraft.trim() || editAddressDraft === address}
                className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                Save Changes
              </button>
              <button onClick={() => setModal(null)}
                className="px-5 py-3 rounded-xl font-semibold text-sm border"
                style={{ borderColor: "#DFC5A0", color: "#374151" }}>
                Cancel
              </button>
            </div>
          </ModalOverlay>
        )}

        {/* Confirmed State */}
        {modal === "confirmed" && (
          <ModalOverlay onClose={() => setModal(null)}>
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, #D1FAE5, #B7E4C7)" }}>
                <CheckCircle size={40} style={{ color: "#1B4332" }} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0D2B1E" }}>
                Details Confirmed
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Your profile security has been updated. The Elder committee has been notified.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3.5 rounded-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}>
                Back to Dashboard
              </button>
            </div>
          </ModalOverlay>
        )}

      </AnimatePresence>
    </SidebarLayout>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: "white" }}
        onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <X size={16} className="text-gray-400" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
