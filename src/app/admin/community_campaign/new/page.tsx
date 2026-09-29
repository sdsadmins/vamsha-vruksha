"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminShell from "../../_components/AdminShell";
import CampaignForm from "../../_components/CampaignForm";
import { errorMessage } from "../../_lib/api";
import { createCampaign, type CampaignInput } from "../../_lib/campaigns";

export default function NewCampaignPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (input: CampaignInput) => {
    setError("");
    setSaving(true);
    try {
      await createCampaign(input);
      router.push("/admin/community_campaign");
    } catch (err) {
      setError(errorMessage(err, "Could not create the campaign"));
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="New Campaign"
      subtitle="Create a welfare fundraiser for members"
      actions={
        <Link href="/admin/community_campaign" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#1B4332" }}>
          <ArrowLeft size={16} /> Back
        </Link>
      }
    >
      <CampaignForm onSubmit={submit} submitLabel="Create campaign" error={error} saving={saving} />
    </AdminShell>
  );
}
