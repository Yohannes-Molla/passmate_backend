// src/services/telegram_bot.ts
import axios from 'axios';

const BOT_TOKEN = '7759986947:AAHPdbrh4xs-kAt_isnSlOTTDElCcT3aP9Q';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEB_APP_URL = 'https://passmate-frontend.web.app/';

let offset = 0;

export const startTelegramBot = async () => {
    console.log('🤖 Telegram bot started...');

    // ❗️Delete webhook first to enable polling
    try {
        await axios.get(`${TELEGRAM_API}/deleteWebhook`);
        console.log('✅ Webhook deleted to enable polling');
    } catch (err) {
        console.error('⚠️ Error deleting webhook:', err);
    }

    while (true) {
        try {
            const res = await axios.get(`${TELEGRAM_API}/getUpdates`, {
                params: { offset, timeout: 30 }
            });

            const updates = res.data.result;

            for (const update of updates) {
                offset = update.update_id + 1;
                const message = update.message;

                if (message?.text === '/start') {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: message.chat.id,
                        text: '🎓 Welcome to PassMate! Start preparing for your exams now:',
                        reply_markup: {
                            keyboard: [
                                [{ text: '📘 Start Studying', web_app: { url: WEB_APP_URL } }]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: false
                        }
                    });
                    await axios.post(`${TELEGRAM_API}/setChatMenuButton`, {
                        menu_button: {
                            type: 'web_app',
                            text: 'Launch Passmate 🚀',
                            web_app: {
                                url: WEB_APP_URL // Replace with your app URL
                            }
                        }
                    });
                }

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
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};
