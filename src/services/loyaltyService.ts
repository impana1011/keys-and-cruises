import type { LoyaltyAccount, LoyaltyTier, LoyaltyTransaction } from "@/types";

let userAccount: LoyaltyAccount = {
  userId: "Demo User",
  points: 650, // ₹650 worth of rewards points
  tier: "Silver",
  lifetimeEarned: 1450,
};

let transactionLogs: LoyaltyTransaction[] = [
  {
    id: "TX-901",
    date: "2026-10-10",
    points: 80,
    type: "Earned",
    description: "Points earned on Booking #B1002 (Honda Activa)",
    bookingId: "B1002",
  },
  {
    id: "TX-890",
    date: "2026-09-15",
    points: 360,
    type: "Earned",
    description: "Points earned on Booking #B980 (Swift 3-Day Rental)",
  },
  {
    id: "TX-850",
    date: "2026-08-20",
    points: 200,
    type: "Redeemed",
    description: "Points redeemed for instant discount on car rental",
  },
  {
    id: "TX-800",
    date: "2026-08-01",
    points: 500,
    type: "Earned",
    description: "Welcome Joining Bonus Points",
  },
];

function updateTier(account: LoyaltyAccount): LoyaltyTier {
  if (account.lifetimeEarned >= 3000) return "Platinum";
  if (account.lifetimeEarned >= 1000) return "Gold";
  return "Silver";
}

export const loyaltyService = {
  getAccount: (): LoyaltyAccount => ({ ...userAccount }),

  getTransactions: (): LoyaltyTransaction[] => [...transactionLogs],

  /**
   * Calculates points earned on a rental payment.
   * Standard: 1 pt per ₹10.
   * Gold: +10% bonus.
   * Platinum: +20% bonus.
   */
  calculatePointsToEarn: (amountInRupees: number): number => {
    let base = Math.floor(amountInRupees / 10);
    if (userAccount.tier === "Gold") base = Math.floor(base * 1.1);
    if (userAccount.tier === "Platinum") base = Math.floor(base * 1.2);
    return Math.max(10, base);
  },

  /**
   * Redeem points for immediate rupee discount (1 point = ₹1)
   */
  redeemPoints: (pointsToRedeem: number, bookingId?: string): { success: boolean; discountAmount: number } => {
    if (pointsToRedeem <= 0) return { success: false, discountAmount: 0 };
    if (pointsToRedeem > userAccount.points) {
      pointsToRedeem = userAccount.points;
    }

    const discountAmount = pointsToRedeem; // 1:1 ratio in INR
    userAccount = {
      ...userAccount,
      points: userAccount.points - pointsToRedeem,
    };

    transactionLogs = [
      {
        id: "TX-" + (Date.now() % 10000),
        date: new Date().toISOString().slice(0, 10),
        points: pointsToRedeem,
        type: "Redeemed",
        description: `Redeemed ${pointsToRedeem} points for ₹${discountAmount} rental discount`,
        bookingId,
      },
      ...transactionLogs,
    ];

    return { success: true, discountAmount };
  },

  /**
   * Award points on completed or confirmed booking
   */
  awardPoints: (amountInRupees: number, bookingId: string): number => {
    const earned = loyaltyService.calculatePointsToEarn(amountInRupees);
    userAccount = {
      ...userAccount,
      points: userAccount.points + earned,
      lifetimeEarned: userAccount.lifetimeEarned + earned,
    };
    userAccount.tier = updateTier(userAccount);

    transactionLogs = [
      {
        id: "TX-" + (Date.now() % 10000),
        date: new Date().toISOString().slice(0, 10),
        points: earned,
        type: "Earned",
        description: `Points earned on booking #${bookingId}`,
        bookingId,
      },
      ...transactionLogs,
    ];

    return earned;
  },
};
