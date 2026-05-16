"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, Camera, ShieldCheck, Lock, Eye, CheckCircle, TreePine, ArrowRight } from "lucide-react";
import TestCredentialHint from "@/components/TestCredentialHint";

export default function IdentityPage() {
  const router = useRouter();
  const [uploaded, setUploaded] = useState(false);
  const [selfie, setSelfie] = useState(false);

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg, #FAF7F2, #F0E6D3)"}}>
      {/* Top nav */}
      <div className="border-b bg-white/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between" style={{borderColor:"#DFC5A0"}}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg, #1B4332, #2D6A4F)"}}>
            <TreePine size={15} className="text-white" />
          </div>
          <span className="font-bold text-sm" style={{fontFamily:"'Playfair Display', serif", color:"#1B4332"}}>Daivajna Samaja</span>
        </Link>
        <div className="flex items-center gap-3">
          {[{n:1,label:"Identity",active:true},{n:2,label:"Lineage",active:false},{n:3,label:"Heritage",active:false}].map(s => (
            <div key={s.n} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={s.active ? {background:"linear-gradient(135deg,#1B4332,#2D6A4F)",color:"white"} : {background:"#DFC5A0",color:"#9CA3AF"}}>
                {s.n}
              </div>
              <span className="text-xs font-medium hidden sm:block" style={{color:s.active?"#1B4332":"#9CA3AF"}}>{s.label}</span>
              {s.n < 3 && <div className="w-8 h-0.5 mx-1" style={{background:s.active?"#1B4332":"#DFC5A0"}} />}
            </div>
          ))}
        </div>
        <div className="w-24" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
          <p className="text-sm font-semibold mb-2" style={{color:"#8B5E3C", letterSpacing:"0.1em"}}>STEP 1 OF 3</p>
          <h1 className="text-4xl font-bold mb-3" style={{fontFamily:"'Playfair Display', serif", color:"#0D2B1E"}}>Verify Your Identity</h1>
          <p className="text-gray-500 mb-8 max-w-2xl leading-relaxed">To maintain the sanctity of our ancestral records, we require a government-issued ID. Your data is end-to-end encrypted and stored in an archival-grade vault — never shared with other members.</p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form - left 2 cols */}
            <div className="lg:col-span-2 space-y-5">
              <TestCredentialHint hints={["Demo: Use Aadhaar Card — just click 'Continue to Lineage' to proceed"]} />

              <div className="rounded-2xl border p-6 space-y-5" style={{background:"white", borderColor:"#DFC5A0"}}>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color:"#1B4332"}}>ID Type</label>
                  <select className="w-full px-4 py-3 text-sm border rounded-xl outline-none" style={{borderColor:"#DFC5A0", background:"white"}}>
                    <option>Aadhaar Card</option><option>PAN Card</option><option>Passport</option>
                  </select>
                </div>

                {/* Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color:"#1B4332"}}>Document Upload</label>
                  <motion.div onClick={() => setUploaded(true)} whileHover={{scale:1.01}} whileTap={{scale:0.99}}
                    className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all"
                    style={{borderColor: uploaded ? "#1B4332" : "#DFC5A0", background: uploaded ? "#F0FBF4" : "white"}}>
                    {uploaded ? (
                      <div>
                        <CheckCircle size={40} className="mx-auto mb-3" style={{color:"#1B4332"}} />
                        <p className="font-semibold" style={{color:"#1B4332"}}>aadhaar_document.pdf</p>
                        <p className="text-sm text-gray-400 mt-1">Upload successful</p>
                      </div>
                    ) : (
                      <div>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:"#F0FBF4"}}>
                          <Upload size={28} style={{color:"#1B4332"}} />
                        </div>
                        <p className="font-semibold text-gray-700 mb-1">Drop your ID document here</p>
                        <p className="text-sm text-gray-400">PDF, JPG, or PNG · Up to 10 MB</p>
                        <button className="mt-4 px-5 py-2 text-sm font-semibold text-white rounded-xl" style={{background:"linear-gradient(135deg, #8B5E3C, #C4823A)"}}>Select File</button>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Selfie */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color:"#1B4332"}}>Selfie Verification</label>
                  <motion.div onClick={() => setSelfie(true)} whileHover={{scale:1.01}}
                    className="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all"
                    style={{borderColor: selfie ? "#1B4332" : "#DFC5A0", background: selfie ? "#F0FBF4" : "white"}}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background: selfie ? "#D1FAE5" : "#F0FBF4"}}>
                      {selfie ? <CheckCircle size={24} style={{color:"#1B4332"}} /> : <Camera size={24} style={{color:"#9CA3AF"}} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{selfie ? "Selfie captured successfully" : "Take a selfie to match your ID photo"}</p>
                      {!selfie && <p className="text-xs mt-1" style={{color:"#1B4332"}}>📷 Open Camera</p>}
                    </div>
                  </motion.div>
                </div>
              </div>

              <button onClick={() => router.push("/onboarding/lineage")}
                className="w-full py-4 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                style={{background:"linear-gradient(135deg, #1B4332, #2D6A4F)", boxShadow:"0 4px 20px rgba(27,67,50,0.3)"}}>
                Continue to Lineage <ArrowRight size={20} />
              </button>
            </div>

            {/* Right: Trust panel */}
            <div className="space-y-4">
              <div className="rounded-2xl p-5" style={{background:"linear-gradient(160deg, #0D2B1E, #1B4332)"}}>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={16} style={{color:"#C4823A"}} />
                  <span className="text-sm font-semibold" style={{color:"#C4823A"}}>Trust &amp; Security</span>
                </div>
                <div className="space-y-3">
                  {[{icon:Lock, text:"AES-256 end-to-end encryption"},{icon:Eye, text:"Never shared with other members"},{icon:ShieldCheck, text:"Archival-grade secure vault"}].map(({icon:Icon,text}) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon size={14} style={{color:"#52B788"}} />
                      <p className="text-green-200 text-xs">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-5 border" style={{background:"white", borderColor:"#DFC5A0"}}>
                <p className="text-xs font-semibold mb-2" style={{color:"#8B5E3C"}}>STEP 1 OF 3</p>
                <p className="text-sm text-gray-600 italic leading-relaxed" style={{fontFamily:"'Playfair Display', serif"}}>
                  &ldquo;A tree is only as strong as its roots. Verification ensures the legacy you build is authentic and lasting.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
