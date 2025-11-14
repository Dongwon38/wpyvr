"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileForm from "@/components/profile/ProfileForm";
import { fetchUserProfile, type UserProfile } from "@/lib/profileApi";

const heroGradient = `
  radial-gradient(circle at 18% 22%, rgba(0, 180, 216, 0.45), transparent 45%),
  radial-gradient(circle at 80% 0%, rgba(0, 116, 156, 0.85), rgba(3, 25, 38, 0.95)),
  linear-gradient(120deg, #03121C, #063549 55%, #0097C2)
`;

export default function ProfilePage() {
  const router = useRouter();
  const { user, wpUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;

      if (!user || !wpUser) {
        router.push("/");
        return;
      }

      try {
        setLoadingProfile(true);
        const data = await fetchUserProfile(wpUser.wp_user_id, wpUser.jwt);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user, wpUser, authLoading, router]);

  if (authLoading || loadingProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F3EF] text-[#444140]">
        <div className="text-center">
          <div className="relative mx-auto h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-[#00749C]/20" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#00B7D3] border-t-[#00749C] animate-spin"
              style={{ animationDuration: "0.8s" }}
            />
          </div>
          <p className="mt-4 text-sm font-medium text-[#5C5856]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF] px-4 text-center text-[#444140]">
        <div className="max-w-md rounded-3xl border border-[#00749C]/15 bg-white/95 p-8 shadow-xl shadow-[#012433]/5">
          <h1 className="text-2xl font-black text-[#C24646]">Error</h1>
          <p className="mt-3 text-sm text-[#5C5856]">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#00749C] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00749C]/30 transition hover:bg-[#0097C2]"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#444140]">
      <section className="relative isolate overflow-hidden border-b border-white/10 text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: heroGradient,
          }}
        />
        <div className="absolute -left-16 top-12 h-52 w-52 rounded-full bg-[#00B7D3]/35 blur-[120px]" />
        <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-[#00749C]/25 blur-[140px]" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>
          <div className="mt-8 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              <Sparkles className="h-4 w-4" />
              Profile console
            </span>
            <div>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                My Profile
              </h1>
              <p className="mt-4 text-lg text-white/85">
                Fine-tune how you show up to the community with the refreshed
                WordPress palette—glass surfaces, teal anchors, and privacy controls
                that stay within reach.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.4em] text-white/65">
              <span className="rounded-full border border-white/30 px-3 py-1">
                #00749C
              </span>
              <span className="rounded-full border border-white/30 px-3 py-1">
                #444140
              </span>
              <span className="rounded-full border border-white/30 px-3 py-1">
                #00B7D3
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-12 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-[32px] border border-[#00749C]/20 bg-white/95 p-6 shadow-2xl shadow-[#012433]/10 backdrop-blur md:p-10">
            <ProfileForm
              initialData={
                profile
                  ? {
                      nickname: profile.nickname || "",
                      bio: profile.bio || "",
                      position: profile.position || "",
                      specialties: profile.specialties || [],
                      company: profile.company || "",
                      website: profile.website || "",
                      avatar_url: profile.avatar_url || "",
                      profile_visibility: profile.profile_visibility || "private",
                      custom_email: profile.custom_email || "",
                      social_links: profile.social_links || [],
                      privacy_settings: {
                        show_email: profile.privacy_settings?.show_email ?? false,
                        show_position:
                          profile.privacy_settings?.show_position ?? false,
                        show_company:
                          profile.privacy_settings?.show_company ?? false,
                        show_website:
                          profile.privacy_settings?.show_website ?? false,
                        show_specialties:
                          profile.privacy_settings?.show_specialties ?? false,
                      },
                    }
                  : undefined
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-[#00749C]/20 bg-[#00749C]/10 p-6 text-[#032433] shadow-inner shadow-[#021820]/10">
              <div className="flex items-center gap-3 text-[#00749C]">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#00749C]/80">
                  Profile tips
                </span>
              </div>
              <p className="mt-3 text-lg font-semibold">
                Give your profile a premium polish
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[#032433]">
                <li>- Nickname is required and visible to every member.</li>
                <li>- Add specialties so teams can find your skills faster.</li>
                <li>- Upload a portrait to match the new glass UI surfaces.</li>
                <li>- Link your site or portfolio for instant credibility.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#444140]/15 bg-white/95 p-6 shadow-xl shadow-[#012433]/5">
              <div className="flex items-center gap-3 text-[#1F1C1A]">
                <ShieldCheck className="h-5 w-5 text-[#00749C]" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#5C5856]">
                    Privacy controls
                  </p>
                  <p className="text-lg font-black text-[#1F1C1A]">Stay in control</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#5C5856]">
                Toggle visibility for email, role, company, and specialty data. Set
                the full profile to private if you need a break from the spotlight.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#444140]">
                <li>- Only share what&apos;s relevant to the community.</li>
                <li>- Update visibility whenever you publish new work.</li>
                <li>- Private mode hides you from the members directory.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
