import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  loadIngredientData,
  DataOptions,
  DATA_FETCH_STATUS,
} from "../slices/ingredientsSlice";

/**
 *
 * @example
 * const required = useMemo(() => ['measurementUnits', 'ingredients'], []);
 * const {loading, ready, error, missing} = useEnsureIngredientData(required);
 */
export function useEnsureIngredientData(required: DataOptions[] = []) {
  const dispatch = useAppDispatch();
  const statuses = useAppSelector((s) => s.ingredients.statuses);
  const errors = useAppSelector((s) => s.ingredients.errors);

  // `required` must be stable (memoized by the caller) so this useMemo can be effective.
  const missing = useMemo(() => {
    return required.filter((key) => {
      return (
        statuses[key] !== DATA_FETCH_STATUS.loading &&
        statuses[key] !== DATA_FETCH_STATUS.succeeded
      );
    });
  }, [required, statuses]);

  useEffect(() => {
    if (missing.length > 0) {
      dispatch(loadIngredientData({ requiredData: missing }));
    }
  }, [dispatch, missing]);

  const anyLoading = required.some(
    (k) => statuses[k] === DATA_FETCH_STATUS.loading,
  );
  const allSucceeded = required.every(
    (k) => statuses[k] === DATA_FETCH_STATUS.succeeded,
  );
  const anyFailed = required.some(
    (k) => statuses[k] === DATA_FETCH_STATUS.failed,
  );

  return {
    loading: anyLoading || (!allSucceeded && missing.length > 0),
    ready: allSucceeded,
    error: anyFailed ? errors : null,
    missing, // optional: useful for UIs or retry logic
  };
}
