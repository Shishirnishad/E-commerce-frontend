import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-inner">
          <div className="nav-brand">
            <span className="brand-icon">◆</span>
            <span className="brand-text">NOVA</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#stats">Stats</a>
            <a href="#cta">Get Started</a>
          </div>
          <div className="nav-actions">
            <button className="btn-ghost" onClick={() => navigate("/customer/login")}>
              Sign In
            </button>
            <button className="btn-primary nav-cta" onClick={() => navigate("/customer/register")}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="hero">
        <div className="hero-glow glow-1" />
        <div className="hero-glow glow-2" />
        <div className="hero-glow glow-3" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Now in Early Access
          </div>

          <h1 className="hero-title">
            Build the{" "}
            <span className="gradient-text">Future</span>
            <br />
            of Commerce
          </h1>

          <p className="hero-subtitle">
            The all-in-one platform for modern merchants. Ship faster,
            scale smarter, and deliver experiences your customers will love.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary btn-large"
              onClick={() => navigate("/customer/register")}
            >
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <button
              className="btn-outline btn-large"
              onClick={() => navigate("/vendor/login")}
            >
              Watch Demo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Merchants</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">$2B+</span>
              <span className="stat-label">Processed</span>
            </div>
          </div>
        </div>

        <div className="hero-cards">
          <div className="float-card card-1">
            <div className="card-glow" />
            <div className="card-header">
              <div className="card-avatar" />
              <div className="card-user">
                <span className="card-name">Sarah Chen</span>
                <span className="card-role">Store Owner</span>
              </div>
            </div>
            <div className="card-body">
              <div className="card-chart">
                <div className="bar bar-1" />
                <div className="bar bar-2" />
                <div className="bar bar-3" />
                <div className="bar bar-4" />
                <div className="bar bar-5" />
              </div>
            </div>
            <div className="card-footer">
              <span className="card-metric">+284%</span>
              <span className="card-metric-label">Revenue Growth</span>
            </div>
          </div>

          <div className="float-card card-2">
            <div className="card-glow" />
            <div className="card-header">
              <div className="card-icon">🛒</div>
              <span className="card-title">Orders Today</span>
            </div>
            <div className="card-body">
              <span className="card-big-number">1,847</span>
              <span className="card-trend">↑ 23.5%</span>
            </div>
            <div className="card-progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "78%" }} />
              </div>
              <span className="progress-label">78% of daily goal</span>
            </div>
          </div>

          <div className="float-card card-3">
            <div className="card-glow" />
            <div className="card-header">
              <div className="card-icon">⭐</div>
              <span className="card-title">Customer Rating</span>
            </div>
            <div className="card-body">
              <span className="card-big-number">4.9</span>
              <div className="card-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= 4 ? "#FFB800" : "#FFB800"} stroke="#FFB800" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
            </div>
            <div className="card-footer">
              <span className="card-metric-label">Based on 12.4K reviews</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section features">
        <div className="section-glow" />
        <div className="section-header reveal">
          <span className="section-tag">Features</span>
          <h2 className="section-title">
            Everything you need to{" "}
            <span className="gradient-text">scale</span>
          </h2>
          <p className="section-desc">
            Powerful tools designed to help you launch, manage, and grow
            your online store with confidence.
          </p>
        </div>

        <div className="features-grid">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Edge-optimized infrastructure delivers sub-100ms response times globally.",
            },
            {
              icon: "🛡️",
              title: "Enterprise Security",
              desc: "SOC 2 compliant with end-to-end encryption and real-time threat detection.",
            },
            {
              icon: "📊",
              title: "Smart Analytics",
              desc: "Real-time dashboards with AI-powered insights to drive decision making.",
            },
            {
              icon: "🔗",
              title: "API First",
              desc: "RESTful and GraphQL APIs with webhooks for seamless integrations.",
            },
            {
              icon: "🎨",
              title: "Customizable",
              desc: "Full design freedom with drag-and-drop builder and custom themes.",
            },
            {
              icon: "🌍",
              title: "Global Scale",
              desc: "Multi-currency, multi-language support with 30+ payment gateways.",
            },
          ].map((f, i) => (
            <div key={i} className="feature-card reveal glass-card">
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stats" className="section stats">
        <div className="section-glow" />
        <div className="stats-grid reveal">
          {[
            { value: "10K+", label: "Active Merchants" },
            { value: "$2B+", label: "Revenue Processed" },
            { value: "99.9%", label: "Platform Uptime" },
            { value: "4.9★", label: "Customer Rating" },
          ].map((s, i) => (
            <div key={i} className="stat-card glass-card">
              <span className="stat-number gradient-text">{s.value}</span>
              <span className="stat-desc">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="cta" className="section cta">
        <div className="cta-glow" />
        <div className="cta-content reveal">
          <h2 className="cta-title">
            Ready to build something{" "}
            <span className="gradient-text">extraordinary</span>?
          </h2>
          <p className="cta-desc">
            Join thousands of forward-thinking merchants already using Nova.
            Start free — no credit card required.
          </p>
          <div className="cta-actions">
            <button
              className="btn-primary btn-large"
              onClick={() => navigate("/customer/register")}
            >
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <button
              className="btn-outline btn-large"
              onClick={() => navigate("/vendor/login")}
            >
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-icon">◆</span>
            <span className="brand-text">NOVA</span>
            <p className="footer-tagline">
              The modern commerce platform for ambitious brands.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <span className="footer-heading">Product</span>
              <a href="#features">Features</a>
              <a href="#cta">Pricing</a>
              <a href="#cta">Integrations</a>
              <a href="#cta">Changelog</a>
            </div>
            <div className="footer-col">
              <span className="footer-heading">Company</span>
              <a href="#cta">About</a>
              <a href="#cta">Blog</a>
              <a href="#cta">Careers</a>
              <a href="#cta">Contact</a>
            </div>
            <div className="footer-col">
              <span className="footer-heading">Legal</span>
              <a href="#cta">Privacy</a>
              <a href="#cta">Terms</a>
              <a href="#cta">Security</a>
              <a href="#cta">Cookies</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Nova. All rights reserved.</span>
          <div className="footer-social">
            <span>Twitter</span>
            <span>GitHub</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
