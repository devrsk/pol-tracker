"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateSettings = async ({
  userId,
  currency,
  budgetName,
}: {
  userId: string;
  currency: string;
  budgetName: string;
}) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        budgets: {
          create: {
            name: budgetName,
            currency: currency,  // Make sure to include all required fields
          },
        },
        settings: {
          upsert: {  // Use upsert to create if not exists, or update if exists
            where: { userId },
            update: { currency },
            create: { currency, userId },
          },
        },
      },
    });

    if (updatedUser) {
      revalidatePath("/");
      return {
        success: true,
        message: "Currency and budget updated successfully",
      };
    }

    return {
      success: false,
      error: "Unable to update currency or create budget, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, updating currency and budget",
    };
  }
};
