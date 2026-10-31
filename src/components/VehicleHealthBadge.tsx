import type { Vehicle } from "@/types";
import { evaluateVehicleHealth } from "@/services/maintenanceService";

interface Props {
  vehicle: Vehicle;
  detailed?: boolean;
}

export function VehicleHealthBadge({ vehicle, detailed = false }: Props) {
  const health = vehicle.health ?? evaluateVehicleHealth(vehicle);
  const kmSinceService = health.mileageKm - health.lastServiceKm;
  const isUnderMaint = health.maintenanceStatus === "Under Maintenance";
  const isDue = health.maintenanceStatus === "Service Due";

  if (!detailed) {
    if (isUnderMaint) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300">
          <span>🔧</span> Under Maintenance
        </span>
      );
    }
    if (isDue) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
          <span>⚠️</span> Service Due
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
        <span>✅</span> Health Certified
      </span>
    );
  }

  // Detailed view for VehicleDetailsPage
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Vehicle Health & Compliance</span>
          {isUnderMaint ? (
            <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
              Under Service Window
            </span>
          ) : isDue ? (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              Inspection Due Soon
            </span>
          ) : (
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              100% Road-Ready
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-mono">{health.mileageKm.toLocaleString()} KM</span>
      </div>

      {isUnderMaint && health.currentServiceWindow && (
        <div className="rounded border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          <div className="font-bold flex items-center gap-1 mb-1">
            <span>🔧 Active Workshop Service Window:</span>
            <span>{health.currentServiceWindow.serviceType}</span>
          </div>
          <p className="text-rose-800/90 dark:text-rose-300">
            From <b>{health.currentServiceWindow.startDate}</b> to <b>{health.currentServiceWindow.expectedEndDate}</b> at {health.currentServiceWindow.garageName}.
          </p>
          <p className="mt-1 font-semibold text-rose-700 dark:text-rose-400">
            🚫 Automated Lock: Vehicle bookings are prohibited during active service for passenger safety.
          </p>
        </div>
      )}

      {/* Health metrics grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded border p-2 bg-muted/20">
          <p className="text-muted-foreground text-[11px]">Oil Change Interval</p>
          <p className="font-medium mt-0.5">
            {kmSinceService} / {health.oilChangeIntervalKm} KM
          </p>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className={`h-full ${kmSinceService >= health.oilChangeIntervalKm ? "bg-rose-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min((kmSinceService / health.oilChangeIntervalKm) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded border p-2 bg-muted/20">
          <p className="text-muted-foreground text-[11px]">PUC Test Validity</p>
          <p className="font-medium mt-0.5">
            {health.pucExpiryDate >= "2026-10-31" ? (
              <span className="text-emerald-600 dark:text-emerald-400">Valid till {health.pucExpiryDate}</span>
            ) : (
              <span className="text-rose-600 font-bold">Expired on {health.pucExpiryDate}</span>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Govt RTO Emission Passed</p>
        </div>

        <div className="rounded border p-2 bg-muted/20">
          <p className="text-muted-foreground text-[11px]">Commercial Insurance</p>
          <p className="font-medium mt-0.5">
            {health.insuranceExpiryDate >= "2026-10-31" ? (
              <span className="text-emerald-600 dark:text-emerald-400">Valid till {health.insuranceExpiryDate}</span>
            ) : (
              <span className="text-rose-600 font-bold">Expired</span>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Comprehensive Cover</p>
        </div>

        <div className="rounded border p-2 bg-muted/20">
          <p className="text-muted-foreground text-[11px]">Next Periodic Checkup</p>
          <p className="font-medium mt-0.5 text-foreground">{health.nextServiceDueDate}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">40-point safety check</p>
        </div>
      </div>
    </div>
  );
}
