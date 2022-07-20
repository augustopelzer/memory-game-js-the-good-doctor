const qntImgs = 15; //número definido de imagens no banco /img
const memoryGameId = document.getElementById('memory-game');
const restartButton = document.getElementById('restartbtn');
const nivelDropDown = document.getElementById('niveldropdown');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false; //para evitar bugs bloqueia tabuleiro
let countFlippedCard = 0; //Contador de cartas viradas para encerrar o jogo
let selectorTrusted = 0; //Indicador da quantidade de cartas da seleção de nível

//NOVA FUNÇÃO DE ESTRUTURA  INICIALIZANDO O DOM

(function createBoard() {
    let description;
    var selector = nivelDropDown.options[nivelDropDown.selectedIndex].value;
    countFlippedCard = 0; //Contador de cartas viradas para encerrar o jogo é reiniciado
    selectorTrusted = 0; //reinicialização do seletor
    var selectorClass='';
    
    switch(selector){
        case 'easy': 
            selectorTrusted=3;
            selectorClass='easy';
            break;
        case 'medium': 
            selectorTrusted=6;
            selectorClass='medium';
            break;
        case 'hard': 
            selectorTrusted=12;
            selectorClass='hard';
            break;
        default:
            alert('Digite apenas as opções válidas!'); //prevent
            createBoard();
    }

    //criar um array de seleção das imagens do banco de imagens
    var randomImages = [];
    
    for (let i=0; i<qntImgs; i++){
        let repetido = true
        let valor = 0;
        while (repetido){
            valor = Math.floor(Math.random() * qntImgs)
            if (!randomImages.includes(valor)){
                repetido=false;
            }
        }
        randomImages.push(valor);
    }

    for (let i=0; i<selectorTrusted; i++){
        const divContainer = document.createElement('div');
        const divContainer2 = document.createElement('div');
	    const imgFront = document.createElement('img');
        const imgFront2 = document.createElement('img');
	    const imgBack = document.createElement('img');
        const imgBack2 = document.createElement('img');

        //definição do div
        divContainer.classList.add('card', selectorClass);
        divContainer.setAttribute('data-card',randomImages[i]);
        
        divContainer2.classList.add('card', selectorClass);
        divContainer2.setAttribute('data-card',randomImages[i]);

        //definição da img do card-front
        imgFront.setAttribute('src', 'assets/img/'+randomImages[i]+'.jpg');
        imgFront.setAttribute('alt', 'face da carta');
        imgFront.classList.add('card-front');

        imgFront2.setAttribute('src', 'assets/img/'+randomImages[i]+'.jpg');
        imgFront2.setAttribute('alt', 'face da carta');
        imgFront2.classList.add('card-front');

        //definição da img do card-back
        imgBack.setAttribute('src', 'assets/img/b.jpg');
        imgBack.setAttribute('alt', 'verso da carta');
        imgBack.classList.add('card-back');

        imgBack2.setAttribute('src', 'assets/img/b.jpg');
        imgBack2.setAttribute('alt', 'verso da carta');
        imgBack2.classList.add('card-back');

        //Montando elementos na div
        divContainer.appendChild(imgFront);
        divContainer.appendChild(imgBack);
        
        divContainer2.appendChild(imgFront2);
        divContainer2.appendChild(imgBack2);

        //inserindo elementos 2x no tabuleiro
        memoryGameId.appendChild(divContainer);
        memoryGameId.appendChild(divContainer2);

    }

    //A declaração de cards só pode ser feita depois que o DOM for montado com os cards por isso ele deixa de ser const e passa a ser var
    var cards = document.querySelectorAll('.card');
    
    shuffle(selectorTrusted, cards);

    //para cada elemento card ele executa o flipCard() quando clicar
    cards.forEach((card) => {
        card.addEventListener('click', flipCard)
    });
    
    //restartButton.addEventListener('click', (resetBoard, createBoard));
    document.getElementById('restartbtn').onclick = function() {
        while (memoryGameId.firstChild) {
              memoryGameId.removeChild(memoryGameId.firstChild);
        }
        resetBoard();
        createBoard();
        window.scrollBy(9999, 9999); //move até a posição mais infeiror disponível evidenciando o jogo
    }
})();

//função para adicionar uma classe flip ou remover quando chamar a função
function flipCard() {
    if (lockBoard) return; //bloqueio do unflipCards para impedir clicar antes do tempo
    if (this === firstCard) return; //previne bug de clicar duas vezes na mesma carta

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    hasFlippedCard = false; //reseta o valor de hasFlippedCard
    checkForMath(); //verifica se cartas são as mesmas e desabilita
}

function checkForEnd(){
    if (countFlippedCard == selectorTrusted){
        //timer para permitir animação de virada da carta antes da resposta.
        setTimeout(() =>{
            alert("Parabéns! Você terminou o jogo!\n Caso deseje continuar jogando:\n selecione o Level e clique em Restart!\n As peças e posições irão mudar!");
            window.scrollBy(-9999, -9999); //move até a posição inicial disponível evidenciando o MENU
        },1500);
    }
}

//verifica se cartas são as mesmas e desabilita além de chamar o checkForEnd acima() para encerrar o jogo se estiver no fim
function checkForMath() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        disableCards();
        countFlippedCard++;
        checkForEnd();
        return;
    }
    unflipCards();
}

//função de desabilitar cartas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

//função de desvirar cartas
function unflipCards() {
    lockBoard = true;

    setTimeout(() =>{
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

//REINICIALIZAÇÃO DO BOARD
function resetBoard() {
    //desestruturação do array
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//EMBARALHAR AS CARTAS
// usar uma função vai modificar a order do css
function shuffle(nivel=3, cards){
    cards.forEach((card) =>{
        let randomPosition = Math.floor(Math.random() * (nivel*2)); //sorteia números de 0 a 11
        card.style.order = randomPosition;
    })
} //função chamada após a definição do Board .memory-game e suas filhas no DOM