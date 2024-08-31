const axios = require('axios');
const { Telegraf } = require('telegraf');

// Инициализация Telegram бота
const bot = new Telegraf('7088257898:AAEbKNSqu67O3J4oMgMzexLsCd7_jZGYfTM');

// Обработчик команды /start
bot.start((ctx) => {
    ctx.reply('Добро пожаловать! Отправьте команду /register, чтобы зарегистрироваться.');
});

// Переменные для хранения введённых данных
let userData = {};

// Обработчик команды /register
bot.command('register', (ctx) => {
    userData[ctx.chat.id] = {}; // Инициализация данных пользователя для текущего чата

    ctx.reply('Пожалуйста, введите ваш email:');

    bot.on('text', async (ctx) => {
        if (!userData[ctx.chat.id].email) {
            userData[ctx.chat.id].email = ctx.message.text.trim();
            ctx.reply('Введите имя пользователя:');
        } else if (!userData[ctx.chat.id].username) {
            userData[ctx.chat.id].username = ctx.message.text.trim();
            ctx.reply('Введите пароль:');
        } else if (!userData[ctx.chat.id].password) {
            userData[ctx.chat.id].password = ctx.message.text.trim();

            ctx.reply('Регистрация началась. Пожалуйста, подождите...');

            try {
                // Выполнение HTTP-запроса для регистрации пользователя
                const response = await axios.post('https://dash.kazaknodes.online/register', {
                    email: userData[ctx.chat.id].email,
                    username: userData[ctx.chat.id].username,
                    password: userData[ctx.chat.id].password,
                    password_confirmation: userData[ctx.chat.id].password // Подтверждение пароля
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

            // Очистка данных после завершения регистрации
            delete userData[ctx.chat.id];
        }
    });
});

// Запуск бота
bot.launch().then(() => console.log('Бот запущен'));

// Обработка остановки
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
