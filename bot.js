const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Ваш токен Telegram-бота
const token = '7088257898:AAGM2RMZi3P7sNGe48J6qXEP-Emqm3wmepg';
const bot = new TelegramBot(token, { polling: true });

// URL и токен вашего Jexactyl API
const jexactylAPIURL = 'https://dash.kazaknodes.online/api'; // URL вашего Jexactyl API
let jexactylAPIToken = '';  // Этот токен будет устанавливаться после входа

// Nest ID и Egg ID
const nestId = '5';
const eggId = '15';

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать! Доступные команды: /login, /start_server, /stop_server, /restart_server, /create_server');
});

// Обработчик команды /login
bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1];
  const password = match[2];
  
  try {
    const response = await axios.post(`${jexactylAPIURL}/auth/login`, {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    jexactylAPIToken = response.data.token;  // Сохраняем токен
    bot.sendMessage(chatId, 'Вход выполнен успешно. Вы можете управлять серверами.');
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка входа: ' + error.message);
  }
});

// Обработчик команды /start_server
bot.onText(/\/start_server/, async (msg) => {
  const chatId = msg.chat.id;
  if (!jexactylAPIToken) {
    return bot.sendMessage(chatId, 'Сначала выполните вход командой /login.');
  }
  
  try {
    const serverId = '53060a7b-9aac-41c9-b788-d4c080479562'; // Ваш ID сервера
    const response = await axios.post(`${jexactylAPIURL}/servers/${serverId}/power`, {
      power: 'start'
    }, {
      headers: {
        'Authorization': `Bearer ${jexactylAPIToken}`,
        'Content-Type': 'application/json'
      }
    });
    bot.sendMessage(chatId, 'Сервер запущен.');
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка запуска сервера: ' + error.message);
  }
});

// Обработчик команды /stop_server
bot.onText(/\/stop_server/, async (msg) => {
  const chatId = msg.chat.id;
  if (!jexactylAPIToken) {
    return bot.sendMessage(chatId, 'Сначала выполните вход командой /login.');
  }
  
  try {
    const serverId = '53060a7b-9aac-41c9-b788-d4c080479562'; // Ваш ID сервера
    const response = await axios.post(`${jexactylAPIURL}/servers/${serverId}/power`, {
      power: 'stop'
    }, {
      headers: {
        'Authorization': `Bearer ${jexactylAPIToken}`,
        'Content-Type': 'application/json'
      }
    });
    bot.sendMessage(chatId, 'Сервер остановлен.');
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка остановки сервера: ' + error.message);
  }
});

// Обработчик команды /restart_server
bot.onText(/\/restart_server/, async (msg) => {
  const chatId = msg.chat.id;
  if (!jexactylAPIToken) {
    return bot.sendMessage(chatId, 'Сначала выполните вход командой /login.');
  }
  
  try {
    const serverId = '53060a7b-9aac-41c9-b788-d4c080479562'; // Ваш ID сервера
    const response = await axios.post(`${jexactylAPIURL}/servers/${serverId}/power`, {
      power: 'restart'
    }, {
      headers: {
        'Authorization': `Bearer ${jexactylAPIToken}`,
        'Content-Type': 'application/json'
      }
    });
    bot.sendMessage(chatId, 'Сервер перезагружен.');
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка перезагрузки сервера: ' + error.message);
  }
});

// Обработчик команды /create_server
bot.onText(/\/create_server (.+) (.+) (.+) (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!jexactylAPIToken) {
    return bot.sendMessage(chatId, 'Сначала выполните вход командой /login.');
  }
  
  const name = match[1];
  const description = match[2];
  const ram = match[3];
  const disk = match[4];
  const cpu = match[5];
  
  try {
    const response = await axios.post(`${jexactylAPIURL}/servers`, {
      name,
      description,
      user_id: '1',  // ID пользователя
      nest_id: nestId,
      egg_id: eggId,
      limits: {
        memory: parseInt(ram),
        swap: 0,
        disk: parseInt(disk),
        io: 500
      },
      environment: {
        // Задайте переменные окружения, если необходимо
      },
      allocations: [
        {
          ip: '0.0.0.0',
          port: 0
        }
      ],
      feature_limits: {
        cpu: parseInt(cpu)
      }
    }, {
      headers: {
        'Authorization': `Bearer ${jexactylAPIToken}`,
        'Content-Type': 'application/json'
      }
    });
    bot.sendMessage(chatId, 'Сервер создан. ID сервера: ' + response.data.id);
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка создания сервера: ' + error.message);
  }
});
