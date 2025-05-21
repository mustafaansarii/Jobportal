
const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_KEY,
  supabaseServiceRole: import.meta.env.VITE_SERVICE_ROLE,
  telegramBotToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  telegramChannelId: import.meta.env.VITE_TELEGRAM_CHANNEL_ID,
}

export default config;
