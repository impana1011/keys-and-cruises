import { useRef } from "react";
import type { Booking, Vehicle } from "@/types";
import { Printer, X, Download, ShieldCheck, Car } from "lucide-react";
import { rentalDays } from "@/services/api";

interface InvoiceModalProps {
  booking: Booking;
  vehicle: Vehicle;
  onClose: () => void;
}

export function InvoiceModal({ booking, vehicle, onClose }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const days = Math.max(1, rentalDays(booking.pickupDate, booking.returnDate));

  // Compute breakdown numbers
  const invoiceNum = booking.invoiceNumber ?? `INV-2026-${booking.id}`;
  const invoiceDate = booking.createdDate ?? new Date().toISOString().slice(0, 10);
  const pickupCity = booking.pickupCity ?? "Bangalore";
  const dropCity = booking.dropCity ?? pickupCity;
  const intercityFee = booking.intercityFee ?? 0;
  const driverFee = booking.driverFee ?? (booking.withDriver ? days * 800 : 0);
  const loyaltyDiscount = booking.loyaltyDiscountAmount ?? 0;

  // Derive base + dynamic rental amount
  const baseRental = vehicle.pricePerDay * days;
  const totalPaid = booking.totalPrice;

  // Indian GST calculation (GST included in total: 18% standard motor vehicle hire GST)
  const taxableAmount = Math.round((totalPaid / 1.18) * 100) / 100;
  const totalGst = Math.round((totalPaid - taxableAmount) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl rounded-xl border bg-card p-6 shadow-2xl text-card-foreground my-8 print:border-none print:shadow-none print:p-0 print:my-0">
        {/* Actions bar - hidden during print */}
        <div className="flex items-center justify-between pb-4 border-b print:hidden mb-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 font-bold">
              ✓ PAID (TAX INVOICE)
            </span>
            <span className="text-xs text-muted-foreground font-mono">{invoiceNum}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn flex items-center gap-1.5 text-xs py-1.5 px-3"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Content */}
        <div ref={invoiceRef} className="space-y-4 text-xs font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Car className="text-primary" size={24} />
                <span className="text-xl font-black tracking-tight text-primary">DriveEase</span>
              </div>
              <p className="font-semibold text-foreground text-xs mt-1">DriveEase Mobility Services Pvt. Ltd.</p>
              <p className="text-muted-foreground text-[11px]">Outer Ring Road, Bellandur, Bangalore - 560103</p>
              <p className="text-muted-foreground text-[11px]">GSTIN: <span className="font-mono font-medium text-foreground">29AAACD1234F1Z5</span></p>
              <p className="text-muted-foreground text-[11px]">CIN: U63040KA2026PTC099881 | PAN: AAACD1234F</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-wider text-primary border border-primary px-2 py-0.5 rounded">
                TAX INVOICE
              </span>
              <p className="font-mono font-bold text-sm mt-2">{invoiceNum}</p>
              <p className="text-muted-foreground text-[11px]">Invoice Date: {invoiceDate}</p>
              <p className="text-muted-foreground text-[11px]">Place of Supply: {pickupCity}, India</p>
              <p className="text-muted-foreground text-[11px]">SAC Code: <span className="font-mono">996601</span> (Motor Vehicle Rental)</p>
            </div>
          </div>

          {/* Billed To & Rental Details */}
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded border text-[11px]">
            <div>
              <p className="font-bold text-muted-foreground uppercase text-[10px]">Billed To (Customer):</p>
              <p className="font-bold text-sm text-foreground mt-0.5">{booking.customer}</p>
              <p className="text-muted-foreground">Booking Ref: <span className="font-mono font-medium text-foreground">{booking.id}</span></p>
              <p className="text-muted-foreground">Contact: Verified Customer Account</p>
              <p className="text-muted-foreground">Payment Mode: Online / Prepaid (Demo)</p>
            </div>
            <div>
              <p className="font-bold text-muted-foreground uppercase text-[10px]">Rental Trip & Hub Details:</p>
              <p className="font-bold text-foreground mt-0.5">{vehicle.name} ({vehicle.category})</p>
              <p className="text-muted-foreground">
                Pickup Hub: <span className="font-medium text-foreground">{booking.pickupBranchName ?? pickupCity}</span> ({booking.pickupDate})
              </p>
              <p className="text-muted-foreground">
                Drop-off Hub: <span className="font-medium text-foreground">{booking.dropBranchName ?? dropCity}</span> ({booking.returnDate})
              </p>
              {booking.transitDistanceKm && booking.transitDistanceKm > 0 && (
                <p className="text-amber-700 dark:text-amber-300 font-medium">
                  One-Way Transit Distance: {booking.transitDistanceKm} KM
                </p>
              )}
              <p className="text-muted-foreground">Duration: <span className="font-medium text-foreground">{days} Days</span></p>
              {booking.withDriver && booking.driverDetails && (
                <p className="text-emerald-700 dark:text-emerald-300 font-medium mt-0.5">
                  ✓ Chauffeur: {booking.driverDetails.name} ({booking.driverDetails.badgeNumber})
                </p>
              )}
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full text-left border-collapse border rounded">
            <thead>
              <tr className="bg-muted text-[11px] font-semibold text-foreground border-b">
                <th className="p-2">Item Description</th>
                <th className="p-2 text-center">SAC Code</th>
                <th className="p-2 text-center">Duration / Qty</th>
                <th className="p-2 text-right">Rate (₹)</th>
                <th className="p-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[11px]">
              <tr>
                <td className="p-2">
                  <div className="font-semibold">{vehicle.name} Daily Vehicle Rental</div>
                  <div className="text-[10px] text-muted-foreground">
                    Includes comprehensive insurance, GPS tracking, and roadside assistance.
                  </div>
                </td>
                <td className="p-2 text-center font-mono text-[10px]">996601</td>
                <td className="p-2 text-center">{days} Days</td>
                <td className="p-2 text-right">₹{vehicle.pricePerDay}</td>
                <td className="p-2 text-right font-medium">₹{baseRental}</td>
              </tr>

              {intercityFee > 0 && (
                <tr>
                  <td className="p-2">
                    <div className="font-medium">Intercity Relocation Surcharge</div>
                    <div className="text-[10px] text-muted-foreground">
                      One-way drop from {pickupCity} to {dropCity}
                    </div>
                  </td>
                  <td className="p-2 text-center font-mono text-[10px]">996601</td>
                  <td className="p-2 text-center">1 Trip</td>
                  <td className="p-2 text-right">₹{intercityFee}</td>
                  <td className="p-2 text-right font-medium">₹{intercityFee}</td>
                </tr>
              )}

              {driverFee > 0 && (
                <tr>
                  <td className="p-2">
                    <div className="font-medium">Commercial Chauffeur / Driver Allowance</div>
                    <div className="text-[10px] text-muted-foreground">
                      Verified professional driver with passenger coverage ({days} days)
                    </div>
                  </td>
                  <td className="p-2 text-center font-mono text-[10px]">996602</td>
                  <td className="p-2 text-center">{days} Days</td>
                  <td className="p-2 text-right">₹{Math.round(driverFee / days)}</td>
                  <td className="p-2 text-right font-medium">₹{driverFee}</td>
                </tr>
              )}

              {loyaltyDiscount > 0 && (
                <tr className="text-emerald-700 dark:text-emerald-300">
                  <td className="p-2">
                    <div className="font-medium">DriveEase Rewards Points Redemption</div>
                    <div className="text-[10px] text-muted-foreground">
                      Redeemed {booking.loyaltyPointsRedeemed ?? loyaltyDiscount} loyalty points
                    </div>
                  </td>
                  <td className="p-2 text-center font-mono text-[10px]">-</td>
                  <td className="p-2 text-center">Discount</td>
                  <td className="p-2 text-right">-</td>
                  <td className="p-2 text-right font-bold">-₹{loyaltyDiscount}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Tax summary & Grand total */}
          <div className="flex justify-between items-start pt-2 border-t">
            <div className="space-y-1 text-[10px] text-muted-foreground max-w-xs">
              <p className="font-semibold text-foreground flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Terms & Fuel Policy Notice:</span>
              </p>
              <p>• Vehicle dispatched with 100% full tank under standard Full-to-Full policy.</p>
              <p>• GST 18% inclusive under Reverse Charge Mechanism / Forward Charge as applicable.</p>
              <p>• Computer generated tax invoice. No physical signature required.</p>
            </div>

            <div className="w-56 space-y-1 text-right text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxable Value:</span>
                <span className="font-mono">₹{taxableAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGST (9%):</span>
                <span className="font-mono">₹{cgst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SGST (9%):</span>
                <span className="font-mono">₹{sgst}</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-bold text-sm text-foreground">
                <span>Grand Total:</span>
                <span className="text-primary font-mono text-base">₹{totalPaid}</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Payment Status: Confirmed & Paid</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t flex justify-end print:hidden">
          <button type="button" onClick={onClose} className="btn-outline text-xs">
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
