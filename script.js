// getJsonFile принимает в качестве параметра путь к файлу формата JSON
// и возвращает объект
let getJsonFile = (pathToFile) => {
  let request = new XMLHttpRequest();

  request.open("GET", pathToFile, false);
  request.send(null);

  let my_JSON_object = JSON.parse(request.responseText);

  return my_JSON_object;
};

// функция renderEmojiCards принимает блок объектов
// и рендерит объек в виде карточек в документе
function renderEmojiCards(emoji) {
  let mainNode = document.querySelector("main");

  emoji.forEach((element) => {
    let divCardEmoji = document.createElement("div");

    divCardEmoji.className = "card-emoji";
    for (key in element) {
      let div = document.createElement("div");
      div.className = `${key}`;
      if (key == 'keywords') {
        let res = element[key].split(' ');
        res = [...new Set(res)].join(' '); // помещаем значения ключевых слов в Set для удаления дубликатов
        element[key] = res;
      }
      div.append(element[key]);
      divCardEmoji.append(div);
      mainNode.append(divCardEmoji);
    }
  });
}

// функция getBlockEmoji принимает объект данных и индекс начала поиска
// и зовращает блок с которого начинался поиск
function getBlockEmoji(emoji, indexEmoji) {
  let blockEmoji = [];
  
  for (let i = indexEmoji; i < indexEmoji + 20; i++) {
    blockEmoji[i] = emoji[i];
  }

  return blockEmoji;
}

// функция scrollEmoji принимает блок, объек с данными и индекс начала поиска
// вызывает функцию рендера блока и переопределяет индекс начала поиска
function scrollEmoji(block, allEmoji, startIndexEmoji) {
  while(true) {
    // нижняя граница документа
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
    // если меньше 100px до конца
    if (windowRelativeBottom > document.documentElement.clientHeight + 100) break;

    block = getBlockEmoji(allEmoji, startIndexEmoji);

    renderEmojiCards(block);
    startIndexEmoji = block.length;
  }
}

// функция searchEmoji принимает в качестве аргумента массив объектов с эмоджи
// и отображает эмоджи заданные в поле input
function searchEmoji(allEmoji) {
  let InputValue = document.querySelector('input').value.toLowerCase().trim();
  let startIndexEmoji = 0;

  // res получет массив объектов соответствующих условию
  let res = allEmoji.filter((elem) => {
    return ((elem.title.includes(InputValue)) || (elem.keywords.includes(InputValue)));
  });

  let block = getBlockEmoji(res, startIndexEmoji);

  document.querySelector('main').innerHTML = '';
  renderEmojiCards(block);
  startIndexEmoji = block.length;

  window.addEventListener('scroll', () => scrollEmoji(block, res, startIndexEmoji));
}

(function main() {
  let allEmoji = getJsonFile("https://raw.githubusercontent.com/dead142/emoji/main/emoji.json");
  let startIndexEmoji = 0;
  let block = getBlockEmoji(allEmoji, startIndexEmoji);
  
  renderEmojiCards(block);
  startIndexEmoji = block.length;

  window.addEventListener('scroll', () => scrollEmoji(block, allEmoji, startIndexEmoji));

  window.addEventListener('input', () => searchEmoji(allEmoji));
})();