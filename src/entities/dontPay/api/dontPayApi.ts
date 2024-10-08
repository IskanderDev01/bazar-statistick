import { rtkApi } from '@/shared/api/rtkApi';
import { DontPayResponse } from '../model/types/dontPayTypes';

const dontPayApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        createDontPay: build.mutation<unknown, { number: string }>({
            query: ({ number }) => ({
                url: `exception-nums/?number=${number}`,
                method: 'POST',
            }),
            invalidatesTags: ['car'],
        }),
        getDontPayCars: build.query<DontPayResponse[], void>({
            query: () => ({
                url: 'exception-nums/',
                method: 'GET',
            }),
            providesTags: ['car'],
        }),
        deleteDontPay: build.mutation<unknown, string>({
            query: (number) => ({
                url: `exception-nums/${number}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['car'],
        }),
    }),
});

export const useCreateDontPay = dontPayApi.useCreateDontPayMutation;
export const useGetDontPayCars = dontPayApi.useGetDontPayCarsQuery;
export const useDeleteDontPay = dontPayApi.useDeleteDontPayMutation;
