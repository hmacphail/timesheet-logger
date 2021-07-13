export enum WeeklyDiscountTiers {
  Zero = 0,
  One = 5,
  Two = 9,
  Three = 12,
  Four = 15,
  Five = 18,
  // Six = 21,
  // Seven = 25,
  // Eight = 30,
  // Nine = 40
}

export const RentDiscount: Record<number, number> = {
  [WeeklyDiscountTiers.Zero]: 0,
  [WeeklyDiscountTiers.One]: 75,
  [WeeklyDiscountTiers.Two]: 150,
  [WeeklyDiscountTiers.Three]: 225,
  [WeeklyDiscountTiers.Four]: 300,
  [WeeklyDiscountTiers.Five]: 375,
  // [WeeklyDiscountTiers.Six]: 450,
  // [WeeklyDiscountTiers.Seven]: 525,
  // [WeeklyDiscountTiers.Eight]: 600,
  // [WeeklyDiscountTiers.Nine]: 675
};

export const DefaultRent = 675;
