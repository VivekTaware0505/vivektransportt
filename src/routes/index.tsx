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

        {/* Live fare card — prominent */}
        <div className="relative border-2 border-foreground bg-gradient-to-br from-accent/10 via-card to-card p-4 sm:p-5 shadow-[4px_4px_0_0_hsl(215_68%_14%/0.9)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-primary animate-pulse"/>Live estimate</span>
            <details className="relative">
              <summary className="cursor-pointer size-5 rounded-full border border-foreground/40 text-[10px] font-bold grid place-items-center hover:bg-foreground hover:text-white transition-colors list-none">i</summary>
              <div className="absolute right-0 top-7 z-20 w-64 bg-foreground text-white p-3 text-[11px] font-mono leading-relaxed shadow-xl">
                <div className="font-bold text-accent mb-1">HOW PRICING WORKS</div>
                Distance × Truck-rate + Loading/Toll + (Weight × ₹{PAYLOAD_RATE}/kg) + 5% GST. No hidden charges — pay after delivery.
              </div>
            </details>
          </div>
          <div className="font-mono text-[11px] sm:text-xs space-y-1">
            <div className="flex justify-between"><span className="opacity-60">Distance</span><span className="font-bold">{km ? km + " km" : "—"}</span></div>
            <div className="flex justify-between"><span className="opacity-60">Fare ({inr(t.rate)}/km)</span><span>{km ? inr(fare) : "—"}</span></div>
            <div className="flex justify-between"><span className="opacity-60">Loading + toll</span><span>{km ? inr(t.base) : "—"}</span></div>
            <div className="flex justify-between"><span className="opacity-60">Payload × ₹{PAYLOAD_RATE}/kg</span><span>{km && weightKg ? inr(payloadCharge) : "—"}</span></div>
            <div className="flex justify-between"><span className="opacity-60">GST 5%</span><span>{km ? inr(gst) : "—"}</span></div>
          </div>
          <div className="mt-3 pt-3 border-t-2 border-dashed border-foreground/20 flex justify-between items-baseline">
            <span className="font-display tracking-widest text-base sm:text-lg">TOTAL</span>
            <span className="font-display text-3xl sm:text-4xl text-primary tracking-tight">{km ? inr(total) : "—"}</span>
          </div>
        </div>

        <button type="submit" disabled={!canSubmit} className="w-full bg-primary text-white py-5 font-display text-2xl sm:text-3xl tracking-widest hover:bg-accent transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg">
          BOOK NOW →
        </button>
        <p className="text-[10px] text-center font-mono uppercase tracking-wider text-foreground/60">Verified driver · Pay after delivery · GPS tracking · No hidden charges</p>
      </form>
    </div>
  );
}



function Index() {
  return (
    <div className="min-h-screen font-sans text-foreground bg-background selection:bg-primary/20">
      {/* Top trust strip */}
      <div className="bg-foreground text-white text-[11px] sm:text-xs">
        <div className="container-page h-9 flex items-center justify-between gap-4 font-mono uppercase tracking-wider">
          <span className="hidden sm:inline opacity-80">🚛 Serving Maharashtra · 8 Major Cities</span>
          <span className="sm:hidden opacity-80">🚛 Across Maharashtra</span>
          <a href="tel:9322662939" className="flex items-center gap-2 font-bold hover:text-accent transition-colors">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Call · 9322662939
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container-page h-16 flex items-center justify-between gap-3">
          <Logo className="text-lg sm:text-2xl shrink-0" />
          <div className="hidden lg:flex gap-6 xl:gap-8 text-xs font-semibold uppercase tracking-widest">
            <a href="#how" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#vehicles" className="hover:text-accent transition-colors">Vehicles</a>
            <a href="#track" className="hover:text-accent transition-colors">Track</a>
            <a href="#partner" className="hover:text-accent transition-colors">Drivers</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </div>
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <a href="#quote" className="hidden sm:inline-flex items-center text-xs font-bold uppercase border-2 border-foreground px-3 py-2 hover:bg-foreground hover:text-white transition-colors">Get Quote</a>
            <a href="#partner" className="bg-primary text-white px-3 sm:px-5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-tighter hover:bg-foreground transition-all whitespace-nowrap">Register Truck</a>
          </div>
        </div>
        {/* Mobile section links */}
        <div className="lg:hidden border-t border-border overflow-x-auto scrollbar-none">
          <div className="flex gap-5 px-4 py-2 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
            <a href="#quote" className="text-primary">Quote</a>
            <a href="#how" className="text-foreground/70">How it Works</a>
            <a href="#vehicles" className="text-foreground/70">Vehicles</a>
            <a href="#track" className="text-foreground/70">Track</a>
            <a href="#partner" className="text-foreground/70">Drivers</a>
            <a href="#contact" className="text-foreground/70">Contact</a>
          </div>
        </div>
      </nav>


      <main>
      {/* Hero */}
      <section className="relative py-10 md:py-20 overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 road-stripe opacity-60" />
        <div className="container-page grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 animate-entry">
            <div className="inline-flex items-center gap-2 bg-accent/15 text-foreground border border-accent/40 px-3 py-1.5 mb-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <span className="size-1.5 rounded-full bg-primary" /> Trusted by 1,200+ Businesses in Maharashtra
            </div>
            <h1 className="h-fluid-hero font-display mb-5 text-balance">
              RELIABLE TRANSPORT SOLUTIONS <br className="hidden sm:inline" />
              ACROSS <span className="text-accent">MAHARASHTRA</span> & INDIA
            </h1>
            <p className="max-w-[52ch] text-base sm:text-lg text-foreground/70 mb-6">
              Safe, fast and affordable transportation services for businesses and individuals — book a verified truck for your parcel in minutes with real-time GPS tracking and door-to-door pickup.
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8 max-w-md">
              {["24×7 Support", "GPS Tracking", "Experienced Drivers", "On-Time Delivery"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-[color:var(--success)] text-lg leading-none">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 mb-8">
              <a href="#quote" className="bg-primary text-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-accent transition-colors">Book a Truck →</a>
              <a href="tel:9322662939" className="bg-accent text-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors">📞 Call Now · 9322662939</a>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-6 border-t border-border pt-6">
              <div>
                <div className="font-display text-3xl sm:text-5xl text-primary tracking-tight leading-none">99.4<span className="text-xl sm:text-2xl">%</span></div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-60 font-bold mt-1">On-time Delivery</div>
              </div>
              <div className="border-l border-border pl-3 sm:pl-6">
                <div className="font-display text-3xl sm:text-5xl text-primary tracking-tight leading-none">24<span className="text-xl sm:text-2xl">/7</span></div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-60 font-bold mt-1">Live Support</div>
              </div>
              <div className="border-l border-border pl-3 sm:pl-6">
                <div className="font-display text-3xl sm:text-5xl text-accent tracking-tight leading-none">96<span className="text-xl sm:text-2xl">%</span></div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-60 font-bold mt-1">Owner Payout</div>
              </div>
            </div>

          </div>

          {/* Booking Widget */}
          <QuickQuote />

        </div>
      </section>

      {/* Live activity ticker */}
      <section aria-label="Recent activity" className="border-b border-border bg-foreground text-white overflow-hidden">
        <div className="container-page py-2.5 flex items-center gap-4">
          <span className="shrink-0 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent"><span className="size-1.5 rounded-full bg-accent animate-pulse"/>Live</span>
          <div className="flex-1 overflow-hidden relative">
            <div className="flex gap-10 whitespace-nowrap animate-[ticker_40s_linear_infinite] text-xs sm:text-sm font-mono">
              {[
                "✓ 5-ton load delivered · Pune → Mumbai · 10 min ago",
                "✓ Tata Ace booked · Nashik local · 18 min ago",
                "✓ 32ft dispatched · Nagpur → Aurangabad · 27 min ago",
                "✓ 4-ton parcel picked up · Thane → Kolhapur · 42 min ago",
                "✓ Container booked · Solapur → Mumbai · 1 hr ago",
                "✓ Owner registered · MH-14 Pune · 2 hr ago",
              ].concat([
                "✓ 5-ton load delivered · Pune → Mumbai · 10 min ago",
                "✓ Tata Ace booked · Nashik local · 18 min ago",
                "✓ 32ft dispatched · Nagpur → Aurangabad · 27 min ago",
                "✓ 4-ton parcel picked up · Thane → Kolhapur · 42 min ago",
              ]).map((t, i) => (
                <span key={i} className="text-white/85">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-muted/40 py-6">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: "12K+", v: "Loads Delivered" },
            { k: "1,200+", v: "Verified Drivers" },
            { k: "8", v: "Maharashtra Cities" },
            { k: "4.8★", v: "Customer Rating" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-4xl sm:text-5xl text-primary tracking-tight">{s.k}</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-foreground/60 font-bold mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>


      {/* How it Works */}
      <section id="how" className="py-16 sm:py-20 border-b border-border scroll-mt-20">
        <div className="container-page">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">For Customers</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-10 sm:mb-12">HOW IT WORKS</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 xl:gap-10">
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
        <div className="container-page">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-10 sm:mb-12">
            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-xs">Our Fleet</span>
              <h3 className="font-display text-3xl sm:text-5xl mt-2">THE TRUCKS</h3>
              <p className="text-background/50 font-mono text-xs uppercase mt-1">Available for immediate dispatch</p>
            </div>
            <a href="#quote" className="hidden md:inline-block text-accent font-bold tracking-tighter hover:translate-x-1 transition-transform">→ BOOK NOW</a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 xl:gap-1">
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

      {/* Vehicle Types */}
      <section id="vehicles" className="py-16 sm:py-20 border-b border-border scroll-mt-20">
        <div className="container-page">
          <span className="text-accent font-bold uppercase tracking-widest text-xs">Our Vehicles</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-2">EVERY TRUCK YOU NEED</h2>
          <p className="text-foreground/60 mb-10 max-w-2xl">From last-mile pickups to full trailer loads — we operate a wide range of verified vehicles across Maharashtra.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
            {[
              { n: "Pickup", c: "750 – 1,500 kg", ic: "🛻" },
              { n: "Tata Ace", c: "750 kg", ic: "🚐" },
              { n: "Mahindra Bolero Pickup", c: "1.2 T", ic: "🛻" },
              { n: "Tata 407", c: "2.5 T", ic: "🚚" },
              { n: "14 Feet Truck", c: "4 T", ic: "🚛" },
              { n: "17 Feet Truck", c: "5 T", ic: "🚛" },
              { n: "Container", c: "7 – 15 T", ic: "📦" },
              { n: "Trailer", c: "25 T+", ic: "🚜" },
            ].map((v) => (
              <div key={v.n} className="bg-card border border-border p-5 hover:border-accent hover:shadow-lg transition-all">
                <div className="text-3xl mb-3">{v.ic}</div>
                <div className="font-bold text-sm uppercase leading-tight">{v.n}</div>
                <div className="text-xs font-mono text-foreground/50 mt-1">{v.c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section id="track" className="py-16 sm:py-20 bg-primary text-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4">
          <span className="text-accent font-bold uppercase tracking-widest text-xs">Track Your Shipment</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-3">WHERE IS MY PARCEL?</h2>
          <p className="text-white/70 mb-8 max-w-xl">Enter your tracking ID (e.g. VT-XXXXXX) and see real-time status of your consignment.</p>
          <TrackingWidget />
        </div>
      </section>


      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-20 border-b border-border scroll-mt-20">
        <div className="container-page">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">What Customers Say</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-10">TRUSTED BY BUSINESSES</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "Priya Deshmukh", role: "Furniture Retailer", city: "Pune", biz: "Deshmukh Furnitures", q: "Vivek Transportt has been our go-to logistics partner for 2 years. On-time, every time.", color: "F97316" },
              { n: "Anil Patil", role: "FMCG Distributor", city: "Nashik", biz: "Patil Traders", q: "Transparent pricing and excellent driver coordination. Saved us 20% on monthly logistics.", color: "0B1F3A" },
              { n: "Sneha Kulkarni", role: "E-commerce Owner", city: "Mumbai", biz: "Wraplynn.in", q: "Booking is so simple. The team picks up within hours and tracking is fully live.", color: "22C55E" },
            ].map((t) => (
              <figure key={t.n} className="bg-card border border-border p-6 hover:border-primary hover:shadow-lg transition-all">
                <div className="text-accent text-xl mb-3">★★★★★</div>
                <blockquote className="text-foreground/85 mb-5 leading-relaxed text-[15px]">"{t.q}"</blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.n)}&background=${t.color}&color=fff&size=96&bold=true`}
                    alt={t.n}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="size-12 rounded-full shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">{t.n}</div>
                    <div className="text-[11px] font-mono uppercase text-foreground/60 truncate">{t.role} · {t.city}</div>
                    <div className="text-[11px] text-primary font-semibold truncate">{t.biz}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

        </div>
      </section>

      {/* Partner Section */}
      <section id="partner" className="py-16 sm:py-24 bg-accent/10 border-y border-border overflow-hidden scroll-mt-20">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <img src={partnerDriver} alt="Vivek Transportt fleet partner" width={1024} height={1024} loading="lazy" className="w-full aspect-square object-cover border border-border shadow-2xl" />
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-primary text-white p-5 sm:p-8 max-w-[14rem] sm:max-w-xs shadow-xl">
              <p className="font-display text-lg sm:text-2xl leading-tight">"I increased my monthly revenue by 40% since joining Vivek Transportt."</p>
              <div className="mt-3 sm:mt-4 font-mono text-xs">— RAJESH K., TRUCK OWNER</div>
            </div>
          </div>
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Truck Owner Program</span>
            <h2 className="font-display mt-3 mb-4 leading-[0.9]">
              <span className="block text-5xl sm:text-7xl text-accent tracking-tight">EARN 96%</span>
              <span className="block text-2xl sm:text-4xl italic text-foreground/80 mt-1">OF EVERY FARE</span>
            </h2>
            <div className="inline-flex items-center gap-2 bg-foreground text-white px-3 py-1.5 mb-5 text-[11px] font-mono uppercase tracking-widest">
              <span className="text-accent">Only 4% commission</span> · No monthly fee · No hidden cuts
            </div>
            <p className="text-foreground/70 mb-8 max-w-md">Add your truck to Vivek Transportt and start receiving bookings within 48 hours. India's most transparent commission — you keep 96 rupees of every 100.</p>
            <ul className="space-y-5 mb-8">
              {[
                { n: "01", t: "Guaranteed Backhauls", d: "Never drive an empty truck. We optimize your return journeys." },
                { n: "02", t: "48-Hour Payments", d: "Get paid within 48 hours of delivery completion. Direct to bank." },
                { n: "03", t: "You Keep 96%", d: "Flat 4% platform fee on completed bookings. No surprises, no upsells." },
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

      {/* Why Choose Us — comparison table */}
      <section className="py-16 sm:py-20 border-b border-border bg-muted/30">
        <div className="container-page">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">The Difference</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-3">WHY CHOOSE VIVEK TRANSPORTT</h2>
          <p className="text-foreground/60 mb-8 max-w-2xl">See how we compare with traditional, unorganized transport agents across Maharashtra.</p>
          <div className="overflow-x-auto border-2 border-foreground bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground text-white">
                  <th className="text-left p-4 font-display tracking-widest text-base">FEATURE</th>
                  <th className="text-left p-4 font-display tracking-widest text-base bg-primary">VIVEK TRANSPORTT</th>
                  <th className="text-left p-4 font-display tracking-widest text-base text-white/60">TRADITIONAL AGENTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Pricing", "Transparent · fixed formula", "Negotiated · varies daily"],
                  ["Driver Verification", "Background checks + RC verified", "Rarely verified"],
                  ["GPS Tracking", "Live · shared on WhatsApp", "Phone calls only"],
                  ["Payment Terms", "Pay after delivery", "Advance demanded"],
                  ["Commission to Owner", "Flat 4% (you keep 96%)", "10–20% + hidden cuts"],
                  ["Booking Time", "60 seconds online", "Hours of phone tag"],
                  ["Support", "24×7 dispatch team", "Office hours only"],
                ].map(([f, a, b]) => (
                  <tr key={f} className="hover:bg-muted/40">
                    <td className="p-4 font-bold">{f}</td>
                    <td className="p-4 text-foreground"><span className="text-[color:var(--success)] mr-1.5 font-bold">✓</span>{a}</td>
                    <td className="p-4 text-foreground/60"><span className="text-[color:var(--danger)] mr-1.5 font-bold">✕</span>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Insurance & Liability */}
      <section id="insurance" className="py-16 sm:py-20 border-b border-border scroll-mt-20">
        <div className="container-page grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <span className="text-accent font-bold uppercase tracking-widest text-xs">Safety & Trust</span>
            <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-4">INSURANCE & LIABILITY</h2>
            <p className="text-foreground/70 mb-6">Every load moves under our basic liability cover. High-value consignments can add in-transit insurance at checkout.</p>
            <a href="tel:9322662939" className="inline-block border-2 border-foreground px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-white transition-colors">Talk to Claims Desk</a>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <div className="border-2 border-[color:var(--success)]/40 bg-[color:var(--success)]/5 p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--success)] mb-2">✓ What's Covered</div>
              <ul className="text-sm space-y-2 text-foreground/85">
                <li>• Physical damage during transit up to ₹25,000 (basic)</li>
                <li>• Full declared-value cover with add-on insurance</li>
                <li>• Loss / theft during authorized carrier custody</li>
                <li>• Accident damage on booked route</li>
              </ul>
            </div>
            <div className="border-2 border-[color:var(--danger)]/30 bg-[color:var(--danger)]/5 p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--danger)] mb-2">✕ What's Not Covered</div>
              <ul className="text-sm space-y-2 text-foreground/85">
                <li>• Undeclared valuables, cash, jewellery</li>
                <li>• Pre-existing packaging damage</li>
                <li>• Prohibited or illegal goods</li>
                <li>• Natural calamities without add-on cover</li>
              </ul>
            </div>
            <div className="sm:col-span-2 bg-card border border-border p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">How to Claim</div>
              <ol className="text-sm space-y-1.5 text-foreground/85 font-mono">
                <li><span className="text-accent font-bold">1.</span> Report within 24 hrs on WhatsApp or call 9322662939</li>
                <li><span className="text-accent font-bold">2.</span> Share booking ID, photos, and copy of e-way bill</li>
                <li><span className="text-accent font-bold">3.</span> Claims desk verifies with driver & carrier (2–3 days)</li>
                <li><span className="text-accent font-bold">4.</span> Approved amount credited to your bank in 7 working days</li>
              </ol>
            </div>
          </div>
        </div>
      </section>



      {/* Admin Panel Info */}
      <section id="admin" className="py-16 sm:py-20 bg-muted/50 border-b border-border scroll-mt-20">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <span className="text-accent font-bold uppercase tracking-widest text-xs">Operations Control</span>
              <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-4">ADMIN PANEL</h2>
              <p className="text-foreground/70 mb-6">This is where our company runs. A single dashboard gives our operations team complete control over drivers, trucks, bookings, and payments — so every parcel moves smoothly from pickup to delivery.</p>
              <div className="flex gap-2 items-center text-xs font-mono uppercase text-foreground/60"><span className="size-2 rounded-full bg-[color:var(--success)]" /> Live · Internal team access only</div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 xl:grid-cols-4 gap-3">
              {[
                { i: "👥", t: "Manage Drivers" },
                { i: "🚛", t: "Manage Trucks" },
                { i: "📋", t: "View Bookings" },
                { i: "🎯", t: "Assign Driver" },
                { i: "🧾", t: "Generate Invoice" },
                { i: "🙋", t: "Customer Management" },
                { i: "📨", t: "Contact Requests" },
                { i: "💳", t: "Payments" },
              ].map((a) => (
                <div key={a.t} className="bg-card border border-border px-4 py-3.5 flex items-center gap-3 hover:border-accent transition-colors">
                  <span className="text-xl">{a.i}</span>
                  <span className="text-sm font-semibold">{a.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 sm:py-20 border-b border-border scroll-mt-20">
        <div className="container-page">
          <span className="text-accent font-bold uppercase tracking-widest text-xs">Get In Touch</span>
          <h2 className="text-3xl sm:text-5xl font-display mt-3 mb-10">CONTACT US</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[420px] border border-border overflow-hidden bg-muted">
              <iframe
                title="Vivek Transportt office location"
                src="https://www.google.com/maps?q=Malinagar+Solapur+Maharashtra&output=embed"
                loading="lazy"
                className="w-full h-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 content-start">
              {[
                { i: "📍", t: "Office Address", v: "Star Recidency, Malinagar 301, Maharashtra" },
                { i: "📞", t: "Phone", v: "9322662939", href: "tel:9322662939" },
                { i: "💬", t: "WhatsApp", v: "Chat with dispatch", href: "https://wa.me/919322662939" },
                { i: "✉️", t: "Email", v: "vivektransportt@gmail.com", href: "mailto:vivektransportt@gmail.com" },
                { i: "🕐", t: "Working Hours", v: "Mon – Sun · 24 × 7 Dispatch" },
                { i: "🚛", t: "Service Area", v: "Maharashtra & Pan-India" },
              ].map((c) => (
                <a
                  key={c.t}
                  href={c.href ?? "#"}
                  {...(c.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`bg-card border border-border p-5 block hover:border-accent hover:shadow-md transition-all ${c.href ? "cursor-pointer" : "pointer-events-none"}`}
                >
                  <div className="text-2xl mb-2">{c.i}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-1">{c.t}</div>
                  <div className="text-sm font-semibold text-foreground">{c.v}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="container-page flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
      <footer className="bg-[hsl(215_68%_9%)] text-white pt-16 sm:pt-20 pb-8 scroll-mt-20 border-t border-white/5">
        <div className="container-page">
          {/* CTA strip */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-[hsl(21_94%_45%)] p-6 sm:p-8 mb-14 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" aria-hidden />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80 mb-2">Ready to move?</div>
              <div className="font-display text-2xl sm:text-3xl leading-tight">Book a truck in 60 seconds.</div>
            </div>
            <div className="relative flex gap-3">
              <a href="#book" className="bg-white text-accent px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors">Get Quote</a>
              <a href="https://wa.me/919322662939" target="_blank" rel="noreferrer" className="border-2 border-white/70 px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-accent transition-colors">WhatsApp</a>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-10 sm:gap-12 mb-14">
            <div className="md:col-span-4">
              <Logo className="text-3xl sm:text-4xl mb-5" invert />
              <p className="text-sm text-white/55 max-w-sm mb-6 leading-relaxed">
                Standardizing Maharashtra's fragmented logistics sector through technology, transparency, and top-tier service.
              </p>

              {/* Founder card — compact, left corner */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10 max-w-sm">
                <div className="shrink-0">
                  <img
                    src={founderAsset.url}
                    alt="Vivek Taware, Founder"
                    width={72}
                    height={72}
                    loading="lazy"
                    className="w-16 h-16 sm:w-[72px] sm:h-[72px] object-cover rounded-full ring-2 ring-white/20"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-lg sm:text-xl tracking-wide leading-tight">Vivek Taware</div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent mt-0.5">Founder</div>
                  <p className="text-[11px] sm:text-xs text-white/60 mt-1.5 leading-relaxed line-clamp-2">
                    Entrepreneur modernizing road logistics across Maharashtra with fair pricing & verified drivers.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-5 text-accent">Coverage</h5>
              <ul className="text-sm text-white/60 grid grid-cols-2 gap-y-2 gap-x-4 font-mono">
                {["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Kolhapur", "Solapur"].map((c) => (
                  <li key={c} className="flex items-center gap-2"><span className="w-1 h-1 bg-accent" />{c}</li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-5">
              <h5 className="font-bold text-xs uppercase tracking-widest mb-5 text-accent">Get in Touch</h5>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 size-9 grid place-items-center border border-white/15 rounded-md bg-white/[0.03]" aria-hidden>📍</span>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Office</div>
                    <div className="text-sm text-white/80">Star Recidency, Malinagar 301, Maharashtra</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 size-9 grid place-items-center border border-white/15 rounded-md bg-white/[0.03]" aria-hidden>📞</span>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Phone / WhatsApp</div>
                    <a href="tel:9322662939" className="text-sm font-bold text-white hover:text-accent transition-colors">+91 93226 62939</a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 size-9 grid place-items-center border border-white/15 rounded-md bg-white/[0.03]" aria-hidden>✉</span>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Email</div>
                    <a href="mailto:vivektransportt@gmail.com" className="text-sm font-mono text-white/80 hover:text-accent transition-colors break-all">vivektransportt@gmail.com</a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 shrink-0 size-9 grid place-items-center border border-white/15 rounded-md bg-white/[0.03]" aria-hidden>⏱</span>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Hours</div>
                    <div className="text-sm text-white/80">Mon – Sun · 24×7 Dispatch</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase font-mono tracking-widest text-white/40 text-center md:text-left">© 2026 VIVEK TRANSPORTT · ALL RIGHTS RESERVED · MADE IN MAHARASHTRA</p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="text-white/40 hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="text-white/40 hover:text-accent transition-colors">Carrier Terms</a>
              <a href="#" className="text-white/40 hover:text-accent transition-colors">Admin</a>
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

const COMMISSION_PCT = 4;
const TRUCK_TYPES = ["Tata Ace (750 kg)", "Pickup (1.5 T)", "Eicher 14ft (3 T)", "Tata 407 (2.5 T)", "Tata LPT 1109 (6 T)", "10-Wheeler (15 T)", "12-Wheeler (20 T)", "Trailer (25 T+)"];

function PartnerForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    owner: "",
    mobile: "",
    city: "",
    truckType: TRUCK_TYPES[0],
    regNo: "",
    capacity: "",
    routes: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mobileOk = /^[6-9]\d{9}$/.test(form.mobile);
  const regOk = form.regNo.trim().length >= 6;
  const canSubmit = form.owner.trim() && mobileOk && form.city.trim() && regOk && form.capacity;

  const waText = encodeURIComponent(
    `Hi Vivek Transportt, I want to register my truck.\n` +
    `Owner: ${form.owner}\nMobile: +91${form.mobile}\nCity: ${form.city}\n` +
    `Truck: ${form.truckType}\nReg No: ${form.regNo.toUpperCase()}\n` +
    `Capacity: ${form.capacity} kg\nPreferred Routes: ${form.routes || "Any"}\n` +
    `I accept the ${COMMISSION_PCT}% platform commission.`
  );

  if (sent) {
    return (
      <div className="bg-foreground text-white p-6 border-2 border-foreground">
        <div className="font-display text-2xl mb-2">Application received ✓</div>
        <p className="text-sm text-white/70 mb-4">Our partner team will call you within 24 hours to verify your truck and RC. Send your details on WhatsApp to speed it up.</p>
        <a
          href={`https://wa.me/919322662939?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 text-sm font-bold uppercase tracking-wider transition-colors"
        >
          Send on WhatsApp →
        </a>
        <button type="button" onClick={() => setSent(false)} className="ml-3 text-xs text-white/60 underline">Register another truck</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        window.open(`https://wa.me/919322662939?text=${waText}`, "_blank", "noopener,noreferrer");
        setSent(true);
      }}
      className="bg-foreground text-white p-5 sm:p-6 border-2 border-foreground"
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <span className="text-[10px] uppercase tracking-widest text-white/60">Platform Commission</span>
        <span className="font-mono text-sm font-bold text-accent">{COMMISSION_PCT}% flat · You keep {100 - COMMISSION_PCT}%</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input required maxLength={60} value={form.owner} onChange={set("owner")} aria-label="Owner Name" placeholder="Owner Name" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary" />
        <div>
          <div className="flex items-center bg-white/5 border border-white/15 focus-within:border-primary">
            <span className="px-3 text-sm text-white/60 border-r border-white/15">+91</span>
            <input required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))} aria-label="Mobile Number" placeholder="10-digit mobile" className="flex-1 bg-transparent px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none" />
          </div>
          {form.mobile && !mobileOk && <p className="text-[10px] text-red-400 mt-1">Enter a valid Indian mobile</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input required maxLength={40} value={form.city} onChange={set("city")} aria-label="City" placeholder="City (e.g. Pune)" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary" />
        <select value={form.truckType} onChange={set("truckType")} aria-label="Truck Type" className="bg-white/5 border border-white/15 px-3 py-3 text-sm text-white focus:outline-none focus:border-primary">
          {TRUCK_TYPES.map((t) => <option key={t} value={t} className="bg-foreground">{t}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <input required maxLength={15} value={form.regNo} onChange={(e) => setForm((f) => ({ ...f, regNo: e.target.value.toUpperCase().slice(0, 15) }))} aria-label="Vehicle Registration Number" placeholder="Reg No. (MH12AB1234)" className="w-full bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary" />
          {form.regNo && !regOk && <p className="text-[10px] text-red-400 mt-1">Enter full registration number</p>}
        </div>
        <input required type="number" min={100} max={40000} value={form.capacity} onChange={set("capacity")} aria-label="Capacity in kg" placeholder="Capacity (kg)" className="bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary" />
      </div>
      <input maxLength={100} value={form.routes} onChange={set("routes")} aria-label="Preferred Routes" placeholder="Preferred routes (optional, e.g. Pune–Mumbai)" className="w-full bg-white/5 border border-white/15 px-3 py-3 text-sm placeholder:text-white/60 focus:outline-none focus:border-primary mb-4" />
      <button type="submit" disabled={!canSubmit} className="w-full bg-primary text-white py-4 sm:py-5 font-display text-xl sm:text-2xl tracking-widest hover:bg-accent hover:text-foreground transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed">
        REGISTER YOUR TRUCK <span className="group-hover:translate-x-2 transition-transform">→</span>
      </button>
      <p className="text-[10px] text-white/50 mt-3 text-center">By registering you agree to our {COMMISSION_PCT}% commission on completed bookings. Keep your RC & license ready for verification.</p>
    </form>
  );
}

const TRACK_STAGES = ["Booked", "Driver Assigned", "Loaded", "In Transit", "Delivered"];

function TrackingWidget() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<null | { id: string; stage: number }>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) return;
    // Deterministic mock: derive stage from ID hash so demo feels real
    const hash = [...trimmed].reduce((a, c) => a + c.charCodeAt(0), 0);
    const stage = hash % TRACK_STAGES.length;
    setResult({ id: trimmed, stage });
  };

  return (
    <div className="bg-white/5 backdrop-blur border border-white/15 p-5 sm:p-7">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter Tracking ID (e.g. VT-A9B7C2)"
          aria-label="Tracking ID"
          className="flex-1 bg-white/10 border border-white/20 px-4 py-3.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-accent"
        />
        <button type="submit" className="bg-accent text-white px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-primary transition-colors">
          Track →
        </button>
      </form>

      {result && (
        <div className="animate-entry">
          <div className="flex items-baseline justify-between mb-4">
            <div className="font-mono text-xs uppercase tracking-widest text-white/60">Shipment</div>
            <div className="font-mono text-sm font-bold text-accent">{result.id}</div>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2">
            {TRACK_STAGES.map((s, i) => {
              const done = i <= result.stage;
              const active = i === result.stage;
              return (
                <li key={s} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                  <div className={`size-8 rounded-full grid place-items-center text-xs font-bold shrink-0 ${done ? "bg-[color:var(--success)] text-white" : "bg-white/10 text-white/50"} ${active ? "ring-4 ring-accent/40 animate-pulse" : ""}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${done ? "text-white" : "text-white/50"}`}>{s}</div>
                    {active && <div className="text-[10px] font-mono uppercase text-accent">Current</div>}
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="text-[11px] font-mono uppercase tracking-widest text-white/50 mt-6">
            Need help? Call <a href="tel:9322662939" className="text-accent hover:underline">9322662939</a>
          </p>
        </div>
      )}
    </div>
  );
}

