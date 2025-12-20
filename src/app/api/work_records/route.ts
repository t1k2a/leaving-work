import { NextApiRequest, NextApiResponse } from 'next';
import { workRecordSchema } from './validator'

export async function POST(request: Request) {
    const body = await request.json()
    // safeParseはzodが提供するスキーマに渡すbodyを引数にとってバリデーション結果とパース済みデータを返す
    const result = workRecordSchema.safeParse(body)

    if (!result.success) {
        console.log('Invalid User id')
        return Response.json({ error: result.error.format() }, { status: 400 })
    }

    const { user_id, clock_out_time } = result.data
}

