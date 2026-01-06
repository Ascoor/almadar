import { renderHook, waitFor } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  setLogger,
} from '@tanstack/react-query';
import { defaultQueryConfig } from '@/lib/queryClient';
import {
  getAdviceTypes,
  getLegalAdviceById,
  getLegalAdvices,
} from '@/services/api/legalAdvices';
import { legalAdviceKeys } from '../queryKeys';
import {
  useAdviceTypesQuery,
  useLegalAdviceQuery,
  useLegalAdvicesQuery,
} from '../useLegalAdvices';

jest.mock('@/services/api/legalAdvices');

setLogger({
  log: () => {},
  warn: () => {},
  error: () => {},
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: defaultQueryConfig,
  });
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
};

describe('legal advice hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('respects cache policy for list queries', async () => {
    getLegalAdvices.mockResolvedValue({ data: { data: [{ id: 1 }] } });

    const { wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useLegalAdvicesQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const state = queryClient.getQueryState(legalAdviceKeys.list());
    expect(state?.staleTime).toBe(2 * 60 * 1000);
    expect(state?.gcTime).toBe(30 * 60 * 1000);
    expect(result.current.data).toEqual([{ id: 1 }]);
  });

  it('handles errors from the list query', async () => {
    const error = new Error('Network');
    getLegalAdvices.mockRejectedValue(error);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLegalAdvicesQuery(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
  });

  it('applies detail cache policy and returns data', async () => {
    getLegalAdviceById.mockResolvedValue({ data: { id: 42 } });

    const { wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useLegalAdviceQuery(42), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const state = queryClient.getQueryState(legalAdviceKeys.detail(42));
    expect(state?.staleTime).toBe(5 * 60 * 1000);
    expect(state?.gcTime).toBe(30 * 60 * 1000);
    expect(result.current.data).toEqual({ id: 42 });
  });

  it('fetches advice types with the shared cache policy', async () => {
    getAdviceTypes.mockResolvedValue({ data: [{ id: 7 }] });

    const { wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useAdviceTypesQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const state = queryClient.getQueryState(legalAdviceKeys.adviceTypes());
    expect(state?.staleTime).toBe(2 * 60 * 1000);
    expect(state?.gcTime).toBe(30 * 60 * 1000);
    expect(result.current.data).toEqual([{ id: 7 }]);
  });
});
