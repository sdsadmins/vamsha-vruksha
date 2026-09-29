"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminShell, { ErrorText, Spinner } from "../../_components/AdminShell";
import CampaignForm from "../../_components/CampaignForm";
import { errorMessage } from "../../_lib/api";
import { getCampaign, updateCampaign, type Campaign, type CampaignInput } from "../../_lib/campaigns";

export default function EditCampaignPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCampaign(slug)
      .then((c) => { if (!cancelled) setCampaign(c); })
      .catch((err) => { if (!cancelled) { setCampaign(null); setError(errorMessage(err)); } });
    return () => { cancelled = true; };
  }, [slug]);

  const submit = async (input: CampaignInput) => {
    setError("");
    setSaving(true);
    try {
      const updated = await updateCampaign(slug, input);
      setCampaign(updated);
      setNotice("Campaign saved.");
      if (updated.slug !== slug) router.replace(`/admin/community_campaign/${updated.slug}`);
      setTimeout(() => setNotice(""), 2500);
    } catch (err) {
      setError(errorMessage(err, "Could not save the campaign"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title={campaign?.title ?? "Edit Campaign"}
      subtitle={campaign ? `Campaign id: ${campaign.slug}` : undefined}
      actions={
        <Link href="/admin/community_campaign" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#1B4332" }}>
          <ArrowLeft size={16} /> Back
        </Link>
      }
    >
      {notice && <p className="mb-4 text-sm rounded-xl px-4 py-3" style={{ background: "#D8F3DC", color: "#1B4332" }}>{notice}</p>}
      {campaign === undefined ? (
        <Spinner />
      ) : campaign === null ? (
        <ErrorText>{error || `No campaign with id "${slug}".`}</ErrorText>
      ) : (
        <CampaignForm key={campaign.slug + campaign.status + campaign.endsAt} initial={campaign} onSubmit={submit} submitLabel="Save changes" error={error} saving={saving} />
      )}
    </AdminShell>
  );
}
