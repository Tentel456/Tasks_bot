const telegramApi = 'https://api.telegram.org/botYOUR_BOT_TOKEN';
const tonApi = 'https://tonapi.io/v1';

let userId;
let userNickname;
let userAvatar;
let walletAddress;
let walletBalance;

// получаем информацию о пользователе из Telegram
fetch(`${telegramApi}/getMe`)
  .then(response => response.json())
  .then(data => {
    userId = data.result.id;
    userNickname = data.result.username;
    userAvatar = data.result.profile_photo;

    document.getElementById('user-nickname').textContent = userNickname;
    document.getElementById('user-avatar').src = userAvatar;
  });

// отображаем задания
fetch('tasks.json')
  .then(response => response.json())
  .then(tasks => {
    const tasksList = document.getElementById('tasks-list');
    tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = `<a href="${task.link}" target="_blank">${task.name}</a>`;
      tasksList.appendChild(taskItem);
    });
  });

// подключаем кошелек TON
document.getElementById('connect-wallet-btn').addEventListener('click', () => {
  const walletInput = prompt('Введите адрес вашего кошелька TON');
  if (walletInput) {
    walletAddress = walletInput;
    fetch(`${tonApi}/getBalance?address=${walletAddress}`)
      .then(response => response.json())
      .then(data => {
        walletBalance = data.result.balance;
        document.getElementById('wallet-info').innerHTML = `Ваш кошелек: ${walletAddress}<br>Баланс: ${walletBalance} монеток`;

        // сохраняем кошелек в файл
        const walletsFile = 'wallets.txt';
        fetch(walletsFile, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ [userId]: { walletAddress, walletBalance } })
        });
      });
  }
});
