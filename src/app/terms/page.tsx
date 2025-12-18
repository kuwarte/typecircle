export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="glass-navbar rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--typecircle-green)]/10 via-transparent to-blue-500/10 pointer-events-none" />
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-lg">Last updated: December 2024</p>
          </div>
          
          <div className="space-y-8">
            <section className="border-l-4 border-[var(--typecircle-green)]/30 pl-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using TypeCircle, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="border-l-4 border-[var(--typecircle-green)]/30 pl-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily use TypeCircle for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.
              </p>
            </section>

            <section className="border-l-4 border-[var(--typecircle-green)]/30 pl-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to use TypeCircle in a respectful manner and not to engage in any activity that disrupts or interferes with the service or other users' experience. Harassment, spam, or inappropriate content is strictly prohibited.
              </p>
            </section>

            <section className="border-l-4 border-[var(--typecircle-green)]/30 pl-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
              </p>
            </section>

            <section className="border-l-4 border-[var(--typecircle-green)]/30 pl-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                TypeCircle may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}