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
          },
        },
        settings: {
          create: {
            currency,
          },
        },
      },
    });

    if (updatedUser) {
      revalidatePath("/");
      return {
        success: true,
        message: "Currency updated successfully",
      };
    }

    return {
      success: false,
      error: "Unable to update currency, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, updating currency",
    };
  }
};
