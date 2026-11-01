import { useState } from "react";
import { loyaltyService } from "@/services/loyaltyService";
import { Award, Gift, Sparkles, X, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export function LoyaltyWidget() {
  const [open, setOpen] = useState(false);
  const account = loyaltyService.getAccount();
  const txs = loyaltyService.getTransactions();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-slate-900 text-slate-100 border-slate-700 dark:bg-slate-100 dark:text-slate-900";
      case "Gold":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium hover:bg-muted/80 transition-all shadow-xs"
        title="View DriveEase Loyalty Points & Rewards"
      >
        <Award size={14} className="text-amber-500" />
        <span className="font-semibold text-primary">{account.points}</span>
        <span className="text-[11px] text-muted-foreground">Pts</span>
        <span className={`text-[10px] rounded px-1.5 py-0.2 font-bold ${getTierColor(account.tier)}`}>
          {account.tier}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-amber-100 text-amber-700">
                <Gift size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">DriveEase Rewards & Loyalty</h3>
                <p className="text-xs text-muted-foreground">Earn ₹1 back in points for every ₹10 spent on rentals.</p>
              </div>
            </div>

            {/* Current Balance Card */}
            <div className="rounded-lg border bg-gradient-to-br from-amber-500/10 via-primary/5 to-transparent p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Available Rewards Balance</p>
                  <p className="text-3xl font-extrabold text-foreground mt-1">
                    {account.points} <span className="text-base font-normal text-muted-foreground">Points</span>
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    ≈ ₹{account.points} instant savings on your next booking
                  </p>
                </div>
                <div className={`rounded-md px-3 py-1 text-xs font-bold border ${getTierColor(account.tier)}`}>
                  {account.tier} Member
                </div>
              </div>

              {/* Tier Progress */}
              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Tier Progress</span>
                  <span>{account.lifetimeEarned} / 3,000 Lifetime Points</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${Math.min((account.lifetimeEarned / 3000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tier Benefits */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className={`rounded border p-2 ${account.tier === "Silver" ? "border-primary bg-primary/5" : "bg-card"}`}>
                <p className="font-bold">Silver</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Base Earning Rate (1 pt / ₹10)</p>
              </div>
              <div className={`rounded border p-2 ${account.tier === "Gold" ? "border-primary bg-primary/5" : "bg-card"}`}>
                <p className="font-bold text-amber-600">Gold (1,000 pts)</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">+10% Bonus Points on Bookings</p>
              </div>
              <div className={`rounded border p-2 ${account.tier === "Platinum" ? "border-primary bg-primary/5" : "bg-card"}`}>
                <p className="font-bold text-purple-600">Platinum (3,000 pts)</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">+20% Bonus Points & Priority Check-in</p>
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" />
                <span>Points Activity History</span>
              </h4>
              <div className="divide-y divide-border border rounded-md max-h-48 overflow-y-auto">
                {txs.map((t) => (
                  <div key={t.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {t.type === "Earned" ? (
                        <div className="p-1 rounded bg-emerald-100 text-emerald-700">
                          <ArrowDownLeft size={14} />
                        </div>
                      ) : (
                        <div className="p-1 rounded bg-rose-100 text-rose-700">
                          <ArrowUpRight size={14} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{t.description}</p>
                        <p className="text-[10px] text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${t.type === "Earned" ? "text-emerald-600" : "text-rose-600"}`}>
                      {t.type === "Earned" ? `+${t.points}` : `-${t.points}`} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn w-full text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
