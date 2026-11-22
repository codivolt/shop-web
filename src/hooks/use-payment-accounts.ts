"use client";

import { useQuery } from "@tanstack/react-query";

import { http } from "@/lib/api/client";
import type { PaymentAccount } from "@/lib/types";

export function usePaymentAccounts() {
  return useQuery<PaymentAccount[]>({
    queryKey: ["payment-accounts"],
    queryFn: async () => {
      const { data } = await http.get<PaymentAccount[]>(
        "/payment-accounts/active",
      );
      return data;
    },
  });
}
