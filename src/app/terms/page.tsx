export const metadata = {
  title: "Terms of Service — typecircle",
};

const LAST_UPDATED = "July 19, 2026";

export default function TermsPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/40 block mb-3">
          Legal
        </span>
        <h1 className="font-heading font-bold text-4xl tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ink)]/45">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="prose-custom">
        <Notice>
          typecircle is a personal frontend study project built for educational
          and portfolio purposes only. It is not a commercial product, not
          affiliated with any organization, and is not intended for production
          use. By using this platform, you acknowledge and accept these
          limitations.
        </Notice>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using typecircle ("the Platform", "we", "us"), you
            agree to be bound by these Terms of Service. If you do not agree,
            please do not use the Platform.
          </p>
          <p>
            These terms may be updated at any time without prior notice.
            Continued use of the Platform after changes constitutes acceptance
            of the revised terms.
          </p>
        </Section>

        <Section title="2. Nature of the Platform">
          <p>
            typecircle is a non-commercial, educational project created to study
            and demonstrate full-stack web development using Next.js, Supabase,
            and related technologies. It is:
          </p>
          <ul>
            <li>Not a licensed psychological or clinical tool</li>
            <li>Not a substitute for professional mental health advice</li>
            <li>Not guaranteed to be available, accurate, or error-free</li>
            <li>
              Subject to change, suspension, or deletion at any time without
              notice
            </li>
          </ul>
          <p>
            The Enneagram assessment provided is for self-reflection purposes
            only. Results are not scientifically validated and should not be
            used for clinical, employment, or diagnostic decisions.
          </p>
        </Section>

        <Section title="3. User Accounts">
          <p>
            You may create an account using GitHub or Google OAuth. By doing so,
            you authorize us to receive basic profile information from those
            providers (name, email, avatar) as permitted by their respective
            terms.
          </p>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account</li>
            <li>All activity that occurs under your account</li>
            <li>Ensuring the information you provide is accurate</li>
          </ul>
          <p>
            We reserve the right to suspend or delete accounts at any time, for
            any reason, without notice.
          </p>
        </Section>

        <Section title="4. User Content">
          <p>
            You retain ownership of any content you post on the Platform (posts,
            messages, bio, username). By posting content, you grant us a
            non-exclusive, royalty-free license to store and display that
            content as part of the Platform's operation.
          </p>
          <p>You agree not to post content that is:</p>
          <ul>
            <li>Unlawful, harmful, threatening, or harassing</li>
            <li>Defamatory, obscene, or invasive of another's privacy</li>
            <li>Spam, phishing, or malicious in nature</li>
            <li>
              In violation of any third-party intellectual property rights
            </li>
          </ul>
          <p>
            We do not actively moderate content but reserve the right to remove
            any content at our discretion.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            The Platform's source code, design, and written content (excluding
            user-generated content) are the work of the project author. The
            Enneagram framework itself is not owned by typecircle and is used
            for educational reference only.
          </p>
        </Section>

        <Section title="6. Disclaimers and Limitation of Liability">
          <p>
            The Platform is provided "as is" and "as available" without
            warranties of any kind, express or implied. We make no guarantees
            regarding uptime, data integrity, or fitness for any particular
            purpose.
          </p>
          <p>
            To the fullest extent permitted by law, typecircle and its author
            shall not be liable for any indirect, incidental, special, or
            consequential damages arising from your use of the Platform,
            including but not limited to loss of data, loss of access, or
            reliance on assessment results.
          </p>
        </Section>

        <Section title="7. Termination">
          <p>
            We may terminate or suspend your access to the Platform at any time,
            with or without cause, with or without notice. Upon termination,
            your right to use the Platform ceases immediately. We may delete
            your data at any time after termination.
          </p>
        </Section>

        <Section title="8. Governing Law">
          <p>
            These terms are governed by the laws of the jurisdiction in which
            the project author resides, without regard to conflict of law
            principles. Any disputes shall be resolved in the courts of that
            jurisdiction.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            For questions about these terms, you may reach out via the project's
            GitHub repository. As this is a study project, responses are not
            guaranteed.
          </p>
        </Section>
      </div>
    </section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2 className="font-heading font-semibold text-lg tracking-tight mb-3 text-[var(--color-ink)]">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm text-[var(--color-ink)]/70 leading-relaxed [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-4 [&_ul]:list-disc [&_ul]:marker:text-[var(--color-accent)]">
        {children}
      </div>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[var(--color-ink)]/30 text-[var(--color-ink)] px-6 py-5 mb-10 text-sm leading-relaxed text-[var(--color-ink)]/70">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block mb-2">
        Important notice
      </span>
      {children}
    </div>
  );
}
