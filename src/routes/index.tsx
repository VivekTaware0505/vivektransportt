import { createFileRoute } from "@tanstack/react-router";
import truck32 from "@/assets/truck-32ft.jpg";
import truck14 from "@/assets/truck-14ft.jpg";
import truckAce from "@/assets/truck-ace.jpg";
import partnerDriver from "@/assets/partner-driver.jpg";
import founderAsset from "@/assets/vivek-taware.jpg.asset.json";


export const Route = createFileRoute("/")({
  component: Index,
});

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`font-display tracking-wide flex items-baseline ${className}`}>
    VIVEK TRANSPOR
    <span className="bg-foreground text-background px-1 ml-0.5 relative after:content-[''] after:absolute after:w-1 after:h-1 after:bg-primary after:bottom-1 after:right-1">
      TT
    </span>
  </div>
);

function Index() {
  return (
    <div className="min-h-screen font-sans text-foreground bg-background selection:bg-primary/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo className="text-2xl" />
          <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest">
            <a href="#fleet" className="hover:text-primary transition-colors">Truck</a>
            <a href="#partner" className="hover:text-primary transition-colors">Partner</a>
            <a href="#how" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex gap-4">
            <button className="hidden sm:inline-block text-xs font-bold uppercase border-b-2 border-foreground pb-0.5">Login</button>
            <a href="#partner" className="bg-primary text-white px-5 py-2 text-xs font-bold uppercase tracking-tighter hover:bg-foreground transition-all">Register Truck</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-12 md:py-20 overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 animate-entry">
            <h1 className="text-6xl md:text-8xl font-display leading-[0.9] mb-6 text-balance">
              MOVING INDIA <br />
              <span className="text-primary">ONE LOAD</span> AT A TIME
            </h1>
            <p className="max-w-[45ch] text-lg text-foreground/70 mb-8">
              Book a verified truck for your parcel in minutes. Real-time GPS tracking, transparent pricing, and pan-India coverage across 450+ cities.
            </p>
            <div className="flex gap-6 border-t border-border pt-8">
              <div>
                <div className="font-mono text-2xl font-bold">99.4%</div>
                <div className="text-[10px] uppercase tracking-widest opacity-60">On-time Delivery</div>
              </div>
              <div className="border-l border-border pl-6">
                <div className="font-mono text-2xl font-bold">24/7</div>
                <div className="text-[10px] uppercase tracking-widest opacity-60">Live Support</div>
              </div>
              <div className="border-l border-border pl-6">
                <div className="font-mono text-2xl font-bold">4%</div>
                <div className="text-[10px] uppercase tracking-widest opacity-60">Owner Commission</div>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-5 bg-card border-2 border-foreground p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] animate-entry [animation-delay:150ms]">
            <h2 className="font-display text-3xl mb-6 tracking-tight italic">QUICK QUOTE</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks! Our team will call you with the best quote shortly."); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-50">Pickup City</label>
                  <input required type="text" placeholder="Mumbai, MH" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-50">Drop City</label>
                  <input required type="text" placeholder="Delhi, NCR" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-50">Parcel / Goods Type</label>
                <input required type="text" placeholder="Furniture, FMCG, Industrial..." className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-50">Truck Type</label>
                <select className="w-full border border-border p-3 text-sm focus:outline-none appearance-none bg-card">
                  <option>Tata Ace Mini (850 kg)</option>
                  <option>14ft Eicher (4 Ton)</option>
                  <option>20ft Container (7 Ton)</option>
                  <option>32ft Multi-Axle (15 Ton)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-50">Date of Loading</label>
                  <input required type="date" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-50">Mobile</label>
                  <input required type="tel" placeholder="+91 98xxx xxxxx" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <button type="submit" className="w-full bg-foreground text-white py-4 font-display text-xl tracking-widest hover:bg-primary transition-colors cursor-pointer">
                GET INSTANT PRICE
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">For Customers</span>
          <h2 className="text-5xl font-display mt-4 mb-12">HOW IT WORKS</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: "01", t: "Enter Details", d: "Tell us pickup, drop, parcel type, and truck size." },
              { n: "02", t: "Get Instant Quote", d: "Transparent commission-based pricing — no hidden charges." },
              { n: "03", t: "Verified Driver Assigned", d: "A background-checked fleet partner picks up your load." },
              { n: "04", t: "Live Track & Deliver", d: "GPS-track your parcel end-to-end until safe delivery." },
            ].map((s) => (
              <div key={s.n} className="border-t-2 border-foreground pt-4">
                <div className="font-mono text-xs text-primary mb-2">STEP {s.n}</div>
                <h3 className="font-display text-2xl mb-2">{s.t}</h3>
                <p className="text-sm text-foreground/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Showcase */}
      <section id="fleet" className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="font-display text-5xl">THE TRUCK</h3>
              <p className="text-background/50 font-mono text-xs uppercase">Available for immediate dispatch</p>
            </div>
            <a href="#contact" className="hidden md:block text-primary font-bold tracking-tighter">→ VIEW ALL VEHICLES</a>
          </div>

          <div className="grid md:grid-cols-3 gap-1">
            {[
              { img: truck32, title: "32FT MULTI-AXLE", cap: "15,000 KG", desc: "Heavy industrial loads and long-haul parcel distribution.", price: "₹42/km" },
              { img: truck14, title: "14FT OPEN BODY", cap: "4,000 KG", desc: "Intra-city shifts and wholesale market logistics.", price: "₹28/km" },
              { img: truckAce, title: "TATA ACE (MINI)", cap: "850 KG", desc: "Last-mile delivery and narrow street navigation.", price: "₹15/km" },
            ].map((v) => (
              <div key={v.title} className="group bg-white/5 p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="mb-6 h-40 overflow-hidden">
                  <img src={v.img} alt={v.title} width={800} height={608} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="font-display text-3xl mb-1">{v.title}</div>
                <div className="font-mono text-xs text-primary mb-4">CAPACITY: {v.cap}</div>
                <p className="text-sm text-background/60 leading-relaxed mb-6">{v.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-sm font-bold italic">Est. {v.price}</span>
                  <a href="#top" className="text-[10px] font-bold uppercase bg-white text-black px-4 py-2">Book</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section id="partner" className="py-24 bg-accent/10 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={partnerDriver} alt="Vivek Transportt fleet partner" width={1024} height={1024} loading="lazy" className="w-full aspect-square object-cover border border-border shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 max-w-xs">
              <p className="font-display text-2xl leading-tight">"I increased my monthly revenue by 40% since joining Vivek Transportt."</p>
              <div className="mt-4 font-mono text-xs">— RAJESH K., FLEET OWNER</div>
            </div>
          </div>
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Truck Owner Program</span>
            <h2 className="text-6xl font-display mt-4 mb-6 leading-none italic">EARN WITH <br />YOUR FLEET</h2>
            <p className="text-foreground/70 mb-8 max-w-md">Add your truck to Vivek Transportt and start receiving bookings within 48 hours. We run on a transparent commission model — you keep the rest.</p>
            <ul className="space-y-6 mb-10">
              {[
                { n: "01", t: "Guaranteed Backhauls", d: "Never drive an empty truck. We optimize your return journeys." },
                { n: "02", t: "Timely Payments", d: "Get paid within 48 hours of delivery completion. No hassles." },
                { n: "03", t: "Transparent Commission", d: "Fixed 12.5% commission on successful bookings. That's it." },
              ].map((b) => (
                <li key={b.n} className="flex gap-4">
                  <span className="bg-foreground text-background size-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0">{b.n}</span>
                  <div>
                    <h4 className="font-bold text-sm uppercase">{b.t}</h4>
                    <p className="text-sm text-foreground/60">{b.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <PartnerForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-background pt-20 pb-10 border-t-4 border-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-4">
              <Logo className="text-4xl mb-6" />
              <p className="text-sm text-foreground/60 max-w-sm mb-6">
                Standardizing India's fragmented logistics sector through technology, transparency, and top-tier service.
              </p>
              <div className="flex gap-4">
                {["in", "fb", "tw"].map((s) => (
                  <div key={s} className="size-10 border border-border grid place-items-center hover:bg-foreground hover:text-white transition-colors cursor-pointer italic font-serif">{s}</div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Service Coverage</h5>
              <ul className="text-sm text-foreground/60 space-y-3 font-mono">
                <li>Maharashtra</li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Contact</h5>
              <p className="text-sm text-foreground/60 mb-4">
                Star Recidency, Malinagar 301
              </p>
              <p className="text-sm font-bold">9322662939</p>
              <p className="text-sm text-primary font-mono">vivektransportt@gmail.com</p>
            </div>
            <div className="md:col-span-3">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Founder</h5>
              <div className="flex items-start gap-5">
                <img
                  src={founderAsset.url}
                  alt="Vivek Taware, Founder"
                  width={120}
                  height={120}
                  loading="lazy"
                  className="w-28 h-28 object-cover border-2 border-primary shrink-0"
                />
                <div className="pt-1">
                  <div className="font-display text-3xl tracking-wide leading-tight">VIVEK TAWARE</div>
                  <div className="text-primary font-bold uppercase tracking-widest text-xs mt-2">Founder</div>
                  <div className="text-sm text-foreground/60 mt-3 leading-relaxed">
                    Entrepreneur with a vision to modernize logistics across Maharashtra.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase font-mono tracking-widest opacity-40">© 2024 VIVEK TRANSPORTT LOGISTICS PVT LTD. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Carrier Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PartnerForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Application received! Our partner team will reach out within 24 hours.");
      }}
      className="bg-foreground text-white p-6 border-2 border-foreground"
    >
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input required placeholder="Owner Name" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-primary" />
        <input required type="tel" placeholder="Mobile Number" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-primary" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input required placeholder="City" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-primary" />
        <input required type="number" min={1} max={500} placeholder="No. of Trucks" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-primary" />
      </div>
      <button type="submit" className="w-full bg-primary text-white py-5 font-display text-2xl tracking-widest hover:bg-white hover:text-foreground transition-all flex items-center justify-center gap-4 group">
        REGISTER YOUR TRUCK <span className="group-hover:translate-x-2 transition-transform">→</span>
      </button>
    </form>
  );
}
