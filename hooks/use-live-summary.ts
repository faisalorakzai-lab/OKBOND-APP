import { useQuery } from "@tanstack/react-query";

import { readPolygonSummary } from "@/lib/polygon";

export function useLiveSummary() {
  return useQuery({
    queryKey: ["polygon-read-only-summary"],
    queryFn: readPolygonSummary,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
