var Tomita = require('tomita-parser');
const ttt = `Фильм Оливера Стоуна "Александр" основан на реальной жизни одного из самых выдающихся людей в истории.

"Титаник" (Titanic) — фильм-катастрофа 1997 года, снятый Джеймсом Кэмероном, в котором показана гибель легендарного лайнера «Титаник». Главные роли в фильме исполнили Кейт Уинслет (Роза Дьюитт Бьюкейтер) и Леонардо Ди Каприо (Джек Доусон).

«Неприкасаемые»(Intouchables) — трагикомедийный фильм 2011 года, основанный на реальных событиях. Главные роли исполняют Франсуа Клюзе и Омар Си, удостоенный за эту актёрскую работу национальной премии «Сезар».
`;
new Tomita(ttt, '/Users/bars/Downloads/examples/sample/config.proto', function (err, res) {
  console.log(err, res);
  // ...
});