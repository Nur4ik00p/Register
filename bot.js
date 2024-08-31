const puppeteer = require('puppeteer');
const { Telegraf } = require('telegraf');

// Инициализация Telegram бота
const bot = new Telegraf('7088257898:AAGYmhnb4Lfu7_gFUCt-KwlsB0I80Wrv7Ko');

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
                    // Запускаем Puppeteer и открываем браузер
                    const browser = await puppeteer.launch({ headless: true });
                    const page = await browser.newPage();

                    // Переходим на страницу регистрации
                    await page.goto('https://dash.kazaknodes.online/auth/register');

                    // Заполняем форму регистрации
                    await page.type('input[name="email"]', email);  // Замените на правильные селекторы
                    await page.type('input[name="username"]', username);  // Замените на правильные селекторы
                    await page.type('input[name="password"]', password);  // Замените на правильные селекторы
                    await page.type('input[name="password_confirmation"]', password);  // Подтверждение пароля

                    // Отправляем форму
                    await Promise.all([
                        page.click('button[type="submit"]'), // Замените на правильный селектор кнопки отправки
                        page.waitForNavigation({ waitUntil: 'networkidle0' }),
                    ]);

                    // Проверка успешности регистрации
                    const successMessage = await page.evaluate(() => {
                        return document.querySelector('.success-message-selector') ? true : false; // Замените на реальный селектор успеха
                    });

                    if (successMessage) {
                        ctx.reply('Регистрация прошла успешно!');
                    } else {
                        ctx.reply('Регистрация не удалась. Проверьте введенные данные и попробуйте еще раз.');
                    }

                    await browser.close();
                } catch (error) {
                    console.error('Ошибка при регистрации:', error);
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
