# BudgetBuddy
веб-приложение на реакте, бэкенд написан на express`e, база данных - mongodb.
---
Приложение про посты.
## Как работают посты.
+ объект поста - сам пост в котором хранятся все внесенные данные
+ запись в посте - в посте есть объект `{CashData}` с двумя массивами  `[Profit]` , `[Lose]` , объекты внутри этих массивов и есть записи 
+ айди юзера из запроса - айди юзера хранится в куки, при запроса на сервер, происходит аунтефикация, после которой в тело запроса добавляется поле с юзер айди.
---
- При загрузке страницы, отправляется запрос на получение постов, на бэкэнде берется айди юзера из запроса по нему фильтруется вся коллекция и в ответе возвращается только посты запрашиваемого юзера.
- При создании поста, отправляется запрос с выбранным месяцом и (статичным-2023) годом, данные юзера так же берутся из запроса, и возвращается объект поста.
- При создании/удалении записи в посте , отправлется айди поста, и запись в полном формате массива `{cashData}: [Profit/lose : {объект с данными записи}]`, на бэкэнде находится пост по айди, далее в нем находится нужный массив profit или lose и добавляются данные , или по айди удаляются.
-При создании "напоминалки" идет запрос на создание объекта в другой коллекции бд, в нее записывается дата для отправки, юзер и данные для отправки. Каждый день в 4:10 по мск [node-schedule](https://www.npmjs.com/package/node-schedule) запускает функцию которая проверяет наличие в коллекции  объектов с датой отправки === сегодняшней дате. Все совпадения добавляются в массив, и когда коллекция проверена, на каждый эелмент массива вызывается функция для отправки писем при помощи [nodemailer](https://www.npmjs.com/package/nodemailer)
