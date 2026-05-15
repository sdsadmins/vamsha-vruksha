import { Info } from "lucide-react";

interface Props {
  hints: string[];
}

export default function TestCredentialHint({ hints }: Props) {
  return (
    <div
      style={{backgroundColor: "#D1FAE5", border: "1px solid #6EE7B7"}}
      className="rounded-lg p-3 flex gap-2"
    >
      <Info size={16} style={{color: "#065F46"}} className="mt-0.5 shrink-0" />
      <div>
        <p style={{color: "#065F46"}} className="text-xs font-semibold mb-1">Test Credentials</p>
        {hints.map((h, i) => (
          <p key={i} style={{color: "#047857"}} className="text-xs">{h}</p>
        ))}
      </div>
    </div>
  );
}
