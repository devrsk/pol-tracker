"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DialogTitle } from "./ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { BudgetSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useBudgetStore } from "@/stores/budgetStore";
import CurrencyPicker from "./CurrencyPicker";
import { Currency } from "@/types";
import { User } from "@prisma/client";
import { createBudget } from "@/actions/budgetActions";

interface Props {
  user: User;
}

export function CurrencyBox({ user }: Props) {
  const { setBudget } = useBudgetStore((store) => store);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Ensure useMediaQuery is correctly imported
  const [currency, setCurrency] = React.useState<Currency | undefined>();
  const [currencyCode, setCurrencyCode] = React.useState<string>("");

  const form = useForm<z.infer<typeof BudgetSchema>>({
    resolver: zodResolver(BudgetSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof BudgetSchema>) => {
    if (!currency) return toast.error("Please select currency");
    const data = {
      userId: user.id,
      budgetName: formData.name,
      currency: currency.code,
    };
    startTransition(() => {
      createBudget(data)
        .then((res) => {
          if (res.success && res.data) {
            router.push("/");
            setBudget(res.data);
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch(() => {
          return toast.error("Internal Server Error");
        })
        .finally(() => {
          form.reset();
        });
    });
  };

  React.useEffect(() => {
    if (currency) {
      setCurrencyCode(currency.code);
    }
  }, [currency]);

  if (isDesktop) {
    return (
      <div className="flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CurrencyPicker
              currencyCode={currencyCode}
              onCurrencyChange={setCurrency}
            />

            <Button type="submit" className="mt-4" disabled={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {currency ? <>{currency.name}</> : <>+ Set currency</>}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-full">
              <DialogTitle>Currencies</DialogTitle>
              <div className="mt-4 border-t">
                <CurrencyPicker
                  currencyCode={currencyCode}
                  onCurrencyChange={setCurrency}
                />
              </div>
            </DrawerContent>
          </Drawer>

          <Button type="submit" className="mt-4" disabled={isPending}>
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
