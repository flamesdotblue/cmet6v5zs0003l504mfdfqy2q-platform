import React, { useMemo, useState } from 'react';

function CopyButton({ text, small }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };
  return (
    <button
      onClick={onCopy}
      className={`inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition px-2.5 ${small ? 'py-1 text-xs' : 'py-2 text-sm'}`}
      aria-label="Copy to clipboard"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90"><path d="M9 9.75A2.25 2.25 0 0 1 11.25 7.5h6A2.25 2.25 0 0 1 19.5 9.75v6a2.25 2.25 0 0 1-2.25 2.25h-6A2.25 2.25 0 0 1 9 15.75v-6Z" stroke="currentColor" strokeWidth="1.5"/><path d="M6 14.25A2.25 2.25 0 0 1 3.75 12v-6A2.25 2.25 0 0 1 6 3.75h6A2.25 2.25 0 0 1 14.25 6" stroke="currentColor" strokeWidth="1.5"/></svg>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeTabs() {
  const tabs = [
    {
      key: 'node',
      label: 'Node.js',
      install: 'npm i @vanishauth/biometrics',
      code: `import express from 'express';\nimport { withBiometrics } from '@vanishauth/biometrics';\n\nconst app = express();\n\n// Auth that disappears — one line to protect every route\napp.use(withBiometrics());\n\napp.get('/profile', (req, res) => {\n  res.json({ user: req.user });\n});\n\napp.listen(3000);`,
    },
    {
      key: 'react',
      label: 'React',
      install: 'npm i @vanishauth/react',
      code: `import { BiometricsProvider, useBiometrics } from '@vanishauth/react';\n\nexport default function App() {\n  return (\n    <BiometricsProvider projectId={import.meta.env.VITE_PROJECT_ID}>\n      <Profile />\n    </BiometricsProvider>\n  );\n}\n\nfunction Profile() {\n  const { login, user, ready } = useBiometrics();\n  if (!ready) return 'Loading…';\n  return user ? (\n    <div>Hello {user.name}</div>\n  ) : (\n    <button onClick={login}>Sign in with Face/Touch ID</button>\n  );\n}`,
    },
    {
      key: 'next',
      label: 'Next.js (Route Handler)',
      install: 'npm i @vanishauth/edge',
      code: `import { withBiometrics } from '@vanishauth/edge';\n\nexport const GET = withBiometrics(async (req) => {\n  const user = req.auth.user;\n  return new Response(JSON.stringify({ user }), { status: 200 });\n});`,
    },
    {
      key: 'curl',
      label: 'cURL test',
      install: '# no install needed',
      code: `# Exchange a WebAuthn assertion for a session token\ncurl -X POST https://api.vanishauth.com/v1/session \\n  -H 'Content-Type: application/json' \\n  -d '{"assertion":"<webauthn-assertion>","projectId":"prj_123"}'`,
    },
  ];
  const [active, setActive] = useState(tabs[0].key);
  const current = useMemo(() => tabs.find(t => t.key === active), [active]);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 sm:p-6 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm transition border ${active === t.key ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60 select-all hidden sm:inline">{current.install}</span>
          <CopyButton text={current.install} small />
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-black/60">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 text-xs text-white/60">
          <span>Snippet</span>
          <CopyButton text={current.code} small />
        </div>
        <pre className="overflow-auto p-4 text-sm leading-relaxed text-white/90">
          <code>{current.code}</code>
        </pre>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-start">
      <div className="text-2xl sm:text-3xl font-semibold text-white">{value}</div>
      <div className="text-xs sm:text-sm text-white/60">{label}</div>
    </div>
  );
}

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 3l7 3v5c0 5.25-3.438 8.625-7 10-3.562-1.375-7-4.75-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FingerprintIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 3a7 7 0 0 0-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 21c3 0 6-3 6-7a6 6 0 0 0-6-6 6 6 0 0 0-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 9a4 4 0 0 1 4 4c0 2.5-1 5-3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 9a4 4 0 0 0-4 4c0 1.7.6 3.4 1.8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function LightningIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M13 2L3 14h7l-1 8 11-14h-7l1-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M20 7L9 18l-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(true);

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(34,211,238,0.15),transparent),radial-gradient(800px_400px_at_10%_10%,rgba(99,102,241,0.12),transparent)] bg-neutral-950 text-white selection:bg-cyan-400/30">
      {/* Nav */}
      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
              <FingerprintIcon className="h-5 w-5 text-black/90" />
            </div>
            <span className="font-semibold tracking-tight">VanishAuth</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-white/70">
            <a href="#security" className="hover:text-white">Security</a>
            <a href="#docs" className="hover:text-white">Docs</a>
            <a href="#faqs" className="hover:text-white">FAQ</a>
            <a href="#waitlist" className="rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/20 border border-white/10">Join waitlist</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
          <div className="absolute left-1/2 top-10 -translate-x-1/2 h-[480px] w-[900px] [filter:blur(60px)] bg-gradient-to-r from-cyan-400/20 via-indigo-400/20 to-fuchsia-400/20 rounded-full" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                WebAuthn-native • Passkeys • Edge ready
              </div>
              <h1 className="mt-4 text-4xl sm:text-6xl font-semibold leading-tight">
                Auth that disappears.
              </h1>
              <p className="mt-4 text-white/70 text-lg max-w-xl">
                Passwordless, biometric logins for developers. Drop in a single line and let users sign in with Face ID, Touch ID, or their device passkey.
              </p>
              <form onSubmit={submit} id="waitlist" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 rounded-md bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
                <button
                  type="submit"
                  disabled={loading || submitted}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 font-medium text-black hover:opacity-95 disabled:opacity-60"
                >
                  {submitted ? (
                    <>
                      <CheckIcon className="h-5 w-5" /> Joined
                    </>
                  ) : loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/50 border-t-transparent"></span>
                      Subscribing…
                    </>
                  ) : (
                    'Get early access'
                  )}
                </button>
              </form>
              <div className="mt-3 flex items-start gap-3 text-xs text-white/50">
                <input id="consent" type="checkbox" checked={consent} onChange={() => setConsent(!consent)} className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5" />
                <label htmlFor="consent">I agree to receive occasional product updates. We’ll never sell your data.</label>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 sm:max-w-md">
                <Stat value="< 1 ms" label="SDK overhead" />
                <Stat value=">99.99%" label="Uptime target" />
                <Stat value="SOC 2" label="In progress" />
              </div>
            </div>
            <div className="lg:pl-6">
              <CodeTabs />
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="security" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <div className="flex items-center gap-3">
                <ShieldIcon className="h-6 w-6 text-cyan-300" />
                <h3 className="font-semibold">Security by default</h3>
              </div>
              <p className="mt-2 text-sm text-white/70">FIDO2/WebAuthn-based passkeys. Phishing-resistant. No passwords to leak, no SMS to intercept.</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> End-to-end challenge signing</li>
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> Hardware-backed keys when available</li>
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> Encrypted at rest and in transit</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <div className="flex items-center gap-3">
                <LightningIcon className="h-6 w-6 text-indigo-300" />
                <h3 className="font-semibold">One line, infinite scale</h3>
              </div>
              <p className="mt-2 text-sm text-white/70">Drop-in middleware for servers and edge runtimes. Add auth without detours or boilerplate.</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> Works with Express, Next.js, SvelteKit</li>
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> Zero state machines or OAuth dances</li>
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> Edge-first global PoP</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <div className="flex items-center gap-3">
                <LockIcon className="h-6 w-6 text-fuchsia-300" />
                <h3 className="font-semibold">Trust that compounds</h3>
              </div>
              <p className="mt-2 text-sm text-white/70">Built for compliance from day one: audit trails, SSO for teams, and regional data residency.</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> SOC 2 Type II (in progress)</li>
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> GDPR and CCPA aligned</li>
                <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-emerald-400"/> No PII monetization</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 rounded-2xl border border-white/10 p-6 sm:p-8 bg-gradient-to-br from-white/5 to-transparent">
            <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-center">
              <div>
                <blockquote className="text-lg text-white/80">“We replaced our patchwork of magic links and social OAuth with a single line. Sign-in success jumped 18% overnight.”</blockquote>
                <div className="mt-4 text-sm text-white/60">— Staff Engineer, Series B fintech</div>
              </div>
              <div className="flex items-center justify-center gap-6 opacity-80">
                <div className="text-white/60 text-xs">Backed by</div>
                <div className="h-7 w-24 rounded bg-white/10" />
                <div className="h-7 w-24 rounded bg-white/10" />
                <div className="h-7 w-24 rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Docs CTA */}
      <section id="docs" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold">From zero to biometric in seconds</h2>
              <p className="text-white/70 max-w-xl">Initialize the SDK, wrap a route or provider, and you’re live. No password resets. No bot farms. No vendor lock-in—export your public keys anytime.</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">TypeScript first</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">Edge compatible</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">Open standards</span>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-white/70">One-liner example</div>
              <pre className="mt-3 rounded-lg border border-white/10 bg-black/60 p-4 text-sm text-white/90 overflow-auto"><code>{`// Protect everything in one go\napp.use(withBiometrics());`}</code></pre>
              <div className="mt-3"><CopyButton text={`app.use(withBiometrics());`} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 overflow-hidden">
            {[
              { q: 'How is this different from magic links or OTPs?', a: 'Passkeys use public-key cryptography and on-device biometrics. There are no one-time codes to phish or links to intercept, and users authenticate in under two seconds.' },
              { q: 'Which platforms are supported?', a: 'All modern platforms with WebAuthn/Passkeys: iOS, Android, macOS, Windows, ChromeOS. Works in major browsers and native webviews.' },
              { q: 'Can we migrate off later?', a: 'Yes. We build on open standards. You can export registered public keys and user metadata to self-host or another provider.' },
              { q: 'What about compliance?', a: 'We align with SOC 2, GDPR, and CCPA requirements. Data is encrypted at rest and in transit, with regional data residency options.' },
            ].map((item, idx) => (
              <Disclosure key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-gradient-to-br from-cyan-400 to-indigo-500" />
            <div className="text-white/70 text-sm">© {new Date().getFullYear()} VanishAuth</div>
          </div>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <a href="#security" className="hover:text-white">Security</a>
            <a href="#docs" className="hover:text-white">Docs</a>
            <a href="#faqs" className="hover:text-white">FAQ</a>
            <a href="#waitlist" className="hover:text-white">Join waitlist</a>
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <SocialIcon name="x" />
            <SocialIcon name="gh" />
            <SocialIcon name="li" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function Disclosure({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/[0.03]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-4 sm:px-6 text-left">
        <span className="font-medium">{q}</span>
        <svg className={`h-5 w-5 transition ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5"/></svg>
      </button>
      {open && (
        <div className="px-4 sm:px-6 pb-4 -mt-2 text-white/70 text-sm">{a}</div>
      )}
    </div>
  );
}

function SocialIcon({ name }) {
  const icons = {
    x: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M18.146 3H21l-6.5 7.43L22 21h-5.938l-4.64-5.588L5.9 21H3l7.02-8.02L2 3h6.062l4.18 5.226L18.146 3Zm-2.08 16h1.155L8.013 5H6.79l9.276 14Z"/></svg>
    ),
    gh: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 .5A11.5 11.5 0 0 0 .5 12.4c0 5.25 3.4 9.7 8.1 11.27.6.1.82-.27.82-.58v-2.1c-3.3.74-4-1.44-4-1.44-.55-1.43-1.34-1.81-1.34-1.81-1.1-.78.08-.76.08-.76 1.22.09 1.87 1.28 1.87 1.28 1.08 1.9 2.84 1.35 3.53 1.04.1-.8.43-1.35.78-1.66-2.64-.3-5.42-1.36-5.42-6.04 0-1.34.46-2.44 1.23-3.3-.12-.3-.54-1.52.12-3.17 0 0 1-.33 3.3 1.25a11.3 11.3 0 0 1 6 0C17 4.8 18 5.14 18 5.14c.66 1.65.24 2.87.12 3.17.77.86 1.23 1.96 1.23 3.3 0 4.7-2.79 5.73-5.45 6.03.44.38.84 1.12.84 2.27v3.36c0 .32.22.68.83.57A11.5 11.5 0 0 0 23.5 12.4C23.5 5.93 18.07.5 12 .5Z" clipRule="evenodd"/></svg>
    ),
    li: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.98h5V24H0V8.98zM8.98 8.98H14v2.05h.08c.71-1.34 2.45-2.76 5.05-2.76 5.4 0 6.4 3.56 6.4 8.18V24h-5v-6.8c0-1.62-.03-3.7-2.25-3.7-2.25 0-2.6 1.76-2.6 3.58V24h-5V8.98z"/></svg>
    ),
  };
  return (
    <a href="#" className="hover:text-white" aria-label={name}>
      {icons[name]}
    </a>
  );
}
