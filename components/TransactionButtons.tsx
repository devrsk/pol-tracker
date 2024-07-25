"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { UserExt } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import _ from "lodash";
import NewTransactionDialog from "./NewTransactionDialog";
import { Category } from "@prisma/client";
import BudgetPicker from "./BudgetPicker";

interface Props {
  user: UserExt;
  categories: Category[];
}

const TransactionButtons = ({ user, categories }: Props) => {
  const budgets = user.budgets.map((budget) => budget.name);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  if (_.isEmpty(budgets)) return null;

  // console.log("TransactionButtons -selectedBudget", selectedBudget);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-xl">Budget : </span>
        <BudgetPicker budgets={user.budgets} user={user} />
      </div>

      <NewTransactionDialog
        trigger={
          <Button
            variant="outline"
            className="border-emerald-500 dark:bg-emerald-950 dark:text-white hover:dark:bg-emerald-700 hover:dark:text-white"
          >
            New Income
          </Button>
        }
        type="income"
        categories={categories.filter((category) => category.type === "income")}
        user={user}
      />

      <NewTransactionDialog
        trigger={
          <Button
            variant="outline"
            className="border-rose-500 dark:bg-rose-950 dark:text-white hover:dark:bg-rose-700 hover:dark:text-white"
          >
            New Expense
          </Button>
        }
        type="expense"
        categories={categories.filter(
          (category) => category.type === "expense"
        )}
        user={user}
      />
    </div>
  );
};

export default TransactionButtons;
