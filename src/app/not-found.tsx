"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Outfit, Inter } from "next/font/google";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-nfx-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-nfx-body",
  display: "swap",
});

function IconHome({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconZap({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const css = `
  .nfx {
    --nfx-bg: #060b14;
    --nfx-surface: #0b1322;
    --nfx-line: rgba(255, 255, 255, 0.09);
    --nfx-ink: #e6edf7;
    --nfx-muted: #8a98ad;
    --nfx-cyan: #00d2ff;
    --nfx-red: #f87171;

    position: relative;
    isolation: isolate;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    padding: clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 5vw, 3rem);
    background: var(--nfx-bg);
    color: var(--nfx-ink);
    font-family: var(--font-nfx-body), system-ui, -apple-system, "Segoe UI", sans-serif;
    overflow: hidden;
  }

  .nfx::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    background-size: 56px 56px;
    -webkit-mask-image: radial-gradient(ellipse 75% 65% at 70% 50%, #000 10%, transparent 75%);
    mask-image: radial-gradient(ellipse 75% 65% at 70% 50%, #000 10%, transparent 75%);
    pointer-events: none;
  }

  .nfx-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    width: fit-content;
    color: var(--nfx-ink);
    font-family: var(--font-nfx-display), sans-serif;
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    text-decoration: none;
    border-radius: 0.5rem;
  }

  .nfx-brand:focus-visible,
  .nfx-btn:focus-visible {
    outline: 2px solid var(--nfx-cyan);
    outline-offset: 3px;
  }

  .nfx-main {
    flex: 1;
    width: 100%;
    max-width: 70rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    align-items: center;
    gap: clamp(2rem, 7vw, 6rem);
    padding-block: clamp(2rem, 6vw, 4rem);
  }

  .nfx-title {
    margin: 0 0 1rem;
    font-family: var(--font-nfx-display), sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.25rem);
    font-weight: 600;
    line-height: 1.02;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  .nfx-desc {
    max-width: 42ch;
    margin: 0 0 2rem;
    color: var(--nfx-muted);
    font-size: 1.0625rem;
    line-height: 1.6;
  }

  .nfx-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .nfx-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8125rem 1.25rem;
    border: 1px solid transparent;
    border-radius: 0.625rem;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  }

  .nfx-btn-primary {
    background: var(--nfx-cyan);
    color: #04101a;
  }

  .nfx-btn-primary:hover {
    background: #4de0ff;
  }

  .nfx-btn-secondary {
    border-color: rgba(255, 255, 255, 0.16);
    background: transparent;
    color: var(--nfx-ink);
  }

  .nfx-btn-secondary:hover {
    border-color: rgba(0, 210, 255, 0.55);
    background: rgba(0, 210, 255, 0.06);
    color: #ffffff;
  }

  .nfx-panel {
    border: 1px solid var(--nfx-line);
    border-radius: 1rem;
    background: var(--nfx-surface);
    overflow: hidden;
  }

  .nfx-panel-head {
    padding: 1.75rem 1.75rem 1.5rem;
  }

  .nfx-code {
    margin: 0;
    color: var(--nfx-cyan);
    font-family: var(--font-nfx-display), sans-serif;
    font-size: clamp(4.5rem, 10vw, 7rem);
    font-weight: 600;
    line-height: 0.9;
    letter-spacing: -0.05em;
  }

  .nfx-code-label {
    margin: 0.75rem 0 0;
    color: var(--nfx-muted);
    font-size: 0.9375rem;
  }

  .nfx-rows {
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--nfx-line);
  }

  .nfx-row {
    display: grid;
    grid-template-columns: 5rem minmax(0, 1fr);
    gap: 1rem;
    padding: 0.9375rem 1.75rem;
    border-bottom: 1px solid var(--nfx-line);
    font-size: 0.875rem;
  }

  .nfx-row:last-child {
    border-bottom: 0;
  }

  .nfx-row dt {
    margin: 0;
    color: var(--nfx-muted);
  }

  .nfx-row dd {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    color: var(--nfx-ink);
    overflow-wrap: anywhere;
  }

  .nfx-path {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.8125rem;
  }

  .nfx-dot {
    flex: none;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--nfx-red);
  }

  @media (max-width: 52rem) {
    .nfx-main {
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
    }
  }

  @media (max-width: 30rem) {
    .nfx-actions {
      flex-direction: column;
    }
    .nfx-panel-head,
    .nfx-row {
      padding-inline: 1.25rem;
    }
    .nfx-row {
      grid-template-columns: 4rem minmax(0, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nfx-btn {
      transition: none;
    }
  }
`;

export default function NotFound() {
  const pathname = usePathname() || "/";

  return (
    <div className={`nfx ${display.variable} ${body.variable}`}>
      <style>{css}</style>

      <header>
        <Link href="/" className="nfx-brand" aria-label="Chameleon home">
          <Image src="/logo.png" alt="" width={32} height={32} priority />
          Chameleon
        </Link>
      </header>

      <main className="nfx-main">
        <section>
          <h1 className="nfx-title">Page not found</h1>
          <p className="nfx-desc">
            We couldn&rsquo;t find anything at this address. The page may have
            moved, or the link may be mistyped.
          </p>

          <div className="nfx-actions">
            <Link href="/" className="nfx-btn nfx-btn-primary">
              <IconHome size={16} />
              <span>Back to storefront</span>
            </Link>
            <Link href="/#pricing" className="nfx-btn nfx-btn-secondary">
              <IconZap size={15} />
              <span>VIP passes and pricing</span>
            </Link>
          </div>
        </section>

        <aside className="nfx-panel" aria-label="Request details">
          <div className="nfx-panel-head">
            <p className="nfx-code" aria-hidden="true">
              404
            </p>
            <p className="nfx-code-label">Error code 404</p>
          </div>

          <dl className="nfx-rows">
            <div className="nfx-row">
              <dt>Address</dt>
              <dd>
                <span className="nfx-path">{pathname}</span>
              </dd>
            </div>
            <div className="nfx-row">
              <dt>Status</dt>
              <dd>
                <span className="nfx-dot" aria-hidden="true" />
                Not found
              </dd>
            </div>
            <div className="nfx-row">
              <dt>Result</dt>
              <dd>No page exists at this address</dd>
            </div>
          </dl>
        </aside>
      </main>
    </div>
  );
}