import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div style={styles.container}>
      {/* Background Cyber Mesh */}
      <div style={styles.gridBg} />
      <div style={styles.orbCyan} />
      <div style={styles.orbEmerald} />

      <div style={styles.card}>
        {/* Holographic Logo Emblem */}
        <div style={styles.emblemWrapper}>
          <div style={styles.emblemRing} />
          <div style={styles.emblem}>
            <Image
              src="/logo.png"
              alt="Chameleon Logo"
              width={48}
              height={48}
              priority
            />
          </div>
        </div>

        <div style={styles.badge}>ENCLAVE ERROR &bull; CODE 404</div>

        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>GATEWAY NOT FOUND</h2>
        <p style={styles.desc}>
          The route, resource, or enclave you are attempting to access does not
          exist, has been restricted, or was permanently relocated.
        </p>

        <div style={styles.actionRow}>
          <Link href="/" style={styles.button}>
            <span>&larr;</span> Return to Storefront
          </Link>
        </div>

        <div style={styles.footTag}>
          <span>SECURITY PROTOCOL ENFORCED &bull; CHAM-OS</span>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#020612",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  gridBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "40px 40px",
    backgroundImage:
      "linear-gradient(to right, rgba(0, 210, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 210, 255, 0.05) 1px, transparent 1px)",
    pointerEvents: "none",
    zIndex: 1,
  },
  orbCyan: {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0, 210, 255, 0.12) 0%, transparent 70%)",
    filter: "blur(90px)",
    pointerEvents: "none",
    zIndex: 2,
  },
  orbEmerald: {
    position: "absolute",
    bottom: "0%",
    right: "15%",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, transparent 70%)",
    filter: "blur(90px)",
    pointerEvents: "none",
    zIndex: 2,
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "460px",
    background: "rgba(6, 12, 26, 0.88)",
    border: "1px solid rgba(0, 210, 255, 0.25)",
    borderRadius: "24px",
    padding: "44px 36px",
    textAlign: "center",
    backdropFilter: "blur(28px)",
    boxShadow:
      "0 25px 80px rgba(0, 0, 0, 0.85), 0 0 50px rgba(0, 210, 255, 0.08)",
  },
  emblemWrapper: {
    position: "relative",
    width: "72px",
    height: "72px",
    margin: "0 auto 16px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emblemRing: {
    position: "absolute",
    inset: "-6px",
    borderRadius: "24px",
    border: "1px dashed rgba(0, 210, 255, 0.35)",
  },
  emblem: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, rgba(0, 210, 255, 0.22) 0%, rgba(16, 185, 129, 0.18) 100%)",
    border: "1px solid rgba(0, 210, 255, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 28px rgba(0, 210, 255, 0.35)",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "999px",
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    fontSize: "10.5px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  title: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: "48px",
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#ffffff",
    margin: "0 0 2px 0",
    textShadow: "0 0 30px rgba(0, 210, 255, 0.4)",
  },
  subtitle: {
    fontSize: "14px",
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "#00d2ff",
    textTransform: "uppercase",
    margin: "0 0 16px 0",
  },
  desc: {
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.55",
    margin: "0 0 28px 0",
  },
  actionRow: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "13px 28px",
    background: "linear-gradient(135deg, #00d2ff 0%, #0099cc 100%)",
    color: "#020612",
    borderRadius: "12px",
    fontSize: "13.5px",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textDecoration: "none",
    boxShadow: "0 4px 20px rgba(0, 210, 255, 0.35)",
    transition: "all 0.2s ease",
  },
  footTag: {
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    fontSize: "10.5px",
    fontFamily: "monospace",
    color: "#475569",
    letterSpacing: "0.12em",
  },
};
