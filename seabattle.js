let attack = document.getElementById("attack");
let observe = document.getElementById("observe");
let parent = document.querySelector(".parent");

let offsetX, offsetY;

let msg = "Я приветствую тебя!<br>Сейчас Я покажу Тебе как нужно побеждать!!!";
let msgSunk = "Тысяча пиратов!!! <br> ТЫ потопил мой любимый корабль!!!";
let msgMiss = "Ну ТЫ и ... МАЗИЛА !!!";
let msgHit = "Ты ПОПАЛ !!! <br> Я уверен это случайно!";
let msgmessage = "Пора расставить корабли !!!";
let msgmessage1 = "Твой ход АДМИРАЛ!";

// Попытка реализовать расстановку (играком) кораблей в правом поле с помощью drag&drop  

// elem.addEventListener('dragstart', function(event) {
//   this.style.borderColor = '#f09a00';
//   offsetX = event.offsetX
//   offsetY = event.offsetY

// })

// elem.addEventListener('drag', function() {
//   this.style.borderColor = '#f09a00'
// })

// elem.addEventListener('dragend', function(event) {
//   this.style.borderColor = '#777'
//   elem.style.top = (event.pageX - offsetX) + 'px'
//   elem.style.left = (event.pageY - offsetY) + 'px'

// })



// parent.addEventListener('dragenter', function() {
//   this.style.borderColor = '#459fc9'
// })

// parent.addEventListener('dragover', function(event) {
//   event.preventDefault();
//   // this.style.borderColor = '#459fc9'
// })

// parent.addEventListener('drop', function() {
//   this.style.borderColor = '#459fc9'
// })






let model = {
  direct: NaN,
  boardSize : 10,                                                // размер поля
  shipLength: [4,3,3,2,2,2,1,1,1,1],                             // колличество палуб всех кораблей 
  shipsSunk: 0,                                                  // счетчик затонувших кораблей
  numShips: 10,
  arrayRow: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ], // ряды
  // массивы с координатами зон
  upperLeftCorner: ["A00"],
  upperRightCorner: ["A09"],
  lowLeftCorner: ["A90"],
  lowRightCorner: ["A99"],
  upperHorizontalPosition: [ "A01","A02","A03","A04","A05","A06","A07","A08" ], 
  leftVerticalPosition: [ "A10","A20","A30","A40","A50","A60","A70","A80" ],
  rigthVerticalPosition: [ "A19","A29","A39","A49","A59","A69","A79","A89" ],
  lowHorizontalPosition: [ "A91","A92","A93","A94","A95","A96","A97","A98" ],


  // сюда будут записаны координаты кораблей созданых случайным образом
  compShips : [
    { locations: ["0"], // координаты корабля
      blocked: ["0"],   // координаты запрета (в этих координатах не должно быть других кораблей)
      hits: [" "] // координаты попаданий , для определения потоплен корабль или нет
    },
    { locations: ["0"],
      blocked: [" "],
      hits: [" "]
    },
    { locations: ["0"],
      blocked: [" "],
      hits: [" "]
    },
    { locations: ["0"],
      blocked: [" "],
      hits: [" "]
    },
    { locations: ["0", "0"],
      blocked: [" "],
      hits: [" ", " "]
    },
    { locations: ["0", "0"],
      blocked: [" "], 
      hits: [" ", " "]
    },
    { locations: ["0", "0"],
      blocked: [" "],
      hits: [" ", " "]
    },
  
    { locations: ["0", "0", "0"],
      blocked: [" "],
      hits: [" ", " ", " "]
    },
    { locations: ["0", "0", "0"],
      blocked: [" "],
      hits: [" ", " ", " "]
    },

    { locations: ["0", "0", "0", "0"],
      blocked: [" "],
      hits: [" ", " ", " ", " "]
    },
  ],
  // сюда будут записаны координаты кораблей расставленых игроком
  useShips : [
    { locations: ["0"], //координаты
      hits: [" "]       // попадания
    },
    { locations: ["0"],
      hits: [" "]
    },
    { locations: ["0"],
      hits: [" "]
    },
    { locations: ["0"],
      hits: [" "]
    },
  
    { locations: ["0", "0"],
      hits: [" ", " "]
    },
    { locations: ["0", "0"],
      hits: [" ", " "]
    },
    { locations: ["0", "0"],
      hits: [" ", " "]
    },
  
    { locations: ["0", "0", "0"],
      hits: [" ", " ", " "]
    },
    { locations: ["0", "0", "0"],
      hits: [" ", " ", " "]
    },
  
    { locations: ["0", "0", "0", "0"],
      hits: [" ", " ", " ", " "]
    },
  ],
   // кнопка начало боя , после клика менять положения кораблей нельзя
  fire: function () {
    console.log("Начало боя")
  },

   // определяем подбит корабль или нет
  isSunk: function (ship) {
    for (let a = 0; a < ship.locations.length; a++) {
      if(ship.hits[a] !== "hit") {
        return false;
      };
    }
    return true;
  },

  // получаем ряд
  getRow: function(position) {
    return this.arrayRow.indexOf(position[0].charAt(1))
  },

  // получаем колонку
  getColumn: function (position) {
    return this.arrayRow.indexOf(position[0].charAt(2))
  },

  //  Делю координатную сетку на зоны, где логика получения запретных зон одинаковая.
  // Это углы, верхний ряд координат, нижний ряд, левый и правый ряды координат.

  // Для ячейки 00, получаем координаты, где не должны распологаться корабли.  
  getblockedUpperLeftCorner: function (r, c, loc, dire) { // r - ряд, с- колонка, loc - координаты корабля, dire - расположение корабля (вертикальное - 0 или горизонтальное - 1) 
    let arrayBlocked = [];
    if (loc.length == 1) {
 
      arrayBlocked.push("A" + r + (c + 1));
      arrayBlocked.push("A" + (r + 1) + c);
      arrayBlocked.push("A" + (r + 1) + (c + 1));
 
    } else if (loc.length == 2) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c + 2));
        arrayBlocked.push("A" + (r + 1) + c);
        arrayBlocked.push("A" + (r + 1) + (c + 1));
        arrayBlocked.push("A" + (r + 1) + (c + 2));
 
      } else {
 
        arrayBlocked.push("A" + r + (c + 1));
        arrayBlocked.push("A" + (r + 1) + (c + 1));
        arrayBlocked.push("A" + (r + 2) + c);
        arrayBlocked.push("A" + (r + 2) + (c + 1));
 
      }
    } else if (loc.length == 3) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c + 3));
        arrayBlocked.push("A" + (r + 1) + c);
        arrayBlocked.push("A" + (r + 1) + (c + 1));
        arrayBlocked.push("A" + (r + 1) + (c + 2));
        arrayBlocked.push("A" + (r + 1) + (c + 3));
 
      } else {
 
        arrayBlocked.push("A" + r + (c + 1));
        arrayBlocked.push("A" + (r + 1) + (c + 1));
        arrayBlocked.push("A" + (r + 2) + (c + 1));
        arrayBlocked.push("A" + (r + 3) + (c + 1));
        arrayBlocked.push("A" + (r + 3) + c);
 
      }
 
    } else {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c + 4));
        arrayBlocked.push("A" + (r + 1) + c);
        arrayBlocked.push("A" + (r + 1) + (c + 1));
        arrayBlocked.push("A" + (r + 1) + (c + 2));
        arrayBlocked.push("A" + (r + 1) + (c + 3));
        arrayBlocked.push("A" + (r + 1) + (c + 4));
 
      } else {
 
        arrayBlocked.push("A" + r + (c + 1));
        arrayBlocked.push("A" + (r + 1) + (c + 1));
        arrayBlocked.push("A" + (r + 2) + (c + 1));
        arrayBlocked.push("A" + (r + 3) + (c + 1));
        arrayBlocked.push("A" + (r + 4) + c);
        arrayBlocked.push("A" + (r + 4) + (c + 1));
 
      }
    }

    return arrayBlocked
  },
  // Для ячейки 09, получаем координаты, где не должны распологаться корабли. 
  getblockedUpperRightCorner: function (r, c, loc, dire) { // r - ряд, с- колонка, loc - координаты корабля, dire - расположение корабля (вертикальное - 0 или горизонтальное - 1)
    let arrayBlocked = [];
    if (loc.length == 1) {
 
      arrayBlocked.push("A" + r + (c - 1));
      arrayBlocked.push("A" + (r + 1) + (c - 1));
      arrayBlocked.push("A" + (r + 1) + c);
 
    } else if (loc.length == 2) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c - 2));
        arrayBlocked.push("A" + (r + 1) + (c - 2));
        arrayBlocked.push("A" + (r + 1) + (c - 1));
        arrayBlocked.push("A" + (r + 1) + c);
 
      } else {
 
        arrayBlocked.push("A" + r + (c - 1));
        arrayBlocked.push("A" + (r + 1) + (c - 1));
        arrayBlocked.push("A" + (r + 2) + (c - 1));
        arrayBlocked.push("A" + (r + 2) + c);
 
      }
    } else if (loc.length == 3) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c - 3));
        arrayBlocked.push("A" + (r + 1) + (c - 3));
        arrayBlocked.push("A" + (r + 1) + (c - 2));
        arrayBlocked.push("A" + (r + 1) + (c - 1));
        arrayBlocked.push("A" + (r + 1) + c);
 
      } else {
 
        arrayBlocked.push("A" + r + (c - 1));
        arrayBlocked.push("A" + (r + 1) + (c - 1));
        arrayBlocked.push("A" + (r + 2) + (c - 1));
        arrayBlocked.push("A" + (r + 3) + (c - 1));
        arrayBlocked.push("A" + (r + 3) + c);
 
      }
 
    } else {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c - 4));
        arrayBlocked.push("A" + (r + 1) + (c - 4));
        arrayBlocked.push("A" + (r + 1) + (c - 3));
        arrayBlocked.push("A" + (r + 1) + (c - 2));
        arrayBlocked.push("A" + (r + 1) + (c - 1));
        arrayBlocked.push("A" + (r + 1) + c);
 
      } else {
 
        arrayBlocked.push("A" + r + (c - 1));
        arrayBlocked.push("A" + (r + 1) + (c - 1));
        arrayBlocked.push("A" + (r + 2) + (c - 1));
        arrayBlocked.push("A" + (r + 3) + (c - 1));
        arrayBlocked.push("A" + (r + 4) + (c - 1));
        arrayBlocked.push("A" + (r + 4) + c);
 
      }
 
    }
    return arrayBlocked
  },
  // Для ячейки 90, получаем координаты, где не должны распологаться корабли.
  getblockedLowLeftCorner: function (r, c, loc, dire) { 
    let arrayBlocked = [];
    if (loc.length == 1) {

      arrayBlocked.push("A" + (r - 1) + c);
      arrayBlocked.push("A" + (r - 1) + (c + 1));
      arrayBlocked.push("A" + r + (c + 1));

    } else if (loc.length == 2) {

      if (dire == 0) {

        arrayBlocked.push("A" + (r - 1) + c);
        arrayBlocked.push("A" + (r - 1) + (c + 1));
        arrayBlocked.push("A" + (r - 1) + (c + 2));
        arrayBlocked.push("A" + r + (c + 2));

      } else {

        arrayBlocked.push("A" + (r - 1) + c);        //80
        arrayBlocked.push("A" + (r - 1) + (c + 1));  //81
        arrayBlocked.push("A" + (r - 1) + (c + 2));  //82
        arrayBlocked.push("A" + r + (c + 2));        //92

      }

    } else if (loc.length == 3) {

      if (dire == 0) {

        arrayBlocked.push("A" + (r - 1) + c);
        arrayBlocked.push("A" + (r - 1) + (c + 1));
        arrayBlocked.push("A" + (r - 1) + (c + 2));
        arrayBlocked.push("A" + (r - 1) + (c + 3));
        arrayBlocked.push("A" + r + (c + 3));

      } else {

        arrayBlocked.push("A" + (r - 3) + c);
        arrayBlocked.push("A" + (r - 3) + (c + 1));
        arrayBlocked.push("A" + (r - 2) + (c + 1));
        arrayBlocked.push("A" + (r - 1) + (c + 1));
        arrayBlocked.push("A" + r + (c + 1));

      }

    } else {

      if (dire == 0) {

        arrayBlocked.push("A" + (r - 1) + c);
        arrayBlocked.push("A" + (r - 1) + (c + 1));
        arrayBlocked.push("A" + (r - 1) + (c + 2));
        arrayBlocked.push("A" + (r - 1) + (c + 3));
        arrayBlocked.push("A" + (r - 1) + (c + 4));
        arrayBlocked.push("A" + r + (c + 4));

      } else {

        arrayBlocked.push("A" + (r - 4) + c);
        arrayBlocked.push("A" + (r - 4) + (c + 1));
        arrayBlocked.push("A" + (r - 3) + (c + 1));
        arrayBlocked.push("A" + (r - 2) + (c + 1));
        arrayBlocked.push("A" + (r - 1) + (c + 1));
        arrayBlocked.push("A" + r + (c + 1));

      }

    }
    return arrayBlocked
  },
  // Для ячейки 99, получаем координаты, где не должны распологаться корабли.
  getblockedLowRightCorner: function (r, c, loc, dire) { 
    let arrayBlocked = [];
    if (loc.length == 1) {

      arrayBlocked.push("A" + (r - 1) + (c - 1));
      arrayBlocked.push("A" + (r - 1) + c);
      arrayBlocked.push("A" + r + (c - 1));

    } else if (loc.length == 2) {

      if (dire == 0) {

        arrayBlocked.push("A" + r + (c - 2));
        arrayBlocked.push("A" + (r - 1) + (c - 2));
        arrayBlocked.push("A" + (r - 1) + (c - 1));
        arrayBlocked.push("A" + (r - 1) + c);

      } else {

        arrayBlocked.push("A" + r + (c - 1));
        arrayBlocked.push("A" + (r - 1) + (c - 1));
        arrayBlocked.push("A" + (r - 2) + (c - 1));
        arrayBlocked.push("A" + (r - 2) + c);

      }
    } else if (loc.length == 3) {

      if (dire == 0) {
          
        arrayBlocked.push("A" + r + (c - 3));
        arrayBlocked.push("A" + (r - 1) + (c - 3));
        arrayBlocked.push("A" + (r - 1) + (c - 2));
        arrayBlocked.push("A" + (r - 1) + (c - 1));
        arrayBlocked.push("A" + (r - 1) + c);

      } else {

        arrayBlocked.push("A" + r + (c - 1));
        arrayBlocked.push("A" + (r - 1) + (c - 1));
        arrayBlocked.push("A" + (r - 2) + (c - 1));
        arrayBlocked.push("A" + (r - 3) + (c - 1));
        arrayBlocked.push("A" + (r - 3) + c);

      }

    } else {

      if (dire == 0) {

        arrayBlocked.push("A" + r + (c - 4));
        arrayBlocked.push("A" + (r - 1) + (c - 4));
        arrayBlocked.push("A" + (r - 1) + (c - 3));
        arrayBlocked.push("A" + (r - 1) + (c - 2));
        arrayBlocked.push("A" + (r - 1) + (c - 1));
        arrayBlocked.push("A" + (r - 1) + c);

      } else {

        arrayBlocked.push("A" + r + (c - 1));
        arrayBlocked.push("A" + (r - 1) + (c - 1));
        arrayBlocked.push("A" + (r - 2) + (c - 1));
        arrayBlocked.push("A" + (r - 3) + (c - 1));
        arrayBlocked.push("A" + (r - 4) + (c - 1));
        arrayBlocked.push("A" + (r - 4) + c);

      }

    }
    return arrayBlocked
  },
  // Для ячейки от 01 - 08, получаем координаты, где не должны распологаться корабли.
  getblockedUpperHorizontalPosition: function (r, c, loc, dire) {
    let arrayBlocked = [];
    if (loc.length == 1) {
 
      arrayBlocked.push("A" + r + (c - 1));       //00
      arrayBlocked.push("A" + (r + 1) + (c - 1)); //10
      arrayBlocked.push("A" + (r + 1) + c);       //11
      arrayBlocked.push("A" + (r + 1) + (c + 1)); //12
      arrayBlocked.push("A" + r  + (c + 1));      //02
      
    } else if (loc.length == 2) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c - 1));       //00
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //10
        arrayBlocked.push("A" + (r + 1) + c);       //11
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //12
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //13
        arrayBlocked.push("A" + r  + (c + 2));      //03
 
      } else {
 
        arrayBlocked.push("A" + r + (c - 1));       //00
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //10
        arrayBlocked.push("A" + (r + 2) + (c - 1)); //20
        arrayBlocked.push("A" + (r + 2) + c);       //21
        arrayBlocked.push("A" + (r + 2) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //12
        arrayBlocked.push("A" + r + (c + 1));       //02
 
      }
    } else if (loc.length == 3) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c - 1));       //00
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //10
        arrayBlocked.push("A" + (r + 1) + c);       //11
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //12
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //13
        arrayBlocked.push("A" + (r + 1) + (c + 3)); //14
        arrayBlocked.push("A" + r  + (c + 3));      //04
 
      } else {
 
        arrayBlocked.push("A" + r + (c - 1));       //00
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //10
        arrayBlocked.push("A" + (r + 2) + (c - 1)); //20
        arrayBlocked.push("A" + (r + 3) + (c - 1)); //30
        arrayBlocked.push("A" + (r + 3) + c);       //31
        arrayBlocked.push("A" + (r + 3) + (c + 1)); //32
        arrayBlocked.push("A" + (r + 2) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //12
        arrayBlocked.push("A" + r + (c + 1));       //02
 
      }
 
    } else {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r + (c - 1));       //00
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //10
        arrayBlocked.push("A" + (r + 1) + c);       //11
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //12
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //13
        arrayBlocked.push("A" + (r + 1) + (c + 3)); //14
        arrayBlocked.push("A" + (r + 1) + (c + 4)); //15
        arrayBlocked.push("A" + r  + (c + 4));      //05
 
      } else {
 
        arrayBlocked.push("A" + r + (c - 1));       //00
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //10
        arrayBlocked.push("A" + (r + 2) + (c - 1)); //20
        arrayBlocked.push("A" + (r + 3) + (c - 1)); //30
        arrayBlocked.push("A" + (r + 4) + (c - 1)); //40
        arrayBlocked.push("A" + (r + 4) + c);       //41
        arrayBlocked.push("A" + (r + 4) + (c + 1)); //42
        arrayBlocked.push("A" + (r + 3) + (c + 1)); //32
        arrayBlocked.push("A" + (r + 2) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //12
        arrayBlocked.push("A" + r + (c + 1));       //02
 
      }
 
    }
    return arrayBlocked
  },
  // Для ячейки от 10 - 80, получаем координаты, где не должны распологаться корабли.
  getblockedleftVerticalPosition: function (r, c, loc, dire) { 
    let arrayBlocked = [];
    if (loc.length == 1) {
 
      arrayBlocked.push("A" + (r - 1) + c);       //00
      arrayBlocked.push("A" + (r - 1) + (c + 1)); //01
      arrayBlocked.push("A" + r + (c + 1));       //11
      arrayBlocked.push("A" + (r + 1) + (c + 1)); //21
      arrayBlocked.push("A" + (r + 2)  + c);      //20
      
    } else if (loc.length == 2) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + c);       //00
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //01
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //02
        arrayBlocked.push("A" + r + (c + 2));       //12
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //22
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //21
        arrayBlocked.push("A" + (r + 1) + c);       //20
          
      } else {
 
        arrayBlocked.push("A" + (r - 1) + c);       //00
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //01
        arrayBlocked.push("A" + r + (c + 1));       //11
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //21
        arrayBlocked.push("A" + (r + 2) + (c + 1)); //31
        arrayBlocked.push("A" + (r + 2) + c);       //30
 
       }

    } else if (loc.length == 3) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + c);       //00
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //01
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //02
        arrayBlocked.push("A" + (r - 1) + (c + 3)); //03
        arrayBlocked.push("A" + r + (c + 3));       //13
        arrayBlocked.push("A" + (r + 1) + (c + 3)); //23
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //22
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //21
        arrayBlocked.push("A" + (r + 1) + c);       //20
          
      } else {
 
        arrayBlocked.push("A" + (r - 1) + c);       //00
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //01
        arrayBlocked.push("A" + r + (c + 1));       //11
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //21
        arrayBlocked.push("A" + (r + 2) + (c + 1)); //31
        arrayBlocked.push("A" + (r + 3) + (c + 1)); //41
        arrayBlocked.push("A" + (r + 3) + c);       //40
 
      }
 
    } else {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + c);       //00
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //01
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //02
        arrayBlocked.push("A" + (r - 1) + (c + 3)); //03
        arrayBlocked.push("A" + (r - 1) + (c + 4)); //04
        arrayBlocked.push("A" + r + (c + 4));       //14
        arrayBlocked.push("A" + (r + 1) + (c + 4)); //24
        arrayBlocked.push("A" + (r + 1) + (c + 3)); //23
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //22
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //21
        arrayBlocked.push("A" + (r + 1) + c);       //20
 
      } else {
 
        arrayBlocked.push("A" + (r - 1) + c);       //00
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //01
        arrayBlocked.push("A" + r + (c + 1));       //11
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //21
        arrayBlocked.push("A" + (r + 2) + (c + 1)); //31
        arrayBlocked.push("A" + (r + 3) + (c + 1)); //41
        arrayBlocked.push("A" + (r + 4) + (c + 1)); //51
        arrayBlocked.push("A" + (r + 3) + c);       //50
 
      }
 
    }
    return arrayBlocked;
  },
  // Для ячейки от 19 - 89, получаем координаты, где не должны распологаться корабли.
  getblockedRigthVerticalPosition: function (r, c, loc, dire) { 
    let arrayBlocked = [];
    if (loc.length == 1) {
 
      arrayBlocked.push("A" + (r - 1) + c);       //09
      arrayBlocked.push("A" + (r - 1) + (c - 1)); //08
      arrayBlocked.push("A" + r  + (c - 1));      //18
      arrayBlocked.push("A" + (r + 1) + (c - 1)); //28
      arrayBlocked.push("A" + (r + 1) + c);       //08
      
 
    } else if (loc.length == 2) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //09
        arrayBlocked.push("A" + (r - 1) + c); //08
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //07
        arrayBlocked.push("A" + r  + (c - 1)); //17
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //27
        arrayBlocked.push("A" + (r + 1) + c); //28
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //29
 
      } else {
 
        arrayBlocked.push("A" + (r - 1) + c);       //09
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //08
        arrayBlocked.push("A" + r  + (c - 1));      //18
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //28
        arrayBlocked.push("A" + (r + 2) + (c - 1)); //38
        arrayBlocked.push("A" + (r + 2) + c);       //39
 
      }
    } else if (loc.length == 3) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + (c + 2));   //09
        arrayBlocked.push("A" + (r - 1) + (c + 1));   //08
        arrayBlocked.push("A" + (r - 1) + c);         //07
        arrayBlocked.push("A" + (r - 1) + (c -1));    //06
        arrayBlocked.push("A" + r + (c - 1));         //16
        arrayBlocked.push("A" + (r + 1) + (c -1));    //26
        arrayBlocked.push("A" + (r + 1) + c );        //27
        arrayBlocked.push("A" + (r + 1) + (c + 1));   //28
        arrayBlocked.push("A" + (r + 1) + (c + 2));   //29
 
      } else {
 
        arrayBlocked.push("A" + (r - 1) + c);        //09
        arrayBlocked.push("A" + (r - 1) + (c -1));   //08
        arrayBlocked.push("A" + r + (c - 1));        //18
        arrayBlocked.push("A" + (r + 1) + (c -1));   //28
        arrayBlocked.push("A" + (r + 2) + (c -1));   //38
        arrayBlocked.push("A" + (r + 3) + (c -1));   //48
        arrayBlocked.push("A" + (r + 4) + c );       //49
 
      }
 
    } else {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + (c + 3));   //09
        arrayBlocked.push("A" + (r - 1) + (c + 2));   //08
        arrayBlocked.push("A" + (r - 1) + (c + 1));   //07
        arrayBlocked.push("A" + (r - 1) + c);         //06
        arrayBlocked.push("A" + (r - 1) + (c + 1));   //05
        arrayBlocked.push("A" + r + (c - 1));         //15
        arrayBlocked.push("A" + (r + 1) + (c -1));    //25
        arrayBlocked.push("A" + (r + 1) + c );        //26
        arrayBlocked.push("A" + (r + 1) + (c + 1));   //27
        arrayBlocked.push("A" + (r + 1) + (c + 2));   //28
        arrayBlocked.push("A" + (r + 1) + (c + 3));   //29
 
      } else {
 
        arrayBlocked.push("A" + (r - 1) + c);        //09
        arrayBlocked.push("A" + (r - 1) + (c -1));   //08
        arrayBlocked.push("A" + r + (c - 1));        //18
        arrayBlocked.push("A" + (r + 1) + (c -1));   //28
        arrayBlocked.push("A" + (r + 2) + (c -1));   //38
        arrayBlocked.push("A" + (r + 3) + (c -1));   //48
        arrayBlocked.push("A" + (r + 4) + (c -1));   //58
        arrayBlocked.push("A" + (r + 4) + c );       //59
 
      }
 
    }
    return arrayBlocked
  },
  // Для ячейки от 91 - 98, получаем координаты, где не должны распологаться корабли.
  getblockedLowHorizontalPosition: function (r, c, loc, dire) { 
    let arrayBlocked = [];
    if (loc.length == 1) {
 
      arrayBlocked.push("A" + r  + (c - 1));      //90
      arrayBlocked.push("A" + (r - 1) + (c - 1)); //80
      arrayBlocked.push("A" + (r - 1) + c);       //81
      arrayBlocked.push("A" + (r - 1) + (c + 1)); //82
      arrayBlocked.push("A" + (r + 1) + c);       //92
      
    } else if (loc.length == 2) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r  + (c - 1));      //90
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //80
        arrayBlocked.push("A" + (r - 1) + c);       //81
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //82
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //83
        arrayBlocked.push("A" + r + (c + 2));       //93
 
      } else {
 
        arrayBlocked.push("A" + r + (c - 1));       //90
        arrayBlocked.push("A" + (r - 1)  + (c - 1));//80
        arrayBlocked.push("A" + (r - 1) + c);       //81
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //82
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //83
        arrayBlocked.push("A" + r  + (c + 2));      //93
 
      }
 
    } else if (loc.length == 3) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r  + (c - 1));      //90
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //80
        arrayBlocked.push("A" + (r - 1) + c);       //81
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //82
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //83
        arrayBlocked.push("A" + (r - 1) + (c + 3)); //84
        arrayBlocked.push("A" + r + (c + 3));       //94
 
      } else {
 
        arrayBlocked.push("A" + (r + 2) + (c -1));   //90
        arrayBlocked.push("A" + (r + 1) + (c -1));   //80
        arrayBlocked.push("A" + r + (c - 1));        //70
        arrayBlocked.push("A" + (r - 1) + (c -1));   //60
        arrayBlocked.push("A" + (r - 1) + c);        //61
        arrayBlocked.push("A" + (r - 1) + (c + 1));  //62
        arrayBlocked.push("A" + r + (c + 1));        //72
        arrayBlocked.push("A" + (r + 1) + (c + 1));  //82
        arrayBlocked.push("A" + (r + 2) + (c + 1));  //92
 
      }
 
    } else {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + r  + (c - 1));      //90
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //80
        arrayBlocked.push("A" + (r - 1) + c);       //81
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //82
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //83
        arrayBlocked.push("A" + (r - 1) + (c + 3)); //84
        arrayBlocked.push("A" + (r - 1) + (c + 4)); //85
        arrayBlocked.push("A" + r + (c + 4));       //95
 
      } else {
 
        arrayBlocked.push("A" + (r + 3) + (c -1));   //90
        arrayBlocked.push("A" + (r + 2) + (c -1));   //80
        arrayBlocked.push("A" + (r + 1) + (c -1));   //70
        arrayBlocked.push("A" + r + (c - 1));        //60
        arrayBlocked.push("A" + (r - 1) + (c -1));   //50
        arrayBlocked.push("A" + (r - 1) + c);        //51
        arrayBlocked.push("A" + (r - 1) + (с + 1));  //52
        arrayBlocked.push("A" + r + (c + 1));        //62
        arrayBlocked.push("A" + (r + 1) + (c + 1));  //72
        arrayBlocked.push("A" + (r + 2) + (c + 1));  //82
        arrayBlocked.push("A" + (r + 3) + (c + 1));  //92
 
      }
 
    }
    return arrayBlocked
  },
  // Для ячейки от 11 - 88 (центр), получаем координаты, где не должны распологаться корабли.
  getblockedCentre: function (r, c, loc, dire) {
    let arrayBlocked = [];
    if (loc.length == 1) {
 
      arrayBlocked.push("A" + (r - 1) + c);
      arrayBlocked.push("A" + (r - 1) + (c - 1));
      arrayBlocked.push("A" + r + (c - 1));
      arrayBlocked.push("A" + (r - 1) + (c + 1));
      arrayBlocked.push("A" + r + (c + 1));
      arrayBlocked.push("A" + (r + 1) + (c - 1));
      arrayBlocked.push("A" + (r + 1) + (c + 1));
      arrayBlocked.push("A" + (r + 1) + c);
    
    } else if (loc.length == 2) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //00
        arrayBlocked.push("A" + (r - 1) + c );      //01
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //02
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //03
        arrayBlocked.push("A" + r  + (c + 2));      //13
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //23
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 1) + c);       //21
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //20
        arrayBlocked.push("A" + r + (c - 1));       //10
 
      } else {
 
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //00
        arrayBlocked.push("A" + (r - 1) + c );      //01
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //02
        arrayBlocked.push("A" + r  + (c + 1));      //12
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 2) + (c + 2)); //32
        arrayBlocked.push("A" + (r + 2) + c);       //31
        arrayBlocked.push("A" + (r + 2) + (c - 1)); //30
        arrayBlocked.push("A" + (r + 1)  + (c - 1));//20
        arrayBlocked.push("A" + r + (c - 1));       //10
 
      }
 
    } else if (loc.length == 3) {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //00
        arrayBlocked.push("A" + (r - 1) + c );      //01
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //02
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //03
        arrayBlocked.push("A" + (r - 1) + (c + 3)); //04
        arrayBlocked.push("A" + r + (c + 3));       //14
        arrayBlocked.push("A" + (r + 1) + (c + 3)); //24
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //23
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 1) + c);       //21
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //20
        arrayBlocked.push("A" + r + (c - 1));       //10
 
      } else {
 
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //00
        arrayBlocked.push("A" + (r - 1) + c );      //01
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //02
        arrayBlocked.push("A" + r  + (c + 1));      //12
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 2) + (c + 1)); //32
        arrayBlocked.push("A" + (r + 3) + (c + 1)); //42
        arrayBlocked.push("A" + (r + 3) + c );      //41
        arrayBlocked.push("A" + (r + 3) + (c - 1)); //40
        arrayBlocked.push("A" + (r + 2) + (c - 1)); //30
        arrayBlocked.push("A" + (r + 1)  + (c - 1));//20
        arrayBlocked.push("A" + r + (c - 1));       //10
 
      }
 
    } else {
 
      if (dire == 0) {
 
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //00
        arrayBlocked.push("A" + (r - 1) + c );      //01
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //02
        arrayBlocked.push("A" + (r - 1) + (c + 2)); //03
        arrayBlocked.push("A" + (r - 1) + (c + 3)); //04
        arrayBlocked.push("A" + (r - 1) + (c + 4)); //05
        arrayBlocked.push("A" + r + (c + 4));       //15
        arrayBlocked.push("A" + (r + 1) + (c + 4)); //25
        arrayBlocked.push("A" + (r + 1) + (c + 3)); //24
        arrayBlocked.push("A" + (r + 1) + (c + 2)); //23
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 1) + c);       //21
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //20
        arrayBlocked.push("A" + r + (c - 1));       //10
 
      } else {
 
        arrayBlocked.push("A" + (r - 1) + (c - 1)); //00
        arrayBlocked.push("A" + (r - 1) + c );      //01
        arrayBlocked.push("A" + (r - 1) + (c + 1)); //02
        arrayBlocked.push("A" + r  + (c + 1));      //12
        arrayBlocked.push("A" + (r + 1) + (c + 1)); //22
        arrayBlocked.push("A" + (r + 2) + (c + 1)); //32
        arrayBlocked.push("A" + (r + 3) + (c + 1)); //42
        arrayBlocked.push("A" + (r + 4) + (c + 1)); //52
        arrayBlocked.push("A" + (r + 4) + c );      //51
        arrayBlocked.push("A" + (r + 4) + (c - 1)); //50
        arrayBlocked.push("A" + (r + 3) + (c - 1)); //40
        arrayBlocked.push("A" + (r + 2) + (c - 1)); //30
        arrayBlocked.push("A" + (r + 1) + (c - 1)); //20
        arrayBlocked.push("A" + r + (c - 1));       //10
 
      }
 
    }
    return arrayBlocked;
  },

  // получаем ячейки в которых не должно быть кораблей
  getblockedPosition: function (loc) {
    let newShipBlocked = [];
    let rowPos = this.getRow(loc);
    let columnPos =this.getColumn(loc);
 
    if (loc.length == 1) {
      if (this.upperLeftCorner.includes(loc[0]) ) {
 
        return newShipBlocked = this.getblockedUpperLeftCorner (rowPos, columnPos, loc, this.direct);
         
      } else if (this.upperRightCorner.includes(loc[0]) ) {
 
        return newShipBlocked = this.getblockedUpperRightCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowLeftCorner.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowLeftCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowRightCorner.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowRightCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.upperHorizontalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedUpperHorizontalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.leftVerticalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedleftVerticalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.rigthVerticalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedRigthVerticalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowHorizontalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowHorizontalPosition(rowPos, columnPos, loc, this.direct);
 
      } else {
 
        return newShipBlocked = this.getblockedCentre(rowPos, columnPos, loc, this.direct);
 
      }
 
    } else if (loc.length == 2) {
 
      if (this.upperLeftCorner.includes(loc[0]) ) {
 
        return newShipBlocked = this.getblockedUpperLeftCorner (rowPos, columnPos, loc, this.direct);
         
      } else if (this.upperRightCorner.includes(loc[0]) ) {
 
        return newShipBlocked = this.getblockedUpperRightCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowLeftCorner.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowLeftCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowRightCorner.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowRightCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.upperHorizontalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedUpperHorizontalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.leftVerticalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedleftVerticalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.rigthVerticalPosition.includes(loc[1])) {
 
        return newShipBlocked = this.getblockedRigthVerticalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowHorizontalPosition.includes(loc[1])) {
 
        return newShipBlocked = this.getblockedLowHorizontalPosition(rowPos, columnPos, loc, this.direct);
 
      } else {
 
        return newShipBlocked = this.getblockedCentre(rowPos, columnPos, loc, this.direct);
 
      }
 
    } else if (loc.length == 3) {
 
      if (this.upperLeftCorner.includes(loc[0]) ) {
 
        return newShipBlocked = this.getblockedUpperLeftCorner (rowPos, columnPos, loc, this.direct);
         
      } else if (this.upperRightCorner.includes(loc[0]) ) {
 
        return newShipBlocked = this.getblockedUpperRightCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowLeftCorner.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowLeftCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowRightCorner.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowRightCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.upperHorizontalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedUpperHorizontalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.leftVerticalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedleftVerticalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.rigthVerticalPosition.includes(loc[2])) {
 
        return newShipBlocked = this.getblockedRigthVerticalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowHorizontalPosition.includes(loc[2])) {
 
        return newShipBlocked = this.getblockedLowHorizontalPosition(rowPos, columnPos, loc, this.direct);
 
      } else {
 
        return newShipBlocked = this.getblockedCentre(rowPos, columnPos, loc, this.direct);
 
      }
 
    } else if (loc.length == 4) {
 
      if (this.upperLeftCorner.includes(loc[0]) ) {
 
        return newShipBlocked = this.getblockedUpperLeftCorner (rowPos, columnPos, loc, this.direct);
         
      } else if (this.upperRightCorner.includes(loc[0]) ) {
 
        return newShipBlocked = this.getblockedUpperRightCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowLeftCorner.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowLeftCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.lowRightCorner.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedLowRightCorner(rowPos, columnPos, loc, this.direct);
 
      } else if (this.upperHorizontalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedUpperHorizontalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.leftVerticalPosition.includes(loc[0])) {
 
        return newShipBlocked = this.getblockedleftVerticalPosition(rowPos, columnPos, loc, this.direct);
 
      } else if (this.rigthVerticalPosition.includes(loc[3])) {
        return newShipBlocked = this.getblockedRightVerticalPosition(rowPos, columnPos, loc, this.direct);
 
 
      } else if (this.lowHorizontalPosition.includes(loc[3])) {
 
        return newShipBlocked = this.getblockedLowHorizontalPosition(rowPos, columnPos, loc, this.direct);
 
      } else {
 
        return newShipBlocked = this.getblockedCentre(rowPos, columnPos, loc, this.direct);
 
      }
 
    }
    
  },

  // вертикальное или горизонтальное расположение корабля
  generateShip: function (regular) {
    let direction = Math.floor(Math.random() * 2 ); 
    this.direct = direction;
    let row, col;
    if (regular === 1) {
      row = Math.floor(Math.random() * this.boardSize );
      col = Math.floor(Math.random() * this.boardSize );
    } else {
       
      if (direction === 0) {
        row = Math.floor(Math.random() * this.boardSize );
        col = Math.floor(Math.random() * (this.boardSize - regular));
      
      } else {
        row = Math.floor(Math.random() * (this.boardSize - regular));
        col = Math.floor(Math.random() * this.boardSize );
        
      };
    };
   
    // Получаем координаты кораблей
    let newShipLocations = [];
    for (let i = 0; i < regular; i++) {
      if (direction === 0) {
        newShipLocations.push('A' + row + (col + i));
        
      } else {
        newShipLocations.push('A' + (row + i) + col);
      }
    };
    return newShipLocations;

  },

 

  // Проверяем координаты кораблей на пересечение
  collision: function (location) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = model.compShips[i];
      for (let j = 0; j < location.length; j++) {
        if (ship.locations.indexOf(location[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },

  distance: function (dist) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = model.compShips[i];
      for (let j = 0; j < dist.length; j++) {
        if (ship.locations.indexOf(dist[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },
  //
  generateShipLocations: function() {
    let location;
    let blockPos;
    let a = 0;
    for (let viewShip of model.shipLength) {
      
      for (let i = 0; i < viewShip; i++) {
        do {
          location = this.generateShip(viewShip); // получаем координаты
          blockPos = this.getblockedPosition(location);  // получаем координаты, где не должно быть кораблей
        } while (this.collision(location) || this.distance(blockPos)); // проверяется условия,  пересекаются коробли или находится координаты корабля находятся в красной зоне  
        this.compShips[a].locations = location; // если всё хорошо,  то добовляем координаты в массив 
        this.compShips[a].blocked = blockPos; // добавляем в массив красную зону корабля
        break;
      }
      a++;
    }
    
  }

};



var view = {
  // метод получает сообщения в облости сообщений
  displayMessage: function (msg) {
    var messageText = document.getElementById("message-text");
    messageText.innerHTML = msg; 
  },

  // метод получает маркер попаданий
  displayHits: function (location) {
    var locationHits = document.getElementById(location);
    locationHits.setAttribute("class", "hit");
  },

  // метод получает маркер поромахов
  displayMisses: function (location) {
    var locationMiss = document.getElementById(location);
    locationMiss.setAttribute("class", "miss");
  },
  //показать место корабля
  displayUseShip: function (location) {
    var locationUseShip = document.getElementById(location);
    locationUseShip.setAttribute("class", "useShip");
  },

};
// расстановка кораблей рандомным способом
model.generateShipLocations();  
// console.log(model.compShips)


// Сообщение приветствие
view.displayMessage(msg);
// Клик в поле attack
// в зависимости от попадания  или промаха на поле появляеться соответствующая иконка и выводится соответствующее сообщение  
attack.addEventListener("click", function (event) {
  for(let i = 0; i <model.numShips; i++) {  
    var currentCompShip = model.compShips[i];
    var index = currentCompShip.locations.indexOf(event.target.id);
    if (index >= 0) {
      currentCompShip.hits[index] = "hit";
      view.displayHits(event.target.id);
      view.displayMessage(msgHit);
      if(isSunk(currentCompShip)) {
        model.shipsSunk ++ ;
        view.displayMessage(msgSunk);
      }
      return
    } else {
      view.displayMisses(event.target.id);
      view.displayMessage(msgMiss);
    }
  }
});


// расставляет корабли игрок (клик в правом игравом поле)
observe.addEventListener("click", function(event) {
  console.log(event.target.id);
  view.displayUseShip(event.target.id)
} )



