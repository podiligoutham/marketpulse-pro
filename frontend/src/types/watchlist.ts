export type AddStockResult =
  | { success: true }
  | { success: false; error: string };