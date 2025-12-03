require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.get('/', (req, res) => {
    res.send('🤖 Telegram Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Simple memory storage for user language
const userLanguages = {};

// Start command - show language selection
bot.start((ctx) => {
    ctx.reply('🌍 *Welcome! Please choose your language:*\n\n🌍 *Xush kelibsiz! Iltimos, tilni tanlang:*\n\n🌍 *Добро пожаловать! Пожалуйста, выберите язык:*', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🇺🇸 English', callback_data: 'lang_en' },
                    { text: '🇺🇿 Oʻzbekcha', callback_data: 'lang_uz' },
                    { text: '🇷🇺 Русский', callback_data: 'lang_ru' }
                ]
            ]
        }
    });
});

// Handle language selection
bot.action('lang_en', (ctx) => {
    userLanguages[ctx.from.id] = 'en';
    ctx.answerCbQuery();
    showMainMenu(ctx, 'en');
});

bot.action('lang_uz', (ctx) => {
    userLanguages[ctx.from.id] = 'uz';
    ctx.answerCbQuery();
    showMainMenu(ctx, 'uz');
});

bot.action('lang_ru', (ctx) => {
    userLanguages[ctx.from.id] = 'ru';
    ctx.answerCbQuery();
    showMainMenu(ctx, 'ru');
});

// Function to show main menu with bots
function showMainMenu(ctx, lang) {
    let message = '';
    let buttons = [];
    
    if (lang === 'en') {
        message = '🤖 *Which bot would you like to write to?*';
        buttons = [
            [{ text: '🤖 Support Bot', callback_data: 'bot_support' }],
            [{ text: '💼 Business Bot', callback_data: 'bot_business' }],
            [{ text: '🎮 Gaming Bot', callback_data: 'bot_gaming' }],
            [{ text: '📊 Analytics Bot', callback_data: 'bot_analytics' }],
            [{ text: '🌐 Change Language', callback_data: 'change_lang' }]
        ];
    } else if (lang === 'uz') {
        message = '🤖 *Qaysi botga yozmoqchisiz?*';
        buttons = [
            [{ text: '🤖 Yordam Boti', callback_data: 'bot_support' }],
            [{ text: '💼 Biznes Bot', callback_data: 'bot_business' }],
            [{ text: '🎮 Oʻyin Boti', callback_data: 'bot_gaming' }],
            [{ text: '📊 Analitika Bot', callback_data: 'bot_analytics' }],
            [{ text: '🌐 Tilni oʻzgartirish', callback_data: 'change_lang' }]
        ];
    } else if (lang === 'ru') {
        message = '🤖 *С каким ботом вы хотите написать?*';
        buttons = [
            [{ text: '🤖 Бот поддержки', callback_data: 'bot_support' }],
            [{ text: '💼 Бизнес бот', callback_data: 'bot_business' }],
            [{ text: '🎮 Игровой бот', callback_data: 'bot_gaming' }],
            [{ text: '📊 Аналитический бот', callback_data: 'bot_analytics' }],
            [{ text: '🌐 Изменить язык', callback_data: 'change_lang' }]
        ];
    }
    
    // If editing existing message
    if (ctx.callbackQuery) {
        ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: buttons }
        });
    } else {
        // If sending new message
        ctx.reply(message, {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: buttons }
        });
    }
}

// Bot links configuration
// REPLACE THESE WITH YOUR ACTUAL BOT LINKS
const botLinks = {
    bot_support: 'https://t.me/your_support_bot?start=ref',  // Change this
    bot_business: 'https://t.me/your_business_bot?start=ref', // Change this
    bot_gaming: 'https://t.me/your_gaming_bot?start=ref',     // Change this
    bot_analytics: 'https://t.me/your_analytics_bot?start=ref' // Change this
};

// Bot names for display
const botNames = {
    en: {
        bot_support: 'Support Bot',
        bot_business: 'Business Bot',
        bot_gaming: 'Gaming Bot',
        bot_analytics: 'Analytics Bot'
    },
    uz: {
        bot_support: 'Yordam Boti',
        bot_business: 'Biznes Bot',
        bot_gaming: 'Oʻyin Boti',
        bot_analytics: 'Analitika Bot'
    },
    ru: {
        bot_support: 'Бот поддержки',
        bot_business: 'Бизнес бот',
        bot_gaming: 'Игровой бот',
        bot_analytics: 'Аналитический бот'
    }
};

// Handle bot selection
bot.action(['bot_support', 'bot_business', 'bot_gaming', 'bot_analytics'], (ctx) => {
    const botKey = ctx.callbackQuery.data;
    const userId = ctx.from.id;
    const lang = userLanguages[userId] || 'en';
    const botLink = botLinks[botKey];
    const botName = botNames[lang][botKey];
    
    ctx.answerCbQuery();
    
    // Send the bot link
    ctx.reply(`🚀 *${botName}*\n\nClick the button below to start:`, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '▶️ Start Bot', url: botLink }],
                [{ text: '◀️ Back to Menu', callback_data: 'back_menu' }]
            ]
        }
    });
});

// Back to menu
bot.action('back_menu', (ctx) => {
    const userId = ctx.from.id;
    const lang = userLanguages[userId] || 'en';
    ctx.answerCbQuery();
    showMainMenu(ctx, lang);
});

// Change language
bot.action('change_lang', (ctx) => {
    ctx.answerCbQuery();
    ctx.editMessageText('🌍 *Please choose your language:*\n\n🌍 *Iltimos, tilni tanlang:*\n\n🌍 *Пожалуйста, выберите язык:*', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🇺🇸 English', callback_data: 'lang_en' },
                    { text: '🇺🇿 Oʻzbekcha', callback_data: 'lang_uz' },
                    { text: '🇷🇺 Русский', callback_data: 'lang_ru' }
                ]
            ]
        }
    });
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('❌ An error occurred. Please try again.');
});

// Start the bot
bot.launch()
    .then(() => {
        console.log('✅ Bot is running successfully!');
        console.log('ℹ️  Bot username: @' + bot.botInfo.username);
    })
    .catch((err) => {
        console.error('❌ Failed to start bot:', err);
    });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));