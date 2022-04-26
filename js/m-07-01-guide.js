// === Поширення подій =====================================================================================
// Поширення подій (event propagation) - це термін, що описує життєвий цикл події, який має три етапи: занурення, таргетинг і спливання.
// На практиці найчастіше використовують тільки фазу спливання.

// Під час настання події, вона проходить через три обов'язкові фази:
//  - Capturing phase (занурення) - подія починається на window і тоне (проходить через усі елементи-предки) до найглибшого цільового елемента, на якому відбулася дія, наприклад, клік.
//  - Target phase (таргетинг) - подія дійшла до цільового елемента. Цей етап містить тільки повідомлення елемента про те, що на ньому відбулася дія.
//  - Bubbling phase (спливання) - кінцева фаза, подія спливає від найглибшого, цільового елемента, через усі елементи-предки до window.

// ЦІКАВО: Поширення часто неправильно використовується як синонім стадії спливання. Щоразу, коли відбувається подія, відбувається її поширення.

// === Спливання подій ====================================================================================

// Під час настання події, обробники спочатку спрацьовують на найбільш вкладеному елементі,
// потім - на його батьківському елементі, потім вище і так далі, вгору по ланцюжку вкладеності.
// Цей процес називається спливання(event bubbling), тому що події «спливають» від внутрішнього елемента вгору
// через усіх предків до window, подібно до спливання бульбашки повітря у воді.

// Спливання гарантує, що клік по #descendant викличе обробник кліка, якщо він є, спочатку на самому #descendant,
// потім на елементі #child, далі на елементі #parent і так далі вгору по ланцюжку предків до window.
// Тому, якщо в прикладі клікнути на #descendant, то послідовно виведуться alert для descendant → child → parent.

// ЦІКАВО: Спливають майже всі події, наприклад, події focus і blur не спливають, тому існують їх спливаючі аналоги - focusin і focusout.

// Приклад 1 ==============================================================================================

// const parent = document.querySelector("#parent");
// const child = document.querySelector("#child");
// const descendant = document.querySelector("#descendant");

// parent.addEventListener("click", () => {
//   alert("Parent click handler");
// });

// child.addEventListener("click", () => {
//   alert("Child click handler");
// });

// descendant.addEventListener("click", () => {
//   alert("Descendant click handler");
// });

// === Властивість event.target ============================================================================
// Незалежно від того, де ми спіймали подію під час її спливання, завжди можна дізнатися, де саме вона відбулася.
// Найглибший елемент, який викликає подію, називається цільовим або вихідним, і доступний як event.target.

// event.target - це посилання на вихідний елемент, на якому відбулася подія, в процесі спливання вона - незмінна.
// event.currentTarget - це посилання на поточний елемент, до якого дійшло спливання, на ньому зараз виконується обробник події.
// Якщо слухач події зареєстрований на найвищому елементі, то він «спіймає» усі кліки всередині, тому що події будуть спливати до цього елемента.
// Відкрийте консоль в прикладі і поклікайте, event.target - це завжди вихідний(і найглибший) елемент, на якому був клік,
// а event.currentTarget не змінюється.

// Приклад 2 ===============================================================================================

// const parent = document.querySelector("#parent");

// parent.addEventListener("click", (event) => {
//   console.log("event.target: ", event.target);
//   console.log("event.currentTarget: ", event.currentTarget);
// });

// === Припинення спливання ================================================================================
// Зазвичай, подія буде спливати вгору до елемента window, викликаючи усі обробники на своєму шляху.
// Але будь - який проміжний обробник може вирішити, що подія повністю оброблена і зупинити спливання, викликавши метод stopPropagation().

// Якщо елемент має декілька обробників на одну подію, то, навіть у разі припинення спливання, усі вони будуть виконані.
// Тобто метод stopPropagation() тільки перешкоджає просуванню події далі.
// Якщо необхідно повністю зупинити обробку події, використовується метод stopImmediatePropagation().
// Він не тільки запобігає спливанню, але й зупиняє обробку подій на поточному елементі.

// ЦІКАВО: Не припиняйте спливання без необхідності. Припинення спливання створює свої підводні камені, які потім доводиться обходити.
// Наприклад, аналітика використовує спливання, щоб відстежувати події на сторінці.

// Приклад 3 ===============================================================================================

// const parent = document.querySelector("#parent");
// const child = document.querySelector("#child");
// const descendant = document.querySelector("#descendant");

// parent.addEventListener("click", () => {
//   alert(
//     "Parent click handler. This alert will not appear when clicking on Descendant, the event will not reach here!"
//   );
// });

// child.addEventListener("click", () => {
//   alert(
//     "Child click handler. This alert will not appear when clicking on Descendant, the event will not reach here!"
//   );
// });

// descendant.addEventListener("click", (event) => {
//   event.stopPropagation();
//   alert("Descendant click handler");
// });

// === Делегування подій ====================================================================================
// Спливання дозволяє реалізувати один із найкорисніших прийомів - делегування подій (event delegation).
// Він полягає у тому, що, якщо є група елементів, події яких потрібно обробляти однаково,
// то додається один обробник на їх загального предка, замість того, щоб додавати обробник до кожного елемента.

// Використовуючи властивість event.target, можна отримати посилання на цільовий елемент, зрозуміти,
// на якому саме дочірньому елементі відбулася подія, і обробити її.

// Розглянемо делегування на прикладі. Створюємо елемент <div>, додаємо до нього будь-яку кількість кнопок, наприклад 100,
// і реєструємо кожній слухача події кліку з функцією handleButtonClick.

// Проблема у тому, що у нас є сто слухачів подій. Всі вони вказують на одну і ту саму функцію слухача, але слухачів 100.
// Що буде, якщо ми перемістимо усіх слухачів на спільного предка - елемент < div >?

// Тепер є тільки один обробник події кліку і браузеру не потрібно зберігати у пам'яті сто різних слухачів.
// Тобто делегування зводиться до трьох простих кроків.

// 1. Визначити спільного предка групи елементів для відстеження подій.
// 2. Зареєструвати на елементі-предку обробник події, яку ми хочемо відловлювати з групи елементів.
// 3. В обробнику використовувати event.target для вибору цільового елемента.
// Такий підхід спрощує ініціалізацію слухачів однотипних елементів.
// Можна додавати, видаляти або змінювати елементи, при цьому, не потрібно вручну додавати або видаляти обробники подій.

// Палітра кольорів ==========
// Будемо створювати палітру кольорів з можливістю вибрати колір по кліку і відображенням обраного кольору.
// Замість того, щоб призначати обробник кожному елементу палітри, яких може бути дуже багато,
// повісимо один слухач на загального предка div.color - palette.
// В обробнику події кліка використовуємо event.target, щоб отримати елемент, на якому відбулася подія і пов'язаний з ним колір,
// який будемо зберігати в атрибуті data - color.

// Приклад 4 (Палітра кольорів) ===============================================================================================

// const colorPalette = document.querySelector(".color-palette");
// const output = document.querySelector(".output");

// colorPalette.addEventListener("click", selectColor);

// // This is where delegation «magic» happens
// function selectColor(event) {
//   if (event.target.nodeName !== "BUTTON") {
//     return;
//   }

//   const selectedColor = event.target.dataset.color;
//   output.textContent = `Selected color: ${selectedColor}`;
//   output.style.color = selectedColor;
// }

// // Some helper functions to render palette items
// createPaletteItems();

// function createPaletteItems() {
//   const items = [];
//   for (let i = 0; i < 60; i++) {
//     const color = getRangomColor();
//     const item = document.createElement("button");
//     item.type = "button";
//     item.dataset.color = color;
//     item.style.backgroundColor = color;
//     item.classList.add("item");
//     items.push(item);
//   }
//   colorPalette.append(...items);
// }

// function getRangomColor() {
//   return `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;
// }

// function getRandomHex() {
//   return Math.round(Math.random() * 256)
//     .toString(16)
//     .padStart(2, "0");
// }

// const fullNumber = Math.round(Math.random() * 256).toString(16).padStart(2, '0');
// console.log('fullNumber', fullNumber);

// const mathRandom = Math.random();
// console.log('mathRandom', mathRandom);

// const mathRandom256 = mathRandom * 256;
// console.log('mathRandom256', mathRandom256);

// const mathRoundMathRandom256 = Math.round(mathRandom256);
// console.log('mathRoundMathRandom256', mathRoundMathRandom256);

// const mathRoundMathRandom256ToString = mathRoundMathRandom256.toString(16);
// console.log('mathRoundMathRandom256ToString', mathRoundMathRandom256ToString);

// const mathRoundMathRandom256ToStringPadStart = mathRoundMathRandom256ToString.padStart(2, '0');
// console.log('mathRoundMathRandom256ToStringPadStart', mathRoundMathRandom256ToStringPadStart);