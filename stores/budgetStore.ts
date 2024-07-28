import {
  getSummary,
  getYearHistoryData,
  getHistoryYears,
  getMonthHistoryData,
  getUserTransactions,
} from "@/actions/transactionActions";
import { BudgetSummary } from "@/components/Overview";
import { Budget, Category, Transaction } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { startOfMonth } from "date-fns";
import { getCategories, getCategorySummary } from "@/actions/categoryActions";
import { string, z } from "zod";
import { CategorySummary, HistoryData, HistoryYear, Period } from "@/types";
import _ from "lodash";

export type BudgetState = {
  historyYears: number[];
  yearHistoryData: HistoryData[];
  monthHistoryData: HistoryData[];
  categories: Category[];
  budget: Budget;
  budgetSummary: BudgetSummary;
  categorySummary: CategorySummary[];
  timeFrame: "month" | "year";
  period: Period;
  userBudgets: Budget[];
  userTransactions: Transaction[];
  date: DateRange; // Add date here
};

export type BudgetActions = {
  setBudget: (budget: Budget) => void;
  setCategories: () => void;
  setHistoryYears: ({ budgetId }: { budgetId: string }) => void;
  setBudgetSummary: ({
    budgetId,
    date,
  }: {
    budgetId: string;
    date?: DateRange;
  }) => void;
  setCategorySummary: ({
    budgetId,
    date,
  }: {
    budgetId: string;
    date?: DateRange;
  }) => void;
  setYearHistoryData: ({
    budgetId,
    year,
  }: {
    budgetId: string;
    year?: number;
  }) => void;
  setUserBudgets: ({ userId }: { userId: string }) => void;
  setUserTransactions: ({ budgetId, date }: { budgetId: string; date: DateRange }) => void;
  setMonthHistoryData: ({
    budgetId,
    year,
    month,
  }: {
    budgetId: string;
    year?: number;
    month?: number;
  }) => void;
  setTimeFrame: (timeFrame: "month" | "year") => void;
  setPeriod: (period: Period) => void;
};

export type BudgetStore = BudgetState & BudgetActions;

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budget: {} as Budget,
      budgetSummary: {} as BudgetSummary,
      categorySummary: [] as CategorySummary[],
      categories: [] as Category[],
      historyYears: [],
      yearHistoryData: [] as HistoryData[],
      monthHistoryData: [] as HistoryData[],
      timeFrame: "month",
      period: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      date: { from: startOfMonth(new Date()), to: new Date() }, // Initialize date
      userBudgets: [], // Initialize
      userTransactions: [], // Initialize

      setBudget: (budget: Budget) => {
        set(() => ({
          budget,
        }));
      },

      setDate: (date: DateRange) => { // Implement setDate
        set(() => ({
          date,
        }));
      },

      setPeriod: (period) => {
        set(() => ({
          period,
        }));
      },

      setTimeFrame: (timeFrame) => {
        set(() => ({
          timeFrame,
        }));
      },

      setHistoryYears: async ({ budgetId }: { budgetId: string }) => {
        const response = await getHistoryYears(budgetId);
        if (response.success && response.data) {
          set(() => ({
            historyYears: response.data,
          }));
        }
      },

      setYearHistoryData: async ({ budgetId, year = new Date().getFullYear() }: { budgetId: string; year?: number }) => {
        const response = await getYearHistoryData({ budgetId, year });
        if (response.success && response.data) {
          set(() => ({
            yearHistoryData: response.data as HistoryData[],
          }));
        }
      },

      setMonthHistoryData: async ({ budgetId, year = new Date().getFullYear(), month = new Date().getUTCMonth() }: { budgetId: string; year?: number; month?: number }) => {
        const response = await getMonthHistoryData({ budgetId, year, month });
        if (response.success && response.data) {
          set(() => ({
            monthHistoryData: response.data as HistoryData[],
          }));
        }
      },

      setCategories: async () => {
        const response = await getCategories();
        if (response.success && response.data) {
          set(() => ({
            categories: response.data as Category[],
          }));
        }
      },

      setBudgetSummary: async ({ budgetId, date = { from: startOfMonth(new Date()), to: new Date() } }: { budgetId: string; date?: DateRange }) => {
        const response = await getSummary({ budgetId, date });
        if (response.success && response.data) {
          const expense = response.data.find((item) => item.type === "expense")?._sum.amount ?? 0;
          const income = response.data.find((item) => item.type === "income")?._sum.amount ?? 0;
          set(() => ({
            budgetSummary: { expense, income },
          }));
        }
      },

      setCategorySummary: async ({ budgetId, date = { from: startOfMonth(new Date()), to: new Date() } }: { budgetId: string; date?: DateRange }) => {
        const response = await getCategorySummary({ budgetId, date });
        if (response.success && response.data) {
          set(() => ({
            categorySummary: response.data.map((item) => ({
              categoryId: item.categoryId,
              type: item.type,
              amount: item._sum.amount,
            })) as CategorySummary[],
          }));
        }
      },

      // Implement new actions
      setUserBudgets: async ({ userId }: { userId: string }) => {
        // Example API call to fetch user budgets
        const response = await fetch(`/api/budgets?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          set(() => ({
            userBudgets: data,
          }));
        }
      },

      /*****************SET USER TRANSACTIONS*************** */
      setUserTransactions: async ({
        budgetId,
        date = { from: startOfMonth(new Date()), to: new Date() },
      }) => {
        const response = await getUserTransactions({ budgetId, date });

        if (response && response.data) {
          const transactions = response.data;
          set(() => ({
            userTransactions: transactions,
          }));
        }
      },
    }),
    {
      name: "food-storage",
    }
  )
);
