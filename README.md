# BudgetBuddy
веб-приложение на реакте + бэкенд на express`e и базаой данных - mongodb.
---
Приложение про регистрацию , посты и отправку их на почту.
## Как это работает (кратко).
- Регистрация аккаунта: создание юзера в бд, и получение куки для автоматической авторизации.
- Удаление аккаунта: удалет юзера из бд и все созданные посты и записи для отправки на почту.
- Посты:  объекты созданные на выбранный месяц и год (год статичный 2023).
- Записи в постах: это объекты которые находятся внутри постов`{post: {cashData: [lose: {запись}],[profit: {запись}]}}`.
- Что делает фронтенд: фронт принимает с сервера объект поста и далее отрисовывает его взависимости от данных из поста, все расчеты [диаграмм](https://www.npmjs.com/package/chart.js?activeTab=readme) и процентных соотношений просиходят на клиенте.
- Бэкэнд: на всех запросах стоит аунтефикация которая добавляет в тело запроса параметр с айди юзера, который изначально передается в куки.
+ Так же бэкэнд осуществляет отправку писем на почту,  


планировщик 
[node-schedule](https://www.npmjs.com/package/node-schedule)  [nodemailer](https://www.npmjs.com/package/nodemailer)
