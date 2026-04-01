import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage, MessageRole } from '../models/ChatMessage.model.js';
import { Product } from '../models/Product.model.js';
import { Recipe } from '../models/Recipe.model.js';

// ─── Anthropic Client ──────────────────────────────────────────
const anthropic = new Anthropic({
    authToken: process.env.ANTHROPIC_AUTH_TOKEN,
});

// ─── System Prompt Builder ─────────────────────────────────────
async function buildSystemPrompt(cartItems?: any[]) {
    // Fetch a few products for context (top 30 active)
    const products = await Product.find({ isActive: true, stockQuantity: { $gt: 0 } })
        .sort({ viewCount: -1 })
        .limit(30)
        .select('name price unit category tags');

    // Fetch recipe names for context
    const recipes = await Recipe.find({ isActive: true })
        .limit(20)
        .select('name tags');

    const productList = products
        .map((p) => `• ${p.name} (${p.price.toLocaleString('vi-VN')}đ/${p.unit})`)
        .join('\n');

    const recipeList = recipes.map((r) => `• ${r.name}`).join('\n');

    const cartContext =
        cartItems && cartItems.length > 0
            ? `\nGiỏ hàng hiện tại của người dùng:\n${cartItems.map((i) => `• ${i.name} x${i.quantity}`).join('\n')}`
            : '';

    return `Bạn là trợ lý mua sắm thông minh của TTDN Food Market – siêu thị thực phẩm tươi sống tại Việt Nam.

Vai trò của bạn:
1. Tư vấn mua sắm thực phẩm
2. Gợi ý món ăn phù hợp với nguyên liệu có sẵn
3. Hướng dẫn nấu ăn đơn giản
4. Đề xuất sản phẩm phù hợp nhu cầu

Quy tắc:
- Trả lời bằng tiếng Việt, ngắn gọn và thân thiện
- Ưu tiên gợi ý sản phẩm từ danh sách bên dưới
- Nếu được hỏi về nấu ăn, gợi ý các công thức từ danh sách recipes
- Không bịa thông tin về giá cả
- Kết thúc câu trả lời với 1-2 gợi ý liên quan ngắn gọn (nếu phù hợp)
${cartContext}

Sản phẩm đang có tại cửa hàng:
${productList}

Công thức nấu ăn nổi bật:
${recipeList}

Lưu ý: Trả lời tối đa 200 từ. Sử dụng emoji khi phù hợp.`;
}

// ═══════════════════════════════════════════════════════════════
// POST /api/chat/message
// ═══════════════════════════════════════════════════════════════
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message, sessionId, cartItems, currentPage } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: 'Thiếu message hoặc sessionId' });
        }

        if (!process.env.ANTHROPIC_AUTH_TOKEN) {
            return res.status(503).json({
                error: 'AI chưa được cấu hình. Vui lòng thêm ANTHROPIC_AUTH_TOKEN vào .env',
            });
        }

        // Get chat history for this session (last 10 messages)
        const history = await ChatMessage.find({ sessionId })
            .sort({ createdAt: 1 })
            .limit(10)
            .select('role content');

        // Save user message
        await ChatMessage.create({
            sessionId,
            user: req.user?.userId,
            role: MessageRole.USER,
            content: message,
            context: { cartItems, currentPage },
        });

        // Build system prompt
        const systemPrompt = await buildSystemPrompt(cartItems);

        // Build Anthropic messages history
        const anthropicMessages: Anthropic.MessageParam[] = [
            // Include history (alternate user/assistant)
            ...history.map((msg) => ({
                role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
                content: msg.content,
            })),
            // Current user message
            { role: 'user' as const, content: message },
        ];

        // Call Claude API
        const response = await anthropic.messages.create({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 512,
            system: systemPrompt,
            messages: anthropicMessages,
        });

        const aiResponse =
            response.content[0]?.type === 'text' ? response.content[0].text : 'Xin lỗi, tôi không thể trả lời lúc này.';

        // Save AI response
        const savedMsg = await ChatMessage.create({
            sessionId,
            user: req.user?.userId,
            role: MessageRole.ASSISTANT,
            content: aiResponse,
            tokens: response.usage?.input_tokens + response.usage?.output_tokens,
        });

        res.json({
            message: {
                _id: savedMsg._id,
                role: 'assistant',
                content: aiResponse,
                createdAt: savedMsg.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Chat error:', error.message || error);

        // Handle rate limiting gracefully
        if (error.status === 429) {
            return res.status(429).json({
                error: 'AI đang bận, vui lòng thử lại sau vài giây! ⏳',
            });
        }

        // Handle auth errors
        if (error.status === 401 || error.status === 403) {
            return res.status(503).json({
                error: 'AI API key không hợp lệ. Vui lòng kiểm tra ANTHROPIC_AUTH_TOKEN.',
            });
        }

        res.status(500).json({
            error: 'AI hiện tại đang quá tải. Vui lòng thử lại sau.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

// ═══════════════════════════════════════════════════════════════
// GET /api/chat/history/:sessionId
// ═══════════════════════════════════════════════════════════════
export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
            .sort({ createdAt: 1 })
            .limit(50)
            .select('role content createdAt');

        res.json({ messages });
    } catch (error: any) {
        res.status(500).json({ error: 'Không thể tải lịch sử chat' });
    }
};
