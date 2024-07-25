import { Budget, Settings, Transaction, User } from "@prisma/client";

type HistoryYear = {
  year: number;
};

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

type BudgetExt = Budget & {
  transactions: Transaction[];
};

type UserExt = User & {
  budgets: BudgetExt[];
  settings: Settings;
};

type TransactionType = "income" | "expense";
type TimeFrame = "month" | "year";
type Period = {
  year: number;
  month: number;
};

type CategorySummary = {
  categoryId: string;
  type: string;
  amount: number;
};

type Category = {
  id: string;
  icon: string;
  name: string;
  type: string;
};
