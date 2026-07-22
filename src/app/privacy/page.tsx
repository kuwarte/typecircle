export const metadata = {
  title: "Privacy Policy — typecircle",
};

const LAST_UPDATED = "July 19, 2026";

export default function PrivacyPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/40 block mb-3">
          Legal
        </span>
        <h1 className="font-heading font-bold text-4xl tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ink)]/45">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div>
        <Notice>
          typecircle is a personal study project. It is not a commercial
          service. While we take reasonable care with your data, this platform
          does not have the infrastructure, legal team, or compliance
          certifications of a production application. Use it with that
          understanding.
        </Notice>

        <Section title="1. Who We Are">
          <p>
            typecircle is an individual, non-commercial frontend study project.
            "We", "us", and "our" refer to the project author. There is no
            company, organization, or legal entity behind this platform.
          </p>
        </Section>

        <Section title="2. What Data We Collect">
          <p>We collect only what is necessary to operate the Platform:</p>

          <Subsection title="2.1 Data you provide directly">
            <ul>
              <li>
                <strong>Username</strong> — chosen during onboarding, publicly
                visible
              </li>
              <li>
                <strong>Full name</strong> — optional, used for display purposes
              </li>
              <li>
                <strong>Bio</strong> — optional, publicly visible on your
                profile
              </li>
              <li>
                <strong>Avatar image</strong> — optional, uploaded to Supabase
                Storage
              </li>
              <li>
                <strong>Posts and messages</strong> — content you create on the
                Platform
              </li>
            </ul>
          </Subsection>

          <Subsection title="2.2 Data collected via OAuth">
            <p>When you sign in with GitHub or Google, we receive:</p>
            <ul>
              <li>
                Your name and profile picture (used to pre-fill your profile)
              </li>
              <li>
                Your email address (stored by Supabase Auth, not displayed
                publicly)
              </li>
              <li>A unique identifier from the OAuth provider</li>
            </ul>
            <p>
              We do not receive your password, payment information, or private
              repository/account data.
            </p>
          </Subsection>

          <Subsection title="2.3 Data collected automatically">
            <ul>
              <li>
                <strong>Session tokens</strong> — stored in cookies to keep you
                signed in
              </li>
              <li>
                <strong>Timestamps</strong> — when your account was created and
                last updated
              </li>
            </ul>
            <p>
              We do not use analytics tools, tracking pixels, or third-party
              advertising scripts.
            </p>
          </Subsection>

          <Subsection title="2.4 Quiz results">
            <p>
              Your Enneagram assessment results (primary type, wing, instinct
              stack) are stored in your profile row in the database. These are
              visible to other users on your public profile.
            </p>
          </Subsection>
        </Section>

        <Section title="3. How We Store Your Data">
          <p>
            All data is stored using <strong>Supabase</strong>, a hosted
            backend-as-a-service platform. This includes:
          </p>
          <ul>
            <li>
              <strong>PostgreSQL database</strong> — profile data, posts,
              messages, group memberships, notifications
            </li>
            <li>
              <strong>Supabase Auth</strong> — authentication tokens and OAuth
              identity records
            </li>
            <li>
              <strong>Supabase Storage</strong> — avatar images uploaded by
              users
            </li>
          </ul>
          <p>
            Supabase stores data on infrastructure provided by AWS. You can
            review Supabase's own privacy policy at{" "}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-accent)] transition-colors"
            >
              supabase.com/privacy
            </a>
            .
          </p>
          <p>
            Row Level Security (RLS) is enabled on all tables. This means
            database access is restricted by policy — users can only read or
            modify data they are authorized to access.
          </p>
        </Section>

        <Section title="4. How We Use Your Data">
          <p>We use your data solely to operate the Platform:</p>
          <ul>
            <li>To authenticate you and maintain your session</li>
            <li>To display your profile, posts, and activity to other users</li>
            <li>To match you with circles and enable messaging</li>
            <li>To show your quiz results on your profile</li>
          </ul>
          <p>
            We do not sell, rent, or share your data with third parties for
            marketing or advertising purposes. We do not use your data to train
            machine learning models.
          </p>
        </Section>

        <Section title="5. Data Visibility">
          <p>
            The following data is publicly visible to all users of the Platform:
          </p>
          <ul>
            <li>Username, full name, bio, avatar</li>
            <li>Primary type, wing, instinct stack</li>
            <li>Posts you create and reactions you make</li>
            <li>Groups you are a member of</li>
          </ul>
          <p>The following data is private:</p>
          <ul>
            <li>Your email address</li>
            <li>Direct messages (visible only to conversation participants)</li>
            <li>Notifications</li>
          </ul>
        </Section>

        <Section title="6. Data Retention">
          <p>
            Your data is retained for as long as your account exists. If you
            delete your account, your profile and associated data (posts,
            memberships, messages) will be deleted via cascading database
            constraints.
          </p>
          <p>
            Because this is a study project, we also reserve the right to delete
            all data at any time — for example, if the project is shut down or
            the database is reset during development.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to:</p>
          <ul>
            <li>
              <strong>Access</strong> — view the data stored about you via your
              profile page
            </li>
            <li>
              <strong>Correction</strong> — update your profile information at
              any time
            </li>
            <li>
              <strong>Deletion</strong> — delete your account via the Settings
              page, which removes your data
            </li>
            <li>
              <strong>Portability</strong> — request a copy of your data by
              contacting us via GitHub
            </li>
          </ul>
          <p>
            As this is a non-commercial study project, we cannot guarantee
            formal compliance with GDPR, CCPA, or other data protection
            regulations. If you have concerns, we recommend not using the
            Platform with sensitive personal information.
          </p>
        </Section>

        <Section title="8. Cookies">
          <p>
            We use cookies solely for authentication — specifically, Supabase
            session cookies that keep you signed in. We do not use cookies for
            tracking, advertising, or analytics.
          </p>
          <p>
            You can clear cookies at any time via your browser settings, which
            will sign you out of the Platform.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            typecircle is not directed at children under the age of 13. We do
            not knowingly collect personal information from children. If you
            believe a child has provided us with personal information, please
            contact us and we will delete it.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy at any time. Changes will be
            reflected by the "Last updated" date at the top of this page.
            Continued use of the Platform after changes constitutes acceptance
            of the revised policy.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            For privacy-related questions or data requests, please reach out via
            the project's GitHub repository. As this is a study project,
            responses are not guaranteed but we will make reasonable efforts to
            address concerns.
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
      <div className="flex flex-col gap-3 text-sm text-[var(--color-ink)]/70 leading-relaxed [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-4 [&_ul]:list-disc [&_ul]:marker:text-[var(--color-accent)] [&_strong]:text-[var(--color-ink)]/90 [&_strong]:font-medium">
        {children}
      </div>
    </div>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-[var(--color-ink)]/80 mb-2">
        {title}
      </h3>
      <div className="flex flex-col gap-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-4 [&_ul]:list-disc [&_ul]:marker:text-[var(--color-accent)] [&_strong]:text-[var(--color-ink)]/90 [&_strong]:font-medium">
        {children}
      </div>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[var(--color-ink)]/30 text-[var(--color-ink)] px-6 py-5 mb-10 text-sm leading-relaxed">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block mb-2">
        Important notice
      </span>
      {children}
    </div>
  );
}
