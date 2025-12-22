"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="glass-navbar rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--typecircle-green)]/10 via-transparent to-blue-500/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-semibold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground text-lg">
                Educational Project - Last updated: December 2024
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  title: "1. Information We Collect",
                  content: "We collect information through GitHub and Google OAuth authentication (name, email, profile picture), your Enneagram assessment results, chat messages in community rooms, and message reactions. All data is stored securely in our Supabase database."
                },
                {
                  title: "2. How We Use Your Information",
                  content: "Your information is used to provide the TypeCircle experience: displaying your profile in chat rooms, showing your Enneagram type badge, enabling real-time messaging, and personalizing your assessment results. We do not use your data for advertising or marketing purposes."
                },
                {
                  title: "3. Information Sharing",
                  content: "Your name, profile picture, and Enneagram type are visible to other community members in chat rooms. Your messages and reactions are visible to all room participants. We do not share your data with third parties except for essential services (Supabase for database, GitHub for authentication)."
                },
                {
                  title: "4. Data Security",
                  content: "We use Supabase's enterprise-grade security with Row Level Security (RLS) policies, ensuring you can only access data you're authorized to see. All connections use HTTPS encryption. However, no system is 100% secure."
                },
                {
                  title: "5. Your Rights",
                  content: "Updating profile information is still on going but you can retake the Enneagram assessment. To delete your account or data, please contact us as we don't currently have automated deletion features."
                },
                {
                  title: "6. Educational Purpose & Contact",
                  content: "TypeCircle is an educational project for learning purposes. This is not a commercial service. For questions about your data or this project, please reach out through the GitHub repository linked in the footer."
                }
              ].map((section, index) => (
                <section
                  key={index}
                  className="border-l-4 border-[var(--typecircle-green)]/30 pl-6"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
