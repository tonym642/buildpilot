"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { C } from "../../lib/constants";
import GlobalStyles from "../../components/GlobalStyles";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status messages per section
  const [profileMsg, setProfileMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [emailMsg, setEmailMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data?.user;
      if (!u) { router.replace("/"); return; }
      setUser(u);
      setEmail(u.email ?? "");

      // Load persisted profile from profiles table; fall back to auth metadata
      const { data: profile } = await supabase!
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", u.id)
        .single();

      setFullName(profile?.full_name ?? u.user_metadata?.full_name ?? "");
      setAvatarUrl(profile?.avatar_url ?? u.user_metadata?.avatar_url ?? null);
      setLoading(false);
    });
  }, [router]);

  // Ensures a profiles row exists for the current user before any write
  async function ensureProfileRow(u: any) {
    await supabase!.from("profiles").upsert(
      { id: u.id, email: u.email ?? "" },
      { onConflict: "id", ignoreDuplicates: true }
    );
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !user) return;
    setAvatarUploading(true);
    setProfileMsg(null);

    // Guarantee the profile row exists before touching storage
    await ensureProfileRow(user);

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setProfileMsg({ text: uploadError.message, ok: false });
      setAvatarUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = urlData.publicUrl;

    // Write avatar_url to profiles table (id = auth.uid() satisfies RLS)
    // email is always included to satisfy the NOT NULL constraint on INSERT
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email, avatar_url: url }, { onConflict: "id" });

    if (profileError) {
      setProfileMsg({ text: profileError.message, ok: false });
    } else {
      // Keep auth metadata in sync
      await supabase.auth.updateUser({ data: { avatar_url: url } });
      setAvatarUrl(url);
      setProfileMsg({ text: "Photo updated.", ok: true });
    }
    setAvatarUploading(false);
  }

  async function handleSaveProfile() {
    if (!supabase || !user) return;
    setSavingProfile(true);
    setProfileMsg(null);

    // Write to profiles table — id must equal auth.uid() to satisfy RLS
    // email comes from state (set from u.email on mount) to avoid user.email being undefined
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, email }, { onConflict: "id" });

    if (!error) {
      // Keep auth metadata in sync
      await supabase.auth.updateUser({ data: { full_name: fullName } });
    }
    setSavingProfile(false);
    setProfileMsg(error ? { text: error.message, ok: false } : { text: "Name saved.", ok: true });
  }

  async function handleSaveEmail() {
    if (!supabase) return;
    setSavingEmail(true);
    setEmailMsg(null);
    const { error } = await supabase.auth.updateUser({ email });
    setSavingEmail(false);
    setEmailMsg(error
      ? { text: error.message, ok: false }
      : { text: "Confirmation sent to new email address.", ok: true }
    );
  }

  async function handleSavePassword() {
    if (!supabase) return;
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Passwords do not match.", ok: false });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: "Password must be at least 6 characters.", ok: false });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (!error) { setNewPassword(""); setConfirmPassword(""); }
    setPasswordMsg(error ? { text: error.message, ok: false } : { text: "Password updated.", ok: true });
  }

  const initial = (fullName || email || "U")[0].toUpperCase();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: C.font, color: C.muted, fontSize: 15 }}>
        <GlobalStyles />
        Loading…
      </div>
    );
  }

  if (!supabase) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: C.font }}>
        <GlobalStyles />
        <div style={cardStyle}>
          <div style={headingStyle}>Profile</div>
          <div style={{ color: C.textSub, fontSize: 14 }}>Profile settings require Supabase to be configured.</div>
          <button onClick={() => router.back()} style={saveBtnStyle}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.font, color: C.text, padding: "48px 16px" }}>
      <GlobalStyles />
      <div style={{ maxWidth: 460, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", color: C.textSub, fontSize: 20, cursor: "pointer", lineHeight: 1, padding: "6px", borderRadius: 8, transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >←</button>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Profile</div>
        </div>

        {/* Avatar + Name */}
        <div style={cardStyle}>
          <div style={sectionLabelStyle}>Photo &amp; Name</div>

        {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.border}` }} />
              ) : (
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff" }}>
                  {initial}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                title="Upload photo"
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 24, height: 24, borderRadius: "50%",
                  background: C.accent, border: `2px solid ${C.panelBg}`,
                  color: "#fff", fontSize: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                {avatarUploading ? "…" : "+"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
            </div>
            <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>
              JPG, PNG, or WebP.<br />Max 5 MB recommended.
            </div>
          </div>

          {/* Full name */}
          <label style={labelStyle}>Full name</label>
          <input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />
          {profileMsg && <div style={msgStyle(profileMsg.ok)}>{profileMsg.text}</div>}
          <button onClick={handleSaveProfile} disabled={savingProfile} style={saveBtnStyle}>
            {savingProfile ? "Saving…" : "Save name"}
          </button>
        </div>

        {/* Email */}
        <div style={cardStyle}>
          <div style={sectionLabelStyle}>Email address</div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          {emailMsg && <div style={msgStyle(emailMsg.ok)}>{emailMsg.text}</div>}
          <button onClick={handleSaveEmail} disabled={savingEmail} style={saveBtnStyle}>
            {savingEmail ? "Saving…" : "Update email"}
          </button>
        </div>

        {/* Password */}
        <div style={cardStyle}>
          <div style={sectionLabelStyle}>Change password</div>
          <label style={labelStyle}>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New password"
            style={{ ...inputStyle, marginBottom: 10 }}
          />
          <label style={labelStyle}>Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            style={inputStyle}
          />
          {passwordMsg && <div style={msgStyle(passwordMsg.ok)}>{passwordMsg.text}</div>}
          <button onClick={handleSavePassword} disabled={savingPassword || !newPassword} style={saveBtnStyle}>
            {savingPassword ? "Saving…" : "Update password"}
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Styles ---
const cardStyle: React.CSSProperties = {
  background: C.panelBg,
  border: `1px solid ${C.border}`,
  borderRadius: 18,
  padding: "28px 32px",
  boxShadow: C.shadowMd,
  display: "flex",
  flexDirection: "column",
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: C.muted,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 18,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: C.textSub,
  marginBottom: 7,
  display: "block",
};

const inputStyle: React.CSSProperties = {
  fontSize: 14,
  padding: "11px 14px",
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  background: C.cardBg,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: C.text,
  outline: "none",
  marginBottom: 16,
  width: "100%",
  boxSizing: "border-box",
  transition: "border 0.15s, box-shadow 0.15s",
};

const saveBtnStyle: React.CSSProperties = {
  background: C.accent,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "10px 22px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  alignSelf: "flex-start",
  marginTop: 4,
  transition: "background 0.15s",
};

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 8,
  letterSpacing: "-0.02em",
  color: C.text,
};

function msgStyle(ok: boolean): React.CSSProperties {
  return {
    fontSize: 13,
    color: ok ? C.success : C.error,
    marginBottom: 10,
    marginTop: -8,
    padding: "8px 12px",
    borderRadius: 8,
    background: ok ? "rgba(74, 174, 127, 0.08)" : C.errorBg,
    border: `1px solid ${ok ? "rgba(74, 174, 127, 0.2)" : "rgba(217, 95, 95, 0.2)"}`,
  };
}
