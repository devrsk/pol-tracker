"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/******************CREATE BUDGET********************************** */
export const createBudget = async ({
  budgetName,
  userId,
  currency,
}: {
  budgetName: string;
  userId: string;
  currency: string;
}) => {
  console.log("creteBudget server", budgetName, userId, currency);
  try {
    const newBudget = await prisma.budget.create({
      data: {
        name: budgetName,
        userId,
        currency,
      },
    });

    if (newBudget) {
      revalidatePath("/");
      return {
        success: true,
        message: "Budget created successfully",
        data: newBudget,
      };
    }

    return {
      success: false,
      error: "Unable to create budget, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      error: "Internal Server Error, creating budget",
    };
  }
};
