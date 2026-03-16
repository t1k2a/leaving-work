import { z } from 'zod'

export const routeSearchSchema = z.object({
    origin: z
        .string()
        .nonempty('origin は必須です')
        .max(100, 'origin は100文字以内である必要があります'),
    destination: z
        .string()
        .nonempty('destination は必須です')
        .max(100, 'destination は100文字以内である必要があります'),
})

export type RouteSearchInput = z.infer<typeof routeSearchSchema>
