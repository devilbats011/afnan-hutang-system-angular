export interface HutangForm {
  id: any,
  status: "active" | "paid" | "cancelled",
  pemberiHutang: any,
  penerimaHutang: any,
  hutangAmount: any,
  description: any,
  location: any,
  date: any,
  jsonDate: jsonDate,
  createdBy: any,
  updatedBy: any,
  createdAt: any,
  updatedAt: any,
  jsonDateCreatedAt: jsonDate
}

export interface jsonDate { year: number, month: number, day: number, timezone?: number | null }

export interface HutangFormExtends extends HutangForm { isEditOpen?: boolean }

export type PartialHutangForm = Partial<HutangForm> | Partial<HutangFormExtends> | undefined | null;
