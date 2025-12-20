// zod はTypescript向けスキーマバリデーションライブラリ
import { z } from 'zod'

export const workRecordSchema = z.object({
    user_id: z
        .string()
        .nonempty('user_id は必須です')
        .regex(/^[a-zA-Z0-9]+$/, 'user_id は英数字である必要があります'),
    clock_out_time: z
        .string()
        .nonempty('clock_out_time は必須です')
        .refine(
            (value) => !Number.isNaN(Date.parse(value)),
            'clock_out_time は ISO8601 形式である必要があります'
        ),
})