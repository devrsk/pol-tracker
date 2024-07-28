// types.d.ts

// Prisma-generated types
import { Budget, Settings, Transaction, User } from "@prisma/client";

// Extending Prisma types
export type BudgetExt = Budget & {
  transactions: Transaction[];
};

export type UserExt = User & {
  budgets: BudgetExt[];
  settings: Settings;
};

// Define TransactionColumnsType if it is different from TransactionType
export type TransactionColumnsType = {
  id: string;
  categoryName: string;
  description: string;
  date: string; // Formatted date as a string
  type: "income" | "expense";
  amount: string; // Formatted price as a string
};

export type TransactionType = "income" | "expense";
export type TimeFrame = "month" | "year";
export type Period = {
  year: number;
  month: number;
};

export type CategorySummary = {
  categoryId: string;
  type: string;
  amount: number;
};

export type Category = {
  id: string;
  icon: string;
  name: string;
  type: string;
};

// Currency type
export type Currency = {
  code: string;
  name: string;
};

// History types
export type HistoryYear = {
  year: number;
};

export type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};
