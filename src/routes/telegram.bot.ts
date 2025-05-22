// src/routes/telegram_bot.ts
import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const BOT_TOKEN = '8028968557:AAFTyysuI2CmTOgeyLabxcjZyefMCXnDCPc';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEB_APP_URL = 'https://5aab-196-188-64-34.ngrok-free.app';

router.post('/', async (req: Request, res: Response) => {
    const update = req.body;

    // If it's a /start command
    if (update?.message?.text === '/start') {
        const chatId = update.message.chat.id;

        try {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatId,
                text: '👋 Welcome! Tap the button below to open the PWA:',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🚀 Open App', web_app: { url: WEB_APP_URL } }]
                    ]
                }
            });
        } catch (err) {
            console.error('Error sending start message:', err);
        }
    }

    // If it's web_app_data sent from the PWA
    if (update?.message?.web_app_data?.data) {
        const data = update.message.web_app_data.data;

        try {
            const parsed = JSON.parse(data);

            // You can now store this in a DB, respond, or trigger actions here
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: update.message.chat.id,
                text: `✅ Data received from PWA:\n${JSON.stringify(parsed, null, 2)}`
            });
        } catch (err) {
            console.error('Error handling web_app_data:', err);
        }
    }

    res.sendStatus(200);
});

export const telegramBotRoutes = router;