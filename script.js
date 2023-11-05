// весь скрипт — это одна большая функция
(function(){
	
	//  объявляем объект, внутри которого будет происходить основная механика игры
	var Memory = {

		// создаём карточку
		init: function(cards1, cards2){
			//  получаем доступ к классам
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			// собираем из карточек массив — игровое поле
			this.cardsArray = $.merge(cards1, cards2);
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// и раскладываем их
			this.setup();
		},

		// как перемешиваются карточки
		shuffleCards: function(cardsArray){
			// используем встроенный метод .shuffle
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		// раскладываем карты
		setup: function(){
			// подготавливаем код с карточками на страницу
			this.html = this.buildHTML();
			// добавляем код в блок с игрой
			this.$game.html(this.html);
			// получаем доступ к сформированным карточкам
			this.$memoryCards = $(".card");
			// на старте мы не ждём переворота второй карточки
			this.paused = false;
			// на старте у нас нет перевёрнутой первой карточки
			this.guess = null;
			// добавляем элементам на странице реакции на нажатия
			this.binding();
		},

		// как элементы будут реагировать на нажатия
		binding: function(){
			// обрабатываем нажатие на карточку
			this.$memoryCards.on("click", this.cardClicked);
			// и нажатие на кнопку перезапуска игры
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},

		// что происходит при нажатии на карточку
		cardClicked: function(){
			// получаем текущее состояние родительской переменной
			var _ = Memory;
			// и получаем доступ к карточке, на которую нажали
			var $card = $(this);
			// если карточка уже не перевёрнута и мы не нажимаем на ту же самую карточку второй раз подряд
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				// переворачиваем её
				$card.find(".inside").addClass("picked");
				// если мы перевернули первую карточку
				if(!_.guess){
					// то пока просто запоминаем её
					_.guess = $(this).attr("data-id");
				// если мы перевернули вторую и она совпадает с первой
				} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
					// оставляем обе на поле перевёрнутыми и показываем анимацию совпадения
					$(".picked").addClass("matched");
					// обнуляем первую карточку
					_.guess = null;
						// если вторая не совпадает с первой
						} else {
							// обнуляем первую карточку
							_.guess = null;
							// не ждём переворота второй карточки
							_.paused = true;
							// ждём полсекунды и переворачиваем всё обратно
							setTimeout(function(){
								$(".picked").removeClass("picked");
								Memory.paused = false;
							}, 600);
						}
				// если мы перевернули все карточки
				if($(".matched").length == $(".card").length){
					// показываем победное сообщение
					_.win();
				}
			}
		},

		// показываем победное сообщение
		win: function(){
			// не ждём переворота карточек
			this.paused = true;
			// плавно показываем модальное окно с предложением сыграть ещё
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		// показываем модальное окно
		showModal: function(){
			// плавно делаем блок с сообщением видимым
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		// прячем модальное окно
		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		// перезапуск игры
		reset: function(){
			// прячем модальное окно с поздравлением
			this.hideModal();
			// перемешиваем карточки
			this.shuffleCards(this.cardsArray);
			// раскладываем их на поле
			this.setup();
			// показываем игровое поле
			this.$game.show("slow");
		},

		// Тасование Фишера–Йетса - https://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			var counter = array.length, temp, index;
			while (counter > 0) {
				index = Math.floor(Math.random() * counter);
				counter--;
				temp = array[counter];
				array[counter] = array[index];
				array[index] = temp;
				}
			return array;
		},

		// код, как добавляются карточки на страницу
		buildHTML: function(){
			// сюда будем складывать HTML-код
			var frag = '';
			// перебираем все карточки подряд
			this.$cards.each(function(k, v){
				// добавляем HTML-код для очередной карточки
				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
				<div class="front"><img src="'+ v.img +'"\
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80"\
				alt="Codepen" /></div></div>\
				</div>';
			});
			// возвращаем собранный код
			return frag;
		}
	};
	
	// карточки
	var cards1 = [
		{	
			// название
			name: "tea",
			// адрес картинки
			img: "src/tea.jpg",
			// порядковый номер пары
			id: 1,
		},
		{
			name: "cup",
			img: "src/cup.jpg",
			id: 2
		},
		{
			name: "razor",
			img: "src/razor.jpg",
			id: 3
		},
		{
			name: "rice",
			img: "src/rice.jpg",
			id: 4
		}, 
		{
			name: "shampoo",
			img: "src/shampoo.jpg",
			id: 5
		},
		{
			name: "brush",
			img: "src/brush.jpg",
			id: 6
		},
		{
			name: "photoshop",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/164px-Adobe_Photoshop_CC_icon.svg.png",
			id: 7
		},
		{
			name: "python",
			img: "https://www.python.org/static/img/python-logo@2x.png",
			id: 8
		},
/*		{
			name: "rails",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Ruby_On_Rails_Logo.svg/425px-Ruby_On_Rails_Logo.svg.png",
			id: 9
		},
		{
			name: "sass",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/213px-Sass_Logo_Color.svg.png",
			id: 10
		},
		{
			name: "sublime",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Breezeicons-apps-48-sublime-text.svg/160px-Breezeicons-apps-48-sublime-text.svg.png",
			id: 11
		},
		{
			name: "wordpress",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/WordPress_logo.svg/440px-WordPress_logo.svg.png",
			id: 12
		},*/
	];
	
	var cards2 = [
		{	
			// название
			name: "tea",
			// адрес картинки
			img: "src/eco-tea.jpg",
			// порядковый номер пары
			id: 1,
		},
		{
			name: "cup",
			img: "src/eco-cup.jpg",
			id: 2
		},
		{
			name: "razor",
			img: "src/eco-razor.jpg",
			id: 3
		},
		{
			name: "rice",
			img: "src/eco-rice.jpg",
			id: 4
		}, 
		{
			name: "shampoo",
			img: "src/eco-shampoo.jpg",
			id: 5
		},
		{
			name: "brush",
			img: "src/eco-brush.jpg",
			id: 6
		},
		{
			name: "photoshop",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/164px-Adobe_Photoshop_CC_icon.svg.png",
			id: 7
		},
		{
			name: "python",
			img: "https://www.python.org/static/img/python-logo@2x.png",
			id: 8
		},
/*		{
			name: "rails",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Ruby_On_Rails_Logo.svg/425px-Ruby_On_Rails_Logo.svg.png",
			id: 9
		},
		{
			name: "sass",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/213px-Sass_Logo_Color.svg.png",
			id: 10
		},
		{
			name: "sublime",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Breezeicons-apps-48-sublime-text.svg/160px-Breezeicons-apps-48-sublime-text.svg.png",
			id: 11
		},
		{
			name: "wordpress",
			img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/WordPress_logo.svg/440px-WordPress_logo.svg.png",
			id: 12
		},*/
	];
	
	// запускаем игру
	Memory.init(cards1, cards2);
})();



