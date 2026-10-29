import { useState } from "react";
import { AdminNav, Page, StatusBadge } from "@/components/Layout";
import { bookingService, vehicleService } from "@/services/api";
import type { Booking, Category, Vehicle } from "@/types";

export function AdminDashboard() {
  const v = vehicleService.getAll();
  const b = bookingService.getAll();
  const stats = [
    ["Total vehicles", v.length], ["Available", v.filter((x) => x.available).length],
    ["Total bookings", b.length], ["Revenue (mock)", "$" + b.filter((x) => x.status !== "Cancelled").reduce((s, x) => s + x.totalPrice, 0)],
  ];
  return (
    <Page title="Admin Dashboard">
      <AdminNav />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map(([k, val]) => <div key={k} className="rounded border p-4"><p className="text-sm text-muted-foreground">{k}</p><p className="text-2xl font-bold">{val}</p></div>)}
      </div>
    </Page>
  );
}

const empty: Vehicle = { id: "", name: "", category: "Car", pricePerDay: 0, seats: 5, fuel: "Petrol", transmission: "Manual", location: "", available: true };

export function AdminVehicles() {
  const [list, setList] = useState(vehicleService.getAll());
  const [form, setForm] = useState<Vehicle>(empty);
  const [msg, setMsg] = useState("");
  const refresh = () => setList(vehicleService.getAll());
  return (
    <Page title="Manage Vehicles">
      <AdminNav />
      <form className="mb-6 grid gap-2 rounded border p-4 sm:grid-cols-3" onSubmit={(e) => {
        e.preventDefault();
        if (!form.name || !form.location || form.pricePerDay <= 0) return setMsg("Name, location and price are required.");
        vehicleService.save({ ...form, id: form.id || String(Date.now()) });
        setMsg(`Vehicle ${form.id ? "updated" : "added"} (simulated, in-memory only).`);
        setForm(empty); refresh();
      }}>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
          <option>Car</option><option>SUV</option><option>Bike</option>
        </select>
        <input className="input" type="number" placeholder="Price/day" value={form.pricePerDay || ""} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} />
        <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Available</label>
        <div className="flex gap-2">
          <button className="btn">{form.id ? "Update" : "Add"} Vehicle</button>
          {form.id && <button type="button" className="btn-outline" onClick={() => setForm(empty)}>Cancel</button>}
        </div>
        {msg && <p className="text-sm sm:col-span-3">{msg}</p>}
      </form>
      <table className="table">
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Location</th><th>Available</th><th>Actions</th></tr></thead>
        <tbody>{list.map((v) => (
          <tr key={v.id}><td>{v.name}</td><td>{v.category}</td><td>${v.pricePerDay}</td><td>{v.location}</td><td>{v.available ? "Yes" : "No"}</td>
            <td className="space-x-2">
              <button className="btn-outline" onClick={() => setForm(v)}>Edit</button>
              <button className="btn-outline" onClick={() => { if (confirm("Delete vehicle? (simulated)")) { vehicleService.remove(v.id); refresh(); setMsg("Vehicle deleted (simulated)."); } }}>Delete</button>
            </td></tr>
        ))}</tbody>
      </table>
    </Page>
  );
}

export function AdminBookings() {
  const [list, setList] = useState(bookingService.getAll());
  const update = (id: string, s: Booking["status"]) => { bookingService.setStatus(id, s); setList(bookingService.getAll()); };
  return (
    <Page title="Manage Bookings">
      <AdminNav />
      <p className="mb-2 text-sm text-muted-foreground">Status changes are simulated (in-memory only).</p>
      <table className="table">
        <thead><tr><th>ID</th><th>Customer</th><th>Vehicle</th><th>Dates</th><th>Total</th><th>Status</th><th>Change</th></tr></thead>
        <tbody>{list.map((b) => (
          <tr key={b.id}><td>{b.id}</td><td>{b.customer}</td><td>{vehicleService.getById(b.vehicleId)?.name ?? "-"}</td><td>{b.pickupDate} → {b.returnDate}</td><td>${b.totalPrice}</td><td><StatusBadge s={b.status} /></td>
            <td><select className="input" value={b.status} onChange={(e) => update(b.id, e.target.value as Booking["status"])}>
              {["Pending", "Confirmed", "Completed", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
            </select></td></tr>
        ))}</tbody>
      </table>
    </Page>
  );
}
