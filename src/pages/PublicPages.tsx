import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookingSummary, Page, StatusBadge, VehicleCard } from "@/components/Layout";
import { authService, bookingService, rentalDays, validateDates, vehicleService } from "@/services/api";
import type { Vehicle } from "@/types";

export function HomePage() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  return (
    <main className="mx-auto max-w-6xl p-4">
      <section className="my-8">
        <h1 className="text-3xl font-bold">Rent cars and bikes with DriveEase</h1>
        <p className="text-muted-foreground">Simple, affordable vehicle rentals.</p>
        <form className="mt-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); nav({ to: "/vehicles", search: { q, category: cat } }); }}>
          <input className="input" placeholder="Search name or city" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
            {["All", "Car", "SUV", "Bike"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <button className="btn">Search</button>
        </form>
      </section>
      <h2 className="mb-3 text-xl font-semibold">Featured Vehicles</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {vehicleService.getAll().slice(0, 3).map((v) => <VehicleCard key={v.id} v={v} />)}
      </div>
    </main>
  );
}

export function VehiclesPage({ q: q0 = "", category: c0 = "All" }: { q?: string; category?: string }) {
  const [q, setQ] = useState(q0);
  const [cat, setCat] = useState(c0);
  const list = vehicleService.getAll().filter((v) =>
    (cat === "All" || v.category === cat) && (v.name + " " + v.location).toLowerCase().includes(q.toLowerCase()));
  return (
    <Page title="Vehicles">
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
          {["All", "Car", "SUV", "Bike"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="btn-outline" onClick={() => { setQ(""); setCat("All"); }}>Clear</button>
      </div>
      {list.length === 0 && <p>No vehicles match your search.</p>}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{list.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
    </Page>
  );
}

function DateFields({ pickup, ret, setPickup, setRet }: { pickup: string; ret: string; setPickup: (s: string) => void; setRet: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <label className="text-sm">Pickup<br /><input type="date" className="input" value={pickup} onChange={(e) => setPickup(e.target.value)} /></label>
      <label className="text-sm">Return<br /><input type="date" className="input" value={ret} onChange={(e) => setRet(e.target.value)} /></label>
    </div>
  );
}

export function VehicleDetailsPage({ v }: { v: Vehicle }) {
  const nav = useNavigate();
  const [pickup, setPickup] = useState("");
  const [ret, setRet] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const days = pickup && ret ? rentalDays(pickup, ret) : 0;
  return (
    <Page title={v.name}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-4 flex h-48 items-center justify-center rounded bg-muted text-muted-foreground">{v.category} image</div>
          <table className="table"><tbody>
            {[["Category", v.category], ["Seats", v.seats], ["Fuel", v.fuel], ["Transmission", v.transmission], ["Location", v.location], ["Available", v.available ? "Yes" : "No"]].map(([k, val]) => (
              <tr key={k as string}><td className="font-medium">{k}</td><td>{val}</td></tr>
            ))}
          </tbody></table>
        </div>
        <div className="space-y-3">
          <p className="text-xl font-semibold">${v.pricePerDay} / day</p>
          <DateFields pickup={pickup} ret={ret} setPickup={setPickup} setRet={setRet} />
          {days > 0 && <p>Estimated: {days} days × ${v.pricePerDay} = ${days * v.pricePerDay}</p>}
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button className="btn" disabled={!v.available} onClick={() => {
            const e = validateDates(pickup, ret); setErr(e);
            if (!e) nav({ to: "/booking/$vehicleId", params: { vehicleId: v.id }, search: { pickup, ret } });
          }}>{v.available ? "Book Now" : "Unavailable"}</button>
        </div>
      </div>
    </Page>
  );
}

export function BookingPage({ v, pickup: p0 = "", ret: r0 = "" }: { v: Vehicle; pickup?: string; ret?: string }) {
  const nav = useNavigate();
  const [pickup, setPickup] = useState(p0);
  const [ret, setRet] = useState(r0);
  const [err, setErr] = useState<string | null>(null);
  return (
    <Page title="Confirm Booking">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <DateFields pickup={pickup} ret={ret} setPickup={setPickup} setRet={setRet} />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <p className="text-sm text-muted-foreground">Note: booking is simulated and stored only in memory.</p>
          <button className="btn" onClick={() => {
            const e = validateDates(pickup, ret); setErr(e);
            if (e) return;
            const b = bookingService.create({ vehicleId: v.id, customer: "Demo User", pickupDate: pickup, returnDate: ret, totalPrice: rentalDays(pickup, ret) * v.pricePerDay });
            nav({ to: "/booking-confirmation/$id", params: { id: b.id } });
          }}>Confirm Booking</button>
        </div>
        <BookingSummary v={v} pickup={pickup} ret={ret} />
      </div>
    </Page>
  );
}

export function ConfirmationPage({ id }: { id: string }) {
  const b = bookingService.getById(id);
  const v = b && vehicleService.getById(b.vehicleId);
  return (
    <Page title="Booking Confirmed (Demo)">
      {b && v ? (
        <div className="space-y-2">
          <p>Booking ID: <b>{b.id}</b></p>
          <BookingSummary v={v} pickup={b.pickupDate} ret={b.returnDate} />
          <p className="text-sm text-muted-foreground">This is a simulated booking. No real reservation or payment was processed.</p>
        </div>
      ) : <p>Booking not found (demo data resets on page reload).</p>}
      <div className="mt-4 flex gap-2"><Link to="/my-bookings" className="btn">My Bookings</Link><Link to="/vehicles" className="btn-outline">Browse more</Link></div>
    </Page>
  );
}

export function MyBookingsPage() {
  const [, force] = useState(0);
  const list = bookingService.getAll().filter((b) => b.customer === "Demo User");
  return (
    <Page title="My Bookings">
      <table className="table">
        <thead><tr><th>ID</th><th>Vehicle</th><th>Dates</th><th>Total</th><th>Status</th><th></th></tr></thead>
        <tbody>{list.map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td><td>{vehicleService.getById(b.vehicleId)?.name}</td><td>{b.pickupDate} → {b.returnDate}</td><td>${b.totalPrice}</td><td><StatusBadge s={b.status} /></td>
            <td>{(b.status === "Confirmed" || b.status === "Pending") && <button className="btn-outline" onClick={() => { bookingService.setStatus(b.id, "Cancelled"); force((n) => n + 1); alert("Cancellation simulated (no backend)."); }}>Cancel</button>}</td>
          </tr>
        ))}</tbody>
      </table>
    </Page>
  );
}

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <Page title={mode === "login" ? "Login" : "Register"}>
      <form className="max-w-sm space-y-3" onSubmit={(e) => {
        e.preventDefault();
        if (!f.email.includes("@") || f.password.length < 6 || (mode === "register" && !f.name)) return setMsg("Please fill all fields (valid email, password 6+ chars).");
        setMsg(mode === "login" ? authService.login(f.email).message : authService.register(f.name).message);
      }}>
        {mode === "register" && <input className="input w-full" placeholder="Full name" value={f.name} onChange={set("name")} />}
        <input className="input w-full" placeholder="Email" value={f.email} onChange={set("email")} />
        <input className="input w-full" type="password" placeholder="Password" value={f.password} onChange={set("password")} />
        <button className="btn w-full">{mode === "login" ? "Login" : "Create account"}</button>
        {msg && <p className="text-sm">{msg}</p>}
        <p className="text-sm">{mode === "login" ? <Link to="/register" className="text-primary">Need an account? Register</Link> : <Link to="/login" className="text-primary">Have an account? Login</Link>}</p>
      </form>
    </Page>
  );
}
