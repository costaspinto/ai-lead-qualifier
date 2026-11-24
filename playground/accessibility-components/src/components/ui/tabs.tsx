// shadcn/ui-style Tabs built on Radix UI. Generated-source study copy.
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List className={cn("inline-flex h-10 items-center rounded-lg bg-slate-100 p-1", className)} {...props} />
);
export const TabsTrigger = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger className={cn("rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm", className)} {...props} />
);
export const TabsContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={cn("mt-3 rounded-lg border border-slate-200 p-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-500", className)} {...props} />
);