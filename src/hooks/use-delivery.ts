"use client";

import { useQuery } from "@tanstack/react-query";

import { http } from "@/lib/api/client";
import type { DeliveryMethod } from "@/lib/types";

export function useDeliveryMethods() {
  return useQuery<DeliveryMethod[]>({
    queryKey: ["delivery-methods"],
    queryFn: async () => {
      const { data } = await http.get<DeliveryMethod[]>("/delivery/active");
      return data;
    },
  });
}
