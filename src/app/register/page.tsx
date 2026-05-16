"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TreePine, ArrowRight, CheckCircle, Users, Shield, Heart } from "lucide-react";
import TestCredentialHint from "@/components/TestCredentialHint";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details"|"otp">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!name.trim() || phone.length < 10) { setError("Please fill all fields correctly"); return; }
    setError(""); setStep("otp");
  };

  const handleVerify = () => {
    if (otp !== "121212") { setError("Invalid OTP. Use 121212 for demo."); return; }
    setLoading(true);
    const user = { name, phone, role:"member" as const, gotra:"Kashyap", native:"Karnataka", avatar: name.split(" ").map((w:string)=>w[0]).join("").toUpperCase().slice(0,2) };
    if (typeof window !== "undefined") localStorage.setItem("vv_user", JSON.stringify(user));
    setTimeout(() => router.push("/onboarding/identity"), 600);
  };

  return (
    <div className="min-h-screen flex" style={{backgroundColor:"#0D2B1E"}}>
      {/* LEFT Panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{background:"linear-gradient(160deg, #061410 0%, #0D2B1E 50%, #1B4332 100%)"}}>
        <div>
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg, #8B5E3C, #C4823A)"}}>
              <TreePine size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold" style={{fontFamily:"'Playfair Display', serif"}}>Daivajna Samaja</p>
              <p className="text-green-400 text-xs">Daivajna Samaja Bangalore</p>
            </div>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4" style={{fontFamily:"'Playfair Display', serif", lineHeight:1.2}}>
            Begin your<br /><span className="gold-shimmer">lineage journey</span><br />today.
          </h2>
          <p className="text-green-200 text-base leading-relaxed">Join 1,428 families who have documented their heritage and connected with their ancestral roots on Daivajna Samaja.</p>
        </div>
        <div className="space-y-4">
          {[
            {icon:Shield, text:"Government ID verified — secure and private"},
            {icon:Users, text:"Connect with relatives already on the platform"},
            {icon:Heart, text:"Access matrimonial hub and welfare campaigns"},
          ].map(({icon:Icon, text}) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(212,175,122,0.15)"}}>
                <Icon size={16} style={{color:"#C4823A"}} />
              </div>
              <p className="text-green-300 text-sm">{text}</p>
            </div>
          ))}
        </div>
        <p className="text-green-600 text-xs">© 2024 Daivajna Samaja. Preserving Legacies for Generations.</p>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16" style={{backgroundColor:"#FAF7F2"}}>
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg, #1B4332, #2D6A4F)"}}>
              <TreePine size={16} className="text-white" />
            </div>
            <span className="font-bold" style={{fontFamily:"'Playfair Display', serif", color:"#1B4332"}}>Daivajna Samaja</span>
          </Link>
          <AnimatePresence mode="wait">
            {step === "details" ? (
              <motion.div key="details" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h1 className="text-3xl font-bold mb-2" style={{fontFamily:"'Playfair Display', serif", color:"#0D2B1E"}}>Join the Samaj</h1>
                <p className="text-gray-500 mb-8">Create your account and begin documenting your lineage</p>
                <div className="space-y-4">
                  <TestCredentialHint hints={["Name: Aditi Rao  |  Phone: 9876543210  |  OTP: 121212"]} />
                  {[{label:"Full Name",placeholder:"e.g. Aditi Rao",val:name,set:setName,type:"text"},{label:"Mobile Number",placeholder:"9876543210",val:phone,set:(v:string)=>setPhone(v.replace(/\D/g,"")),type:"tel",maxLen:10}].map(({label,placeholder,val,set,type,maxLen}) => (
                    <div key={label}>
                      <label className="block text-sm font-semibold mb-2" style={{color:"#1B4332"}}>{label}</label>
                      <input type={type} placeholder={placeholder} value={val}
                        onChange={e => (set as (v:string)=>void)(e.target.value)}
                        maxLength={maxLen}
                        className="w-full px-4 py-3 text-sm border rounded-xl outline-none transition-all bg-white"
                        style={{borderColor:"#DFC5A0"}}
                        onFocus={e => e.target.style.borderColor="#1B4332"}
                        onBlur={e => e.target.style.borderColor="#DFC5A0"}
                      />
                    </div>
                  ))}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button onClick={handleNext}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    style={{background:"linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow:"0 4px 16px rgba(27,67,50,0.3)"}}>
                    Continue <ArrowRight size={18} />
                  </button>
                  <p className="text-center text-sm text-gray-500">Already a member? <Link href="/login" className="font-semibold" style={{color:"#1B4332"}}>Sign in</Link></p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h1 className="text-3xl font-bold mb-2" style={{fontFamily:"'Playfair Display', serif", color:"#0D2B1E"}}>Verify number</h1>
                <p className="text-gray-500 mb-8">OTP sent to <strong>+91 {phone}</strong></p>
                <div className="space-y-4">
                  <TestCredentialHint hints={["Enter OTP: 121212"]} />
                  <input type="text" maxLength={6} placeholder="1 2 1 2 1 2" value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g,""))}
                    className="w-full px-6 py-4 text-center text-3xl font-bold tracking-widest border rounded-xl outline-none bg-white"
                    style={{borderColor:"#DFC5A0", color:"#1B4332", letterSpacing:"0.3em"}}
                    onFocus={e => e.target.style.borderColor="#1B4332"}
                    onBlur={e => e.target.style.borderColor="#DFC5A0"}
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button onClick={handleVerify} disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
                    style={{background:"linear-gradient(135deg, #1B4332, #2D6A4F)", opacity:loading?0.7:1}}>
                    {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>&nbsp;Creating account...</> : <><CheckCircle size={18}/> Create Account &amp; Continue</>}
                  </button>
                  <button onClick={() => {setStep("details");setError("");}} className="w-full text-sm text-gray-500 hover:text-gray-700">← Back</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
