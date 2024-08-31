const fetch = require('node-fetch');  // Для взаимодействия с Jexactyl API
const { Telegraf } = require('telegraf');  // Telegram Bot API

// Токен вашего Telegram-бота
const bot = new Telegraf('7088257898:AAGYmhnb4Lfu7_gFUCt-KwlsB0I80Wrv7Ko');

// Обработчик команды /start
bot.start((ctx) => {
    ctx.reply('Добро пожаловать! Чтобы зарегистрироваться на панели Jexactyl, отправьте команду /register.');
});

// Обработчик команды /register
bot.command('register', async (ctx) => {
    // Спросим у пользователя email для регистрации
    ctx.reply('Пожалуйста, введите ваш email для регистрации.');

    // Обработчик текстовых сообщений после команды /register
    bot.on('text', async (ctx) => {
        const email = ctx.message.text;

        try {
            // Выполним запрос на API панели Jexactyl для регистрации пользователя
            const response = await fetch('https://dash.kazaknodes.online/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ptla_DIizelsC2SsouBJwSK2Z6LpSFerVTVp2IMbz1po2IjN'
                },
                body: JSON.stringify({
                    email: email,
                    // Добавьте любые другие необходимые поля, такие как username, password и т.д.
                })
            });

            if (response.ok) {
                const result = await response.json();
                ctx.reply(`Регистрация успешна! Ваш логин: ${result.username}`);
            } else {
                ctx.reply('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            ctx.reply('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
        }
    });
});

// Запуск бота
bot.launch().then(() => console.log('Бот запущен'));

// Обработка остановки
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
