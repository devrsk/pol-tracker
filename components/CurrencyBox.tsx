"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogTitle } from "./ui/dialog";
import { currencies, Currency } from "@/lib/currencies";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { BudgetSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { updateSettings } from "@/actions/currencyActions";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBudget } from "@/actions/budgetActions";
import { useBudgetStore } from "@/stores/budgetStore";

interface Props {
  user: User;
}

export function CurrencyBox({ user }: Props) {
  const { setBudget } = useBudgetStore((store) => store);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>({
    value: "LKR",
    label: "Rs Rupee",
    local: "en-US",
  });
  const form = useForm<z.infer<typeof BudgetSchema>>({
    resolver: zodResolver(BudgetSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof BudgetSchema>) => {
    if (!selectedOption) return toast.error("Please select currency");
    const data = {
      userId: user.id,
      budgetName: formData.name,
      currency: selectedOption.value,
    };
    startTransition(() => {
      createBudget({ ...data })
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

  if (isDesktop) {
    return (
      <div className="flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* budget name */}
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

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start w-full">
                  {selectedOption ? (
                    <>{selectedOption.label}</>
                  ) : (
                    <>+ Set currencies</>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <OptionList
                  setOpen={setOpen}
                  setSelectedOption={setSelectedOption}
                />
              </PopoverContent>
            </Popover>

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
                {selectedOption ? (
                  <>{selectedOption.label}</>
                ) : (
                  <>+ Set currency</>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-full">
              <DialogTitle>Currencies</DialogTitle>
              <div className="mt-4 border-t">
                <OptionList
                  setOpen={setOpen}
                  setSelectedOption={setSelectedOption}
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

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currencies..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                const selectedCurrency = currencies.find(
                  (priority) => priority.value === value
                );

                setSelectedOption(selectedCurrency || null);
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
