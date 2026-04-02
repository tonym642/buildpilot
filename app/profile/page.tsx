"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { C } from "../../lib/constants";

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
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user;
      if (!u) { router.replace("/"); return; }
      setUser(u);
      setFullName(u.user_metadata?.full_name ?? "");
      setEmail(u.email ?? "");
      setAvatarUrl(u.user_metadata?.avatar_url ?? null);
      setLoading(false);
    });
  }, [router]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !user) return;
    setAvatarUploading(true);
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
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: url },
    });
    if (updateError) {
      setProfileMsg({ text: updateError.message, ok: false });
    } else {
      setAvatarUrl(url);
      setProfileMsg({ text: "Photo updated.", ok: true });
    }
    setAvatarUploading(false);
  }

  async function handleSaveProfile() {
    if (!supabase) return;
    setSavingProfile(true);
    setProfileMsg(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
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
        Loading…
      </div>
    );
  }

  if (!supabase) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, fontFamily: C.font }}>
        <div style={cardStyle}>
          <div style={headingStyle}>Profile</div>
          <div style={{ color: C.muted, fontSize: 14 }}>Profile settings require Supabase to be configured.</div>
          <button onClick={() => router.back()} style={backBtnStyle}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.font, color: C.text, padding: "40px 16px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 0 }}>←</button>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Profile</div>
        </div>

        {/* Avatar + Name */}
        <div style={cardStyle}>
          <div style={sectionLabelStyle}>Photo &amp; Name</div>

          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.border}` }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff" }}>
                  {initial}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                title="Upload photo"
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 22, height: 22, borderRadius: "50%",
                  background: C.text, border: `2px solid ${C.panelBg}`,
                  color: "#fff", fontSize: 11, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {avatarUploading ? "…" : "+"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
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
  background: "#fcfcfa",
  border: "1px solid #f0eee8",
  borderRadius: 18,
  padding: "24px 28px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
  display: "flex",
  flexDirection: "column",
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#7a7a73",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#7a7a73",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  fontSize: 14,
  padding: "10px 13px",
  borderRadius: 10,
  border: "1px solid #e8e6e0",
  background: "#fafafa",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: "#111",
  outline: "none",
  marginBottom: 14,
  width: "100%",
  boxSizing: "border-box",
};

const saveBtnStyle: React.CSSProperties = {
  background: "#7f9462",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  alignSelf: "flex-start",
  marginTop: 2,
};

const backBtnStyle: React.CSSProperties = {
  background: "#7f9462",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "10px 24px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  marginTop: 20,
  alignSelf: "flex-start",
};

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 8,
};

function msgStyle(ok: boolean): React.CSSProperties {
  return {
    fontSize: 13,
    color: ok ? "#4a7c3f" : "#b04040",
    marginBottom: 10,
    marginTop: -6,
  };
}
