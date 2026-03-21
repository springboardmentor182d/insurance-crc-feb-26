import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFraudRule,
  deleteFraudRule,
  fetchFraudRules,
  updateFraudRule,
  toggleFraudRule
} from "../api/fraudRules";

export const useFraudRules = () => {
  const queryClient = useQueryClient();

  const rulesQuery = useQuery({
    queryKey: ["fraud-rules"],
    queryFn: fetchFraudRules
  });

  const createRule = useMutation({
    mutationFn: createFraudRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fraud-rules"] })
  });

  const updateRule = useMutation({
    mutationFn: updateFraudRule, // ✅ FIXED
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fraud-rules"] })
  });

  const deleteRule = useMutation({
    mutationFn: deleteFraudRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fraud-rules"] })
  });

  const toggleRule = useMutation({
    mutationFn: toggleFraudRule, // ✅ BETTER (use dedicated API)
    onMutate: async ({ id, is_active }) => {
      await queryClient.cancelQueries({ queryKey: ["fraud-rules"] });

      const previous = queryClient.getQueryData(["fraud-rules"]);

      if (previous) {
        queryClient.setQueryData(["fraud-rules"], {
          ...previous,
          rules: previous.rules.map((rule) =>
            rule.id === id ? { ...rule, is_active } : rule
          )
        });
      }

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["fraud-rules"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fraud-rules"] });
    }
  });

  return {
    ...rulesQuery,
    createRule,
    updateRule,
    deleteRule,
    toggleRule
  };
};