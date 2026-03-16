import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { routeSearchSchema } from './validator'

const FALLBACK_ROUTE = `## 阪東橋駅 → 綱島駅

**推奨ルート（横浜市営地下鉄ブルーライン → 東急東横線）**

1. 阪東橋駅（横浜市営地下鉄ブルーライン）乗車
2. 横浜駅で下車
3. 東急東横線に乗り換え
4. 綱島駅で下車

- 所要時間: 約30〜35分
- 運賃: 約400〜500円`

export async function GET() {
    const origin = '阪東橋駅'
    const destination = '綱島駅'

    const validation = routeSearchSchema.safeParse({ origin, destination })
    if (!validation.success) {
        return Response.json({ error: validation.error.format() }, { status: 400 })
    }

    try {
        const useFake = process.env.E2E_FAKE_LLM === '1' || process.env.NODE_ENV === 'test'
        if (useFake) {
            return Response.json({
                route: '**E2Eテスト用ダミー経路** 阪東橋駅 → 綱島駅: 約30分',
                origin,
                destination,
                timestamp: new Date().toISOString(),
                fallback: true,
            })
        }

        const google = createGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
        })

        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            prompt: `${origin}から${destination}までの電車での経路を教えてください。乗り換え駅と路線名、所要時間の目安、運賃の目安を含めてマークダウン形式で簡潔に回答してください。`,
        })

        if (!text || typeof text !== 'string') {
            throw new Error('Invalid response from Gemini API')
        }

        return Response.json({
            route: text.trim(),
            origin,
            destination,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Route search failed:', error)

        return Response.json({
            route: FALLBACK_ROUTE,
            origin,
            destination,
            timestamp: new Date().toISOString(),
            fallback: true,
        })
    }
}
