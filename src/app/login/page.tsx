"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TreePine, ArrowRight, Shield, Users, Heart, CheckCircle } from "lucide-react";
import { verifyOtp, saveUser } from "@/lib/auth";
import TestCredentialHint from "@/components/TestCredentialHint";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone"|"otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) { setError("Enter a valid 10-digit phone number"); return; }
    setError(""); setStep("otp");
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      const user = verifyOtp(phone, otp);
      if (!user) { setError("Invalid OTP. Use 121212 for the demo."); setLoading(false); return; }
      saveUser(user);
      router.push(user.role === "elder" ? "/elder" : "/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex" style={{backgroundColor:"#0D2B1E"}}>
      {/* LEFT: Branding Panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{background:"linear-gradient(160deg, #061410 0%, #0D2B1E 50%, #1B4332 100%)"}}>
        {/* Background SVG mini tree */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <line x1="200" y1="100" x2="120" y2="220" stroke="#D4AF7A" strokeWidth="1.5" strokeDasharray="200" className="tree-line"/>
            <line x1="200" y1="100" x2="280" y2="220" stroke="#D4AF7A" strokeWidth="1.5" strokeDasharray="200" className="tree-line delay-200"/>
            <line x1="120" y1="220" x2="80" y2="340" stroke="#52B788" strokeWidth="1" strokeDasharray="200" className="tree-line delay-400"/>
            <line x1="120" y1="220" x2="160" y2="340" stroke="#52B788" strokeWidth="1" strokeDasharray="200" className="tree-line delay-500"/>
            <line x1="280" y1="220" x2="240" y2="340" stroke="#52B788" strokeWidth="1" strokeDasharray="200" className="tree-line delay-600"/>
            <line x1="280" y1="220" x2="320" y2="340" stroke="#52B788" strokeWidth="1" strokeDasharray="200" className="tree-line delay-700"/>
            {[{cx:200,cy:100,r:20,fill:"#A67C52"},{cx:120,cy:220,r:16,fill:"#1B4332"},{cx:280,cy:220,r:16,fill:"#1B4332"},{cx:80,cy:340,r:12,fill:"#2D6A4F"},{cx:160,cy:340,r:12,fill:"#2D6A4F"},{cx:240,cy:340,r:12,fill:"#2D6A4F"},{cx:320,cy:340,r:12,fill:"#2D6A4F"}].map((n,i) => (
              <circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} className={`tree-node delay-${(i+1)*200}`}/>
            ))}
          </svg>
        </div>

        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg, #A67C52, #D4AF7A)"}}>
              <TreePine size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold" style={{fontFamily:"'Playfair Display', serif"}}>Vamsha Vruksha</p>
              <p className="text-green-400 text-xs">Daivadnya Samaj Bangalore</p>
            </div>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4" style={{fontFamily:"'Playfair Display', serif", lineHeight:1.2}}>
            Your lineage.<br />
            <span className="gold-shimmer">Your legacy.</span><br />
            One portal.
          </h2>
          <p className="text-green-200 text-base leading-relaxed">
            Connect with 1,428 families, trace your ancestral roots, and contribute to community welfare — all in one verified platform.
          </p>
        </div>

        {/* Trust items */}
        <div className="space-y-4">
          {[
            {icon:Shield, text:"Aadhaar-verified identity for every member"},
            {icon:Users, text:"Peer-vouched lineage connections"},
            {icon:Heart, text:"Community welfare with full transparency"},
          ].map(({icon:Icon, text}) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(212,175,122,0.15)"}}>
                <Icon size={16} style={{color:"#D4AF7A"}} />
              </div>
              <p className="text-green-300 text-sm">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-green-600 text-xs">© 2024 Vamsha Vruksha. Preserving Legacies for Generations.</p>
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16" style={{backgroundColor:"#FAF7F2"}}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg, #1B4332, #2D6A4F)"}}>
              <TreePine size={16} className="text-white" />
            </div>
            <span className="font-bold" style={{fontFamily:"'Playfair Display', serif", color:"#1B4332"}}>Vamsha Vruksha</span>
          </Link>

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div key="phone" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h1 className="text-3xl font-bold mb-2" style={{fontFamily:"'Playfair Display', serif", color:"#0D2B1E"}}>Welcome back</h1>
                <p className="text-gray-500 mb-8">Enter your registered mobile number to continue</p>
                <div className="space-y-4">
                  <TestCredentialHint hints={["Phone: 9876543210 → Aditi Rao (Member)","Phone: 9999999999 → Shri Raghavan (Elder)","OTP for all accounts: 121212"]} />
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{color:"#1B4332"}}>Mobile Number</label>
                    <div className="flex">
                      <span className="px-4 py-3 text-sm border-y border-l rounded-l-xl bg-white font-medium" style={{borderColor:"#E8D5BC", color:"#4B5563"}}>+91</span>
                      <input type="tel" maxLength={10} placeholder="9876543210" value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g,""))}
                        className="flex-1 px-4 py-3 text-sm border rounded-r-xl outline-none transition-all"
                        style={{borderColor:"#E8D5BC", background:"white"}}
                        onFocus={e => e.target.style.borderColor="#1B4332"}
                        onBlur={e => e.target.style.borderColor="#E8D5BC"}
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm flex items-center gap-2"><span>⚠</span> {error}</p>}
                  <button onClick={handleSendOtp}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    style={{background:"linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow:"0 4px 16px rgba(27,67,50,0.3)"}}>
                    Send OTP <ArrowRight size={18} />
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    New to Vamsha Vruksha?{" "}
                    <Link href="/register" className="font-semibold hover:underline" style={{color:"#1B4332"}}>Create account</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                <h1 className="text-3xl font-bold mb-2" style={{fontFamily:"'Playfair Display', serif", color:"#0D2B1E"}}>Verify your number</h1>
                <p className="text-gray-500 mb-8">OTP sent to <strong>+91 {phone}</strong></p>
                <div className="space-y-4">
                  <TestCredentialHint hints={["Enter OTP: 121212 (works for all demo accounts)"]} />
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{color:"#1B4332"}}>6-Digit OTP</label>
                    <input type="text" maxLength={6} placeholder="1 2 1 2 1 2" value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g,""))}
                      className="w-full px-6 py-4 text-center text-3xl font-bold tracking-widest border rounded-xl outline-none transition-all"
                      style={{borderColor:"#E8D5BC", background:"white", color:"#1B4332", fontFamily:"monospace", letterSpacing:"0.3em"}}
                      onFocus={e => e.target.style.borderColor="#1B4332"}
                      onBlur={e => e.target.style.borderColor="#E8D5BC"}
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button onClick={handleVerify} disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
                    style={{background:"linear-gradient(135deg, #1B4332, #2D6A4F)", opacity:loading?0.7:1}}>
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>&nbsp;Verifying...</>
                    ) : (
                      <><CheckCircle size={18}/> Enter Portal</>
                    )}
                  </button>
                  <button onClick={() => {setStep("phone");setError("");}} className="w-full text-sm text-gray-500 hover:text-gray-700">
                    ← Change number
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
