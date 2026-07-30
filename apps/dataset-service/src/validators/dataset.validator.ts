import * as z from 'zod';


export const createDatasetSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(3, 'Name must be at least 3 characters long')
            .max(100, 'Name must be at most 100 characters long'),

        description: z
            .string()
            .max(500, 'Description must be at most 500 characters long')
            .optional()
    })
});


export type createDatasetInput = z.infer<typeof createDatasetSchema>['body'];