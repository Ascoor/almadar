import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  addDemoComment,
  demoQueryKeys,
  fetchDemoComments,
  fetchDemoEntity,
} from '../api/mockEntityClient';

type StatusMap = Record<string, string>;

export type DemoApiError = { status?: number; message: string };

export const isDemoApiError = (error: unknown): error is DemoApiError =>
  typeof error === 'object' && error !== null && 'message' in error;

const statusBadge: StatusMap = {
  open: 'مفتوح',
  'in-progress': 'تحت المعالجة',
  closed: 'مغلق',
};

export const useDemoEntityQuery = (
  entityId: string,
  options?: UseQueryOptions<any, DemoApiError>,
) =>
  useQuery({
    queryKey: demoQueryKeys.entity(entityId),
    queryFn: () => fetchDemoEntity(entityId),
    enabled: Boolean(entityId),
    select: (entity) => ({
      ...entity,
      translatedStatus: statusBadge[entity.status],
    }),
    ...options,
  });

export const useDemoCommentsQuery = (
  entityId: string,
  options?: UseQueryOptions<any, DemoApiError>,
) =>
  useQuery({
    queryKey: demoQueryKeys.comments(entityId),
    queryFn: () => fetchDemoComments(entityId),
    enabled: Boolean(entityId),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });

export const useAddDemoComment = (
  entityId: string,
  options?: UseMutationOptions<
    any,
    DemoApiError,
    { body: string; author: string },
    {
      previousComments?: any[];
      previousEntity?: any;
      optimisticId: string;
    }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => addDemoComment(entityId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: demoQueryKeys.comments(entityId) });
      const previousComments = queryClient.getQueryData(
        demoQueryKeys.comments(entityId),
      ) as any[] | undefined;
      const previousEntity = queryClient.getQueryData(
        demoQueryKeys.entity(entityId),
      ) as any | undefined;

      const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;

      const optimistic = {
        id: optimisticId,
        body: payload.body,
        author: payload.author,
        createdAt: new Date().toISOString(),
        pending: true,
      };

      queryClient.setQueryData(demoQueryKeys.comments(entityId), (existing = []) => [
        optimistic,
        ...existing,
      ]);

      queryClient.setQueryData(demoQueryKeys.entity(entityId), (previousEntity: any) =>
        previousEntity
          ? {
              ...previousEntity,
              lastUpdated: new Date().toISOString(),
              commentCount: (previousEntity.commentCount ?? 0) + 1,
            }
          : previousEntity,
      );

      return { previousComments, previousEntity, optimisticId };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          demoQueryKeys.comments(entityId),
          context.previousComments,
        );
      }

      if (context?.previousEntity) {
        queryClient.setQueryData(
          demoQueryKeys.entity(entityId),
          context.previousEntity,
        );
      }
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData(demoQueryKeys.comments(entityId), (existing = []) => {
        const optimisticId = context?.optimisticId;
        const comments = Array.isArray(existing) ? [...existing] : [];

        if (optimisticId) {
          const index = comments.findIndex(
            (comment: any) => String(comment.id) === String(optimisticId),
          );

          if (index !== -1) {
            comments[index] = data;
            return comments;
          }

          const withoutMatching = comments.filter(
            (comment: any) => String(comment.id) !== String(optimisticId),
          );
          return [data, ...withoutMatching];
        }

        return [data, ...comments];
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: demoQueryKeys.entity(entityId) });
      queryClient.invalidateQueries({ queryKey: demoQueryKeys.comments(entityId) });
    },
    ...options,
  });
};
