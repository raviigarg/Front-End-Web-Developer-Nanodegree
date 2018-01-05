/*
 * Create a list that holds all of your cards
 */

let cardValues = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

let openedCards = []; //list for storing uncovered cards
let matchedCards = []; //list for storing matched cards
let seconds = 0; //variable for time
let score = 3; //variable for current score
let endTime = 0;
let counter = 0; //variable for moves
let isFirstClick = true;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//Timer for the game
var gameTime = setInterval(gameTimer, 1000);
function gameTimer(){
    seconds++;
    let hour = Math.floor(seconds/3600); //least integer function
    let minute = Math.floor((seconds - hour*3600)/60);
    let second = seconds - (hour*3600 + minute*60);
    endTime = hour + " : " + minute + " : " +second;
    document.getElementById("timer").innerHTML = endTime;
}

//Reset timer for new game
function resetTimer() {
	clearInterval(gameTime);
	seconds = 0;
	gameTime = setInterval(gameTimer, 1000);
}

//New memory game function
function newMemoryGame() {
	let cards = $('.card');
	cards.removeClass('open show match'); //hide all images
	$('#winningModal').css('display', 'none');
	$('#losingModal').css('display', 'none');
	$('#third-star').css('color', '#000');
	$('#second-star').css('color', '#000');
	$('#timer').text('0 : 0 : 0');
	$('.moves').text(0);

	let newCardValues = shuffle(cardValues); //function call to shuffle
	let presentCards = cards.children('i');
	presentCards.removeClass('fa-diamond fa-paper-plane-o fa-anchor fa-bolt fa-cube fa-leaf fa-bicycle fa-bomb');
	presentCards.each(function(index, item) {
			$(item).addClass(newCardValues[index]); //assign re-shuffled classes
	});
	
	//reset global variables and counter
	openedCards = [];
	matchedCards = [];
	score=3;
	counter = 0;
	isFirstClick =true;
	clearInterval(gameTime);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//function for add classes or remove classes from cards
function showCard(card) {
	card.addClass('open show');
}

function hideCard(card) {
	card.removeClass('open show');
}

function openOnMatch(card){
	card.addClass('match');
	card.removeClass('open show');
}

//function for modals
function winningModal() {
	let winModal = $('#winningModal');
	$('#winHeading').text('Congratulations! You Won!');
	$('#winningText').text('With '+counter+' Moves and '+score+' Stars');
	$('#winningTime').text(endTime);
	$('#winningMessage').text('Wooooo!');
	winModal.css('display', 'block');
}

function losingModal() {
	let loseModal = $('#losingModal');
	$('#loseHeading').text('You\'ve lost badly.');
	$('#losingText').text('No of Moves over');
	loseModal.css('display', 'block');
}

//function to incease moves
function increaseMoves() {
	counter +=1;
	$('.moves').text(counter);
	// decrease the score depending on the amount of moves that were already made
	if(counter===30) {
		$('#third-star').css('color', '#fefefe');
		score = 2;
	}else if(counter===40) {
		$('#second-star').css('color', '#fefefe');
		score = 1;
	}
	else if(counter===50) {
		losingModal();
	}
}

//function to add cards to open card when clicked
function addToOpen(card) {
	let cardPicture = card.children('i').attr('class').split(' ')[1];
	openedCards.push(cardPicture);
}

function checkMatch() {
	if(openedCards.length==2) { //if two cards are open
		if(openedCards[0]==openedCards[1]) { //of images of bothcards are same
			openOnMatch($('.card:has(.'+openedCards[0]+')'));
			matchedCards.push(openedCards[0]);
			if(matchedCards.length===8) {
				clearInterval(gameTime);
				winningModal();
			}
		}
		else { //if cards are different hide them
			hideCard($('.card:has(.'+openedCards[0]+')'));
			hideCard($('.card:has(.'+openedCards[1]+')'));
		}
		openedCards = [];
	}
}

$('.card').click(function(evt){
	if(isFirstClick) {
		resetTimer();
		isFirstClick = false;
	}

	let card = $(evt.target);
	if(!card.hasClass('match') && !card.hasClass('open') && !card.hasClass('show')) {
		if(openedCards.length<=1) { //if there is one or no card open
			showCard(card);
			increaseMoves();
			addToOpen(card);
			setTimeout(checkMatch, 800);//some time to the user to see both card
		}
	}
});

//when user click on reset start new game
$('.restart').click(newMemoryGame);

//when page refreshes start new game
$(document).ready(newMemoryGame);
$(document).ready(gameTime);

//when user click on play again button start new game
$('.play').click(newMemoryGame);