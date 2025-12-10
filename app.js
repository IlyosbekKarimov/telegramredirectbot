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
        message = '🤖 *Which tutor would you like to write to?*';
        buttons = [
            [{ text: 'Arziyev Ozod', callback_data: 'bot_arziyev' }],
            [{ text: 'Olim Tojiyev', callback_data: 'bot_olim' }],
            [{ text: 'Qamariddin Doliyev', callback_data: 'bot_qamariddin' }],
            [{ text: 'Aripov Suxrob', callback_data: 'bot_aripov' }],
            [{ text: 'Quddusbek Asadullayev', callback_data: 'bot_quddusbek' }],
            [{ text: '🌐 Change Language', callback_data: 'change_lang' }]
        ];
    } else if (lang === 'uz') {
        message = '🤖 *Qaysi tyutorga yozmoqchisiz?*';
        buttons = [
            [{ text: 'Arziyev Ozod', callback_data: 'bot_arziyev' }],
            [{ text: 'Olim Tojiyev', callback_data: 'bot_olim' }],
            [{ text: 'Qamariddin Doliyev', callback_data: 'bot_qamariddin' }],
            [{ text: 'Aripov Suxrob', callback_data: 'bot_aripov' }],
            [{ text: 'Quddusbek Asadullayev', callback_data: 'bot_quddusbek' }],
            [{ text: '🌐 Tilni oʻzgartirish', callback_data: 'change_lang' }]
        ];
    } else if (lang === 'ru') {
        message = '🤖 *С каким репетитор вы хотите написать?*';
        buttons = [
            [{ text: 'Арзиев Озод', callback_data: 'bot_arziyev' }],
            [{ text: 'Олим Тоджиев', callback_data: 'bot_olim' }],
            [{ text: 'Камариддин Долиев', callback_data: 'bot_qamariddin' }],
            [{ text: 'Арипов Сухроб', callback_data: 'bot_aripov' }],
            [{ text: 'Куддусбек Асадуллаев', callback_data: 'bot_quddusbek' }],
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

const botLinks = {
    bot_arziyev: 'https://t.me/Arziyev_murojaat_bot?start=ref',
    bot_olim: 'https://t.me/olim_tojiyev_bot?start=ref',
    bot_qamariddin: 'https://t.me/qamariddindoliyev_bot?start=ref',
    bot_aripov: 'https://t.me/Aripov_murojaat_bot?start=ref',
    bot_quddusbek: 'https://t.me/Quddusbek_Asadullayev_bot?start=ref'
};

// Bot names for display
const botNames = {
    en: {
        bot_arziyev: 'Arziyev Ozod',
        bot_olim: 'Olim Tojiyev',
        bot_qamariddin: 'Qamariddin Doliyev',
        bot_aripov: 'Aripov Suxrob',
        bot_quddusbek: "Quddusbek Asadullayev"
    },
    uz: {
        bot_arziyev: 'Arziyev Ozod',
        bot_olim: 'Olim Tojiyev',
        bot_qamariddin: 'Qamariddin Doliyev',
        bot_aripov: 'Aripov Suxrob',
        bot_quddusbek: "Quddusbek Asadullayev"
    },
    ru: {
        bot_arziyev: 'Arziyev Ozod',
        bot_olim: 'Olim Tojiyev',
        bot_qamariddin: 'Qamariddin Doliyev',
        bot_aripov: 'Aripov Suxrob',
        bot_quddusbek: "Quddusbek Asadullayev"
    }
};

// Handle bot selection
bot.action(['bot_arziyev', 'bot_olim', 'bot_qamariddin', 'bot_aripov', 'bot_quddusbek'], (ctx) => {
    const botKey = ctx.callbackQuery.data;
    const userId = ctx.from.id;
    const lang = userLanguages[userId] || 'en';
    const botLink = botLinks[botKey];
    const botName = botNames[lang][botKey];
    
    // Multi-language messages
    const messages = {
        en: {
            title: `🚀 *${botName} Bot*`,
            instruction: 'Click the button below to start:',
            startButton: '▶️ Start Bot',
            backButton: '◀️ Back to Menu'
        },
        uz: {
            title: `🚀 *${botName} Boti*`,
            instruction: 'Boshlash uchun pastdagi tugmani bosing:',
            startButton: '▶️ Botni Boshlash',
            backButton: '◀️ Menyuga Qaytish'
        },
        ru: {
            title: `🚀 *Бот ${botName}*`,
            instruction: 'Нажмите кнопку ниже, чтобы начать:',
            startButton: '▶️ Начать Бота',
            backButton: '◀️ Назад в Меню'
        }
    };
    
    const msg = messages[lang];
    
    ctx.answerCbQuery();
    
    // Send the bot link with language-appropriate text
    ctx.reply(`${msg.title}\n\n${msg.instruction}`, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: msg.startButton, url: botLink }],
                [{ text: msg.backButton, callback_data: 'back_menu' }]
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