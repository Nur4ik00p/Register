const axios = require('axios');
const { Telegraf } = require('telegraf');

// Инициализация Telegram бота
const bot = new Telegraf('7088257898:AAEbKNSqu67O3J4oMgMzexLsCd7_jZGYfTM');

// Обработчик команды /start
bot.start((ctx) => {
    ctx.reply('Добро пожаловать! Отправьте команду /register, чтобы зарегистрироваться.');
});

// Обработчик команды /register
bot.command('register', async (ctx) => {
    ctx.reply('Пожалуйста, введите ваш email:');

    // Запрашиваем email
    bot.once('text', async (ctx) => {
        const email = ctx.message.text.trim();

        ctx.reply('Введите имя пользователя:');
        // Запрашиваем имя пользователя
        bot.once('text', async (ctx) => {
            const username = ctx.message.text.trim();

            ctx.reply('Введите пароль:');
            // Запрашиваем пароль
            bot.once('text', async (ctx) => {
                const password = ctx.message.text.trim();
                
                ctx.reply('Регистрация началась. Пожалуйста, подождите...');

                try {
                    // Выполнение HTTP-запроса для регистрации пользователя
                    const response = await axios.post('https://dash.kazaknodes.online/auth/register', {
                        email: email,
                        username: username,
                        password: password,
                        password_confirmation: password // Подтверждение пароля
                    });

                    // Обработка ответа сервера
                    if (response.status === 200) {
                        ctx.reply('Регистрация прошла успешно!');
                    } else {
                        ctx.reply(`Ошибка при регистрации: ${response.data.message || 'Неизвестная ошибка'}`);
                    }
                } catch (error) {
                    console.error('Ошибка при выполнении запроса:', error);
                    ctx.reply('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
                }
            });
        });
    });
});

// Запуск бота
bot.launch().then(() => console.log('Бот запущен'));

// Обработка остановки
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
