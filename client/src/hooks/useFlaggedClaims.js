import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearClaim,
  confirmFraud,
  fetchFlaggedClaims,
  fetchFlaggedClaimsStats
} from "../api/flaggedClaims";

export const useFlaggedClaims = (params) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["flagged-claims", params],
    queryFn: () =>
      fetchFlaggedClaims({
        status: params.status,
        search: params.search,
        page: params.page,
        page_size: params.pageSize
      })
  });

  const statsQuery = useQuery({
    queryKey: ["flagged-claims-stats"],
    queryFn: fetchFlaggedClaimsStats
  });

  const confirmMutation = useMutation({
    mutationFn: confirmFraud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flagged-claims"] });
      queryClient.invalidateQueries({ queryKey: ["flagged-claims-stats"] });
    }
  });

  const clearMutation = useMutation({
    mutationFn: clearClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flagged-claims"] });
      queryClient.invalidateQueries({ queryKey: ["flagged-claims-stats"] });
    }
  });

  const optimisticRemove = (claimId) => {
    queryClient.setQueryData(["flagged-claims", params], (current) =>
      current
        ? {
            ...current,
            items: current.items.filter((claim) => claim.claim_id !== claimId)
          }
        : current
    );
  };

  return {
    listQuery,
    statsQuery,
    confirmMutation,
    clearMutation,
    optimisticRemove
  };
};
