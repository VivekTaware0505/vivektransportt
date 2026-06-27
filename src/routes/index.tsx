import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import truck32 from "@/assets/truck-32ft.jpg";
import truck14 from "@/assets/truck-14ft.jpg";
import truckAce from "@/assets/truck-ace.jpg";
import partnerDriver from "@/assets/partner-driver.jpg";
import founderAsset from "@/assets/vivek-taware.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const Logo = ({ className = "", invert = false }: { className?: string; invert?: boolean }) => (
  <div className={`font-display tracking-wide flex items-baseline ${className}`}>
    <span className={invert ? "text-white" : ""}>VIVEK TRANSPOR</span>
    <span className={`${invert ? "bg-white text-foreground" : "bg-foreground text-background"} px-1 ml-0.5 relative after:content-[''] after:absolute after:w-1 after:h-1 after:bg-primary after:bottom-1 after:right-1`}>
      TT
    </span>
  </div>
);

// ---------- Quick Quote (live fare estimator) ----------
const MH_CITIES = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Kolhapur", "Solapur", "Navi Mumbai", "Amravati", "Sangli", "Jalgaon", "Akola", "Latur", "Ahmednagar"];

// Approximate road distances (km) from Mumbai hub; used to estimate intercity routes
const CITY_KM: Record<string, number> = {
  Mumbai: 0, "Navi Mumbai": 25, Thane: 35, Pune: 150, Nashik: 165, Aurangabad: 335,
  Kolhapur: 380, Solapur: 410, Ahmednagar: 250, Sangli: 400, Jalgaon: 420,
  Akola: 580, Amravati: 670, Latur: 490, Nagpur: 840,
};

const TRUCKS = [
  { id: "ace",   label: "Tata Ace Mini · 850 kg",   rate: 18, base: 350,  capacity: 850 },
  { id: "14ft",  label: "14ft Eicher · 4 Ton",       rate: 28, base: 600,  capacity: 4000 },
  { id: "20ft",  label: "20ft Container · 7 Ton",    rate: 35, base: 900,  capacity: 7000 },
  { id: "32ft",  label: "32ft Multi-Axle · 15 Ton",  rate: 42, base: 1500, capacity: 15000 },
];

const PAYLOAD_RATE = 5; // ₹ per kg — current market rate


function estimateKm(from: string, to: string) {
  if (!from || !to || from === to) return 0;
  const a = CITY_KM[from] ?? 0;
  const b = CITY_KM[to] ?? 0;
  // crude triangulation via Mumbai hub
  return Math.max(40, Math.round(Math.abs(a - b) || (a + b) * 0.6));
}

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function QuickQuote() {
  const today = new Date().toISOString().slice(0, 10);
  const [pickup, setPickup] = useState("Mumbai");
  const [drop, setDrop] = useState("Pune");
  const [goods, setGoods] = useState("");
  const [truck, setTruck] = useState(TRUCKS[1].id);
  const [date, setDate] = useState(today);
  const [mobile, setMobile] = useState("");
  const [weight, setWeight] = useState<string>("");
  const [submitted, setSubmitted] = useState<null | { id: string; total: number; km: number; truckLabel: string; weight: number }>(null);

  const km = useMemo(() => estimateKm(pickup, drop), [pickup, drop]);
  const t = TRUCKS.find((x) => x.id === truck)!;
  const weightKg = Math.max(0, Number(weight) || 0);
  const overCapacity = weightKg > t.capacity;
  const fare = km * t.rate;
  const payloadCharge = weightKg * PAYLOAD_RATE;
  const subtotal = km > 0 ? fare + t.base + payloadCharge : 0;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  const mobileValid = /^[6-9]\d{9}$/.test(mobile);
  const canSubmit = !!(pickup && drop && pickup !== drop && goods.trim().length > 1 && mobileValid && km > 0 && weightKg > 0 && !overCapacity);


  if (submitted) {
    const waMsg = encodeURIComponent(
      `Hi Vivek Transportt, I want to book a truck.\nQuote: ${submitted.id}\n${pickup} → ${drop} (${submitted.km} km)\nTruck: ${submitted.truckLabel}\nPayload: ${submitted.weight} kg\nGoods: ${goods}\nDate: ${date}\nMobile: +91${mobile}\nEstimated: ${inr(submitted.total)}`
    );
    return (
      <div id="quote" className="lg:col-span-5 bg-card border-2 border-foreground p-5 sm:p-6 shadow-[8px_8px_0px_0px_hsl(220_40%_11%/0.12)] animate-entry scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight italic">QUOTE CONFIRMED</h2>
          </div>
          <span className="text-[10px] font-mono uppercase text-foreground/60">{submitted.id}</span>
        </div>
        <div className="border border-dashed border-foreground/30 p-4 mb-4 font-mono text-xs">
          <div className="flex justify-between py-1"><span className="opacity-60">Route</span><span className="font-bold">{pickup} → {drop}</span></div>
          <div className="flex justify-between py-1"><span className="opacity-60">Distance</span><span>{submitted.km} km</span></div>
          <div className="flex justify-between py-1"><span className="opacity-60">Truck</span><span className="text-right">{submitted.truckLabel}</span></div>
          <div className="flex justify-between py-1"><span className="opacity-60">Payload</span><span>{submitted.weight.toLocaleString("en-IN")} kg @ ₹{PAYLOAD_RATE}/kg</span></div>
          <div className="flex justify-between py-1"><span className="opacity-60">Loading date</span><span>{date}</span></div>
          <div className="border-t border-foreground/20 mt-2 pt-2 flex justify-between text-base font-display tracking-wider"><span>TOTAL</span><span className="text-primary">{inr(submitted.total)}</span></div>
          <div className="text-[10px] opacity-60 mt-1">Inclusive of GST · Pay after delivery</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a href={`https://wa.me/919322662939?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white py-3 text-center font-bold text-sm uppercase tracking-wider hover:bg-green-700 transition-colors">WhatsApp Confirm</a>
          <a href="tel:9322662939" className="bg-foreground text-white py-3 text-center font-bold text-sm uppercase tracking-wider hover:bg-primary transition-colors">Call Dispatch</a>
        </div>
        <button onClick={() => setSubmitted(null)} className="w-full mt-3 text-[11px] font-mono uppercase tracking-wider text-foreground/60 hover:text-primary cursor-pointer">← Edit quote</button>
      </div>
    );
  }

  return (
    <div id="quote" className="lg:col-span-5 bg-card border-2 border-foreground p-5 sm:p-6 shadow-[8px_8px_0px_0px_hsl(220_40%_11%/0.12)] animate-entry [animation-delay:150ms] scroll-mt-24">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight italic">QUICK QUOTE</h2>
        <span className="text-[10px] font-mono uppercase text-primary flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-primary animate-pulse"/>Live fare</span>
      </div>
      <p className="text-[11px] font-mono uppercase tracking-wider text-foreground/50 mb-4">Estimate updates as you fill</p>
      <form
        className="space-y-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          const id = "VT-" + Date.now().toString(36).toUpperCase().slice(-6);
          setSubmitted({ id, total, km, truckLabel: t.label, weight: weightKg });
        }}
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1">
            <label htmlFor="qq-pickup" className="text-[10px] font-bold uppercase tracking-wider opacity-60">Pickup City</label>
            <select id="qq-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-card">
              {MH_CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="qq-drop" className="text-[10px] font-bold uppercase tracking-wider opacity-60">Drop City</label>
            <select id="qq-drop" value={drop} onChange={(e) => setDrop(e.target.value)} className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-card">
              {MH_CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {pickup === drop && (
          <p className="text-[11px] font-mono text-primary">Pickup and drop city must be different.</p>
        )}
        <div className="space-y-1">
          <label htmlFor="qq-goods" className="text-[10px] font-bold uppercase tracking-wider opacity-60">Parcel / Goods Type</label>
          <input id="qq-goods" required value={goods} onChange={(e) => setGoods(e.target.value)} maxLength={80} type="text" placeholder="e.g. Furniture, FMCG cartons, machinery" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1">
            <label htmlFor="qq-truck" className="text-[10px] font-bold uppercase tracking-wider opacity-60">Truck Type</label>
            <select id="qq-truck" value={truck} onChange={(e) => setTruck(e.target.value)} className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-card">
              {TRUCKS.map((x) => <option key={x.id} value={x.id}>{x.label} · {inr(x.rate)}/km</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="qq-weight" className="text-[10px] font-bold uppercase tracking-wider opacity-60">Payload (Kg) · ₹{PAYLOAD_RATE}/kg</label>
            <input id="qq-weight" required value={weight} onChange={(e) => setWeight(e.target.value.replace(/\D/g, "").slice(0, 6))} type="text" inputMode="numeric" placeholder={`up to ${t.capacity.toLocaleString("en-IN")} kg`} className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            {overCapacity && <p className="text-[10px] font-mono text-primary">Exceeds {t.capacity.toLocaleString("en-IN")} kg — pick a bigger truck</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1">
            <label htmlFor="qq-date" className="text-[10px] font-bold uppercase tracking-wider opacity-60">Loading Date</label>
            <input id="qq-date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-1">
            <label htmlFor="qq-mobile" className="text-[10px] font-bold uppercase tracking-wider opacity-60">Mobile</label>
            <div className="flex">
              <span className="border border-border border-r-0 px-2.5 flex items-center text-sm font-mono bg-muted/50">+91</span>
              <input id="qq-mobile" required value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} type="tel" inputMode="numeric" placeholder="98xxx xxxxx" className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            {mobile.length > 0 && !mobileValid && <p className="text-[10px] font-mono text-primary">Enter a valid 10-digit number</p>}
          </div>
        </div>

        {/* Live fare card */}
        <div className="border border-foreground/15 bg-muted/40 p-3.5 font-mono text-xs">
          <div className="flex justify-between"><span className="opacity-60">Distance (est.)</span><span>{km ? km + " km" : "—"}</span></div>
          <div className="flex justify-between"><span className="opacity-60">Fare ({inr(t.rate)}/km)</span><span>{km ? inr(fare) : "—"}</span></div>
          <div className="flex justify-between"><span className="opacity-60">Loading + toll</span><span>{km ? inr(t.base) : "—"}</span></div>
          <div className="flex justify-between"><span className="opacity-60">Payload ({weightKg ? weightKg.toLocaleString("en-IN") + " kg" : "0 kg"} × ₹{PAYLOAD_RATE})</span><span>{km && weightKg ? inr(payloadCharge) : "—"}</span></div>
          <div className="flex justify-between"><span className="opacity-60">GST 5%</span><span>{km ? inr(gst) : "—"}</span></div>
          <div className="border-t border-foreground/20 mt-2 pt-2 flex justify-between items-center">
            <span className="font-display tracking-wider text-sm">ESTIMATE</span>
            <span className="font-display text-2xl text-primary tracking-tight">{km ? inr(total) : "—"}</span>
          </div>
        </div>

        <button type="submit" disabled={!canSubmit} className="w-full bg-foreground text-white py-4 font-display text-xl tracking-widest hover:bg-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
          BOOK THIS TRUCK →
        </button>
        <p className="text-[10px] text-center font-mono uppercase tracking-wider text-foreground/50">Verified driver assigned · Pay after delivery · GPS tracking</p>
      </form>
    </div>
  );
}


function Index() {
  return (
    <div className="min-h-screen font-sans text-foreground bg-background selection:bg-primary/20">
      {/* Top trust strip */}
      <div className="bg-foreground text-white text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between gap-4 font-mono uppercase tracking-wider">
          <span className="hidden sm:inline opacity-80">🚛 Serving Maharashtra · 8 Major Cities</span>
          <span className="sm:hidden opacity-80">🚛 Across Maharashtra</span>
          <a href="tel:9322662939" className="flex items-center gap-2 font-bold hover:text-accent transition-colors">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Call · 9322662939
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Logo className="text-lg sm:text-2xl shrink-0" />
          <div className="hidden lg:flex gap-8 text-xs font-semibold uppercase tracking-widest">
            <a href="#how" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#fleet" className="hover:text-primary transition-colors">Trucks</a>
            <a href="#partner" className="hover:text-primary transition-colors">Partner</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <a href="#quote" className="hidden sm:inline-flex items-center text-xs font-bold uppercase border-2 border-foreground px-3 py-2 hover:bg-foreground hover:text-white transition-colors">Get Quote</a>
            <a href="#partner" className="bg-primary text-white px-3 sm:px-5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-tighter hover:bg-foreground transition-all whitespace-nowrap">Register Truck</a>
          </div>
        </div>
      </nav>

      <main>
      {/* Hero */}
      <section className="relative py-10 md:py-20 overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 road-stripe opacity-60" />
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 animate-entry">
            <div className="inline-flex items-center gap-2 bg-accent/15 text-foreground border border-accent/40 px-3 py-1.5 mb-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <span className="size-1.5 rounded-full bg-primary" /> Trusted by 1,200+ Businesses in Maharashtra
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display leading-[0.95] mb-5 text-balance">
              MOVING MAHARASHTRA <br />
              <span className="text-primary">ONE LOAD</span> AT A TIME
            </h1>
            <p className="max-w-[48ch] text-base sm:text-lg text-foreground/70 mb-8">
              Book a verified truck for your parcel in minutes. Real-time GPS tracking, transparent pricing, and door-to-door pickup across Maharashtra.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a href="#quote" className="bg-primary text-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-foreground transition-colors">Book a Truck →</a>
              <a href="tel:9322662939" className="border-2 border-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-white transition-colors">Call Now</a>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-6 border-t border-border pt-6">
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold">99.4%</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-60">On-time Delivery</div>
              </div>
              <div className="border-l border-border pl-3 sm:pl-6">
                <div className="font-mono text-xl sm:text-2xl font-bold">24/7</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-60">Live Support</div>
              </div>
              <div className="border-l border-border pl-3 sm:pl-6">
                <div className="font-mono text-xl sm:text-2xl font-bold">4%</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-60">Owner Commission</div>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <QuickQuote />

        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-muted/40 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: "12K+", v: "Loads Delivered" },
            { k: "1,200+", v: "Verified Drivers" },
            { k: "8", v: "Maharashtra Cities" },
            { k: "4.8★", v: "Customer Rating" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-3xl sm:text-4xl text-primary">{s.k}</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-foreground/60 font-bold">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-16 sm:py-20 border-b border-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">For Customers</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-10 sm:mb-12">HOW IT WORKS</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { n: "01", t: "Enter Details", d: "Tell us pickup, drop, parcel type, and truck size." },
              { n: "02", t: "Get Instant Quote", d: "Transparent commission-based pricing — no hidden charges." },
              { n: "03", t: "Verified Driver Assigned", d: "A background-checked partner picks up your load." },
              { n: "04", t: "Live Track & Deliver", d: "GPS-track your parcel end-to-end until safe delivery." },
            ].map((s) => (
              <div key={s.n} className="border-t-2 border-foreground pt-4 group">
                <div className="font-mono text-xs text-primary mb-2">STEP {s.n}</div>
                <h3 className="font-display text-2xl mb-2 group-hover:text-primary transition-colors">{s.t}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Showcase */}
      <section id="fleet" className="py-16 sm:py-20 bg-foreground text-background scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-10 sm:mb-12">
            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-xs">Our Fleet</span>
              <h3 className="font-display text-3xl sm:text-5xl mt-2">THE TRUCKS</h3>
              <p className="text-background/50 font-mono text-xs uppercase mt-1">Available for immediate dispatch</p>
            </div>
            <a href="#quote" className="hidden md:inline-block text-accent font-bold tracking-tighter hover:translate-x-1 transition-transform">→ BOOK NOW</a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {[
              { img: truck32, title: "32FT MULTI-AXLE", cap: "15,000 KG", desc: "Heavy industrial loads and long-haul parcel distribution.", price: "₹42/km" },
              { img: truck14, title: "14FT OPEN BODY", cap: "4,000 KG", desc: "Intra-city shifts and wholesale market logistics.", price: "₹28/km" },
              { img: truckAce, title: "TATA ACE (MINI)", cap: "850 KG", desc: "Last-mile delivery and narrow street navigation.", price: "₹15/km" },
            ].map((v) => (
              <div key={v.title} className="group bg-foreground p-6 sm:p-8 hover:bg-white/5 transition-colors">
                <div className="mb-6 h-40 sm:h-44 overflow-hidden">
                  <img src={v.img} alt={v.title} width={800} height={608} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="font-display text-2xl sm:text-3xl mb-1">{v.title}</div>
                <div className="font-mono text-xs text-accent mb-4">CAPACITY: {v.cap}</div>
                <p className="text-sm text-background/60 leading-relaxed mb-6">{v.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-sm font-bold italic">Est. {v.price}</span>
                  <a href="#quote" className="text-[10px] font-bold uppercase bg-accent text-foreground px-4 py-2 hover:bg-white transition-colors">Book →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-20 border-b border-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">What Customers Say</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-10">TRUSTED BY BUSINESSES</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "Priya Deshmukh", role: "Furniture Retailer · Pune", q: "Vivek Transportt has been our go-to logistics partner for 2 years. On-time, every time." },
              { n: "Anil Patil", role: "FMCG Distributor · Nashik", q: "Transparent pricing and excellent driver coordination. Saved us 20% on monthly logistics." },
              { n: "Sneha Kulkarni", role: "E-commerce · Mumbai", q: "Booking is so simple. The team picks up within hours and tracking is fully live." },
            ].map((t) => (
              <figure key={t.n} className="bg-card border border-border p-6 hover:border-primary transition-colors">
                <div className="text-accent text-xl mb-3">★★★★★</div>
                <blockquote className="text-foreground/80 mb-5 leading-relaxed">"{t.q}"</blockquote>
                <figcaption>
                  <div className="font-bold text-sm">{t.n}</div>
                  <div className="text-xs font-mono uppercase text-foreground/50">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section id="partner" className="py-16 sm:py-24 bg-accent/10 border-y border-border overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <img src={partnerDriver} alt="Vivek Transportt fleet partner" width={1024} height={1024} loading="lazy" className="w-full aspect-square object-cover border border-border shadow-2xl" />
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-primary text-white p-5 sm:p-8 max-w-[14rem] sm:max-w-xs shadow-xl">
              <p className="font-display text-lg sm:text-2xl leading-tight">"I increased my monthly revenue by 40% since joining Vivek Transportt."</p>
              <div className="mt-3 sm:mt-4 font-mono text-xs">— RAJESH K., TRUCK OWNER</div>
            </div>
          </div>
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Truck Owner Program</span>
            <h2 className="text-3xl sm:text-6xl font-display mt-3 mb-6 leading-none italic">EARN WITH <br />YOUR TRUCK</h2>
            <p className="text-foreground/70 mb-8 max-w-md">Add your truck to Vivek Transportt and start receiving bookings within 48 hours. We run on a transparent commission model — you keep the rest.</p>
            <ul className="space-y-5 mb-8">
              {[
                { n: "01", t: "Guaranteed Backhauls", d: "Never drive an empty truck. We optimize your return journeys." },
                { n: "02", t: "Timely Payments", d: "Get paid within 48 hours of delivery completion. No hassles." },
                { n: "03", t: "Transparent Commission", d: "Fixed 4% commission on successful bookings. That's it." },
              ].map((b) => (
                <li key={b.n} className="flex gap-4">
                  <span className="bg-foreground text-background size-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0">{b.n}</span>
                  <div>
                    <h3 className="font-bold text-sm uppercase">{b.t}</h3>
                    <p className="text-sm text-foreground/60">{b.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <PartnerForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">FAQ</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-10">FREQUENTLY ASKED</h2>
          <div className="divide-y divide-border border-y border-border">
            {[
              { q: "How quickly can I get a truck?", a: "For city movements, trucks can be dispatched within 2-4 hours. For intercity routes, we recommend 24-hour advance booking for best rates." },
              { q: "Are your drivers verified?", a: "Yes. Every partner driver goes through background checks, license verification, and a formal onboarding process before joining the platform." },
              { q: "How is the price calculated?", a: "Pricing is based on distance, truck type, and parcel weight. There are no hidden charges — you see the final price upfront before confirming." },
              { q: "Do you provide GPS tracking?", a: "Yes. Every booking includes real-time GPS tracking shared with you via SMS and WhatsApp link." },
              { q: "What if my parcel is damaged?", a: "All shipments are eligible for our basic liability cover. We also offer optional in-transit insurance for high-value loads." },
            ].map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex justify-between items-center cursor-pointer font-bold text-base sm:text-lg list-none">
                  <span className="pr-4">{f.q}</span>
                  <span className="text-primary text-2xl shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-foreground/70 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl sm:text-5xl leading-none">READY TO MOVE YOUR PARCEL?</h2>
            <p className="text-white/80 mt-2">Get an instant quote in 2 minutes. Pay only after delivery.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="#quote" className="bg-white text-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-white transition-colors">Book Now</a>
            <a href="tel:9322662939" className="border-2 border-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-primary transition-colors">Call 9322662939</a>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-foreground text-white pt-16 sm:pt-20 pb-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-10 sm:gap-12 mb-16">
            <div className="md:col-span-4">
              <Logo className="text-3xl sm:text-4xl mb-6" invert />
              <p className="text-sm text-white/60 max-w-sm mb-6">
                Standardizing Maharashtra's fragmented logistics sector through technology, transparency, and top-tier service.
              </p>
              <div className="flex gap-3">
                {["in", "fb", "tw"].map((s) => (
                  <div key={s} className="size-10 border border-white/20 grid place-items-center hover:bg-primary hover:border-primary transition-colors cursor-pointer italic font-serif">{s}</div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-5 text-accent">Coverage</h5>
              <ul className="text-sm text-white/60 space-y-2 font-mono">
                <li>Mumbai</li>
                <li>Pune</li>
                <li>Nagpur</li>
                <li>Nashik</li>
                <li>Thane</li>
                <li>Aurangabad</li>
                <li>Kolhapur</li>
                <li>Solapur</li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-5 text-accent">Contact</h5>
              <p className="text-sm text-white/60 mb-3">
                Star Recidency, Malinagar 301
              </p>
              <a href="tel:9322662939" className="text-sm font-bold block hover:text-primary transition-colors">9322662939</a>
              <a href="mailto:vivektransportt@gmail.com" className="text-sm text-primary font-mono hover:underline">vivektransportt@gmail.com</a>
            </div>
            <div className="md:col-span-3">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-5 text-accent">Founder</h5>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={founderAsset.url}
                  alt="Vivek Taware, Founder"
                  width={120}
                  height={120}
                  loading="lazy"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover border-2 border-primary shrink-0"
                />
                <div className="pt-1 min-w-0">
                  <div className="font-display text-2xl sm:text-3xl tracking-wide leading-tight">VIVEK TAWARE</div>
                  <div className="text-primary font-bold uppercase tracking-widest text-xs mt-2">Founder</div>
                  <div className="text-sm text-white/60 mt-2 leading-relaxed">
                    Entrepreneur with a vision to modernize logistics across Maharashtra.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase font-mono tracking-widest opacity-50 text-center md:text-left">© 2026 VIVEK TRANSPORTT. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">Carrier Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp / Call */}
      <a
        href="tel:9322662939"
        aria-label="Call Vivek Transportt"
        className="fixed bottom-5 right-5 z-50 bg-primary text-white size-14 rounded-full shadow-2xl grid place-items-center hover:scale-110 transition-transform"
      >
        <span className="text-2xl">📞</span>
      </a>
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
      className="bg-foreground text-white p-5 sm:p-6 border-2 border-foreground"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input required aria-label="Owner Name" placeholder="Owner Name" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary" />
        <input required type="tel" aria-label="Mobile Number" placeholder="Mobile Number" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <input required aria-label="City" placeholder="City" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary" />
        <input required type="number" min={1} max={500} aria-label="Number of Trucks" placeholder="No. of Trucks" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary" />
      </div>
      <button type="submit" className="w-full bg-primary text-white py-4 sm:py-5 font-display text-xl sm:text-2xl tracking-widest hover:bg-accent hover:text-foreground transition-all flex items-center justify-center gap-4 group">
        REGISTER YOUR TRUCK <span className="group-hover:translate-x-2 transition-transform">→</span>
      </button>
    </form>
  );
}
