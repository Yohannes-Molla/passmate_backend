// telegram_bot.ts
import axios from 'axios';

const BOT_TOKEN = '8028968557:AAFTyysuI2CmTOgeyLabxcjZyefMCXnDCPc';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEB_APP_URL = 'https://passmate-frontend.web.app/';

let offset = 0;

const startBot = async () => {
    console.log('🤖 Telegram bot started...');

    while (true) {
        try {
            const res = await axios.get(`${TELEGRAM_API}/getUpdates`, {
                params: {
                    offset,
                    timeout: 30 // seconds (long polling)
                }
            });

            const updates = res.data.result;

            for (const update of updates) {
                offset = update.update_id + 1; // prevent reprocessing

                const message = update.message;

                // Handle /start command
                if (message?.text === '/start') {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: message.chat.id,
                        text: '👋 Welcome! Tap the button below to open the PWA:',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '🚀 Open App', web_app: { url: WEB_APP_URL } }]
                            ]
                        }
                    });
                }

                // Handle data from web app
                if (message?.web_app_data?.data) {
                    try {
                        const parsed = JSON.parse(message.web_app_data.data);
                        await axios.post(`${TELEGRAM_API}/sendMessage`, {
                            chat_id: message.chat.id,
                            text: `✅ Data received from PWA:\n${JSON.stringify(parsed, null, 2)}`
                        });
                    } catch (err) {
                        console.error('Error parsing web_app_data:', err);
                    }
                }
            }
        } catch (err: any) {
            console.error('Polling error:', err.message);
            await new Promise(res => setTimeout(res, 5000)); // Wait before retrying
        }
    }
};

startBot();
