const opponentTurn = 'Ход противника',
    playerTurn = 'Ваш ход';

const TOKEN = 'nGV9zLB5Ak8i6bn0lwRcn3xIGL84A1hiizqfCIFfNmE';

let currentStatus;
let lastTurn;
let currentTurnEndTime;

let eventSource;
const u = new URL('http://10.10.101.1:3000/.well-known/mercure');
u.searchParams.append('topic', window.location.href);
eventSource = new EventSource(u, {withCredentials: true});


var myVar = setInterval(myTimer, 1000);

function myTimer() {
    if (!currentTurnEndTime) {
        return;
    }
    var now = new Date();
    now.setHours(now.getHours() - 3);
    if (currentTurnEndTime.getTime() > now.getTime()) {
        var date = new Date(currentTurnEndTime.getTime() - now.getTime());
        $("#timeClock").text(date.getMinutes() + ':' + date.getSeconds());
    }
}

let changeGameBoard = function (e) {
    console.log(JSON.parse(e.data));
    currentStatus = JSON.parse(e.data);


    /** game board */
    currentStatus.gameBoard.forEach(function (item, x) {
        Object.keys(item).forEach(function (y) {
            $("#" + x + "_" + y).text(item[y]);
        });
    });
    /** end game board */


    /** lastTurn */
    if (currentStatus.lastTurn) {
        $('td.cell').removeClass('green'); // clear

        currentStatus.lastTurn.forEach(letter => {
            $('#' + letter['x'] + '_' + letter['y']).addClass("green");
        })
    }
    /** end lastTurn */


    /** score */
    $('#player_score').text('Счёт: ' + currentStatus.score.playerScore);
    $('#opponent_score').text('Счёт: ' + currentStatus.score.opponentScore);
    /** end score */


    /** current turn */
    if (currentStatus.isPlayerTurn === true) {
        $("#turn").text(playerTurn);
    } else {
        $("#turn").text(opponentTurn);
    }
    /** end current turn */


    /** game over */
    if (currentStatus.isGameOver) {
        if (currentStatus.score.playerScore > currentStatus.score.opponentScore) {
            alert('Игра закончена. Вы выиграли!');
        } else if(currentStatus.score.playerScore < currentStatus.score.opponentScore) {
            alert('Игра закончена. Вы проиграли.');
        } else if (currentStatus.score.playerScore === currentStatus.score.opponentScore) {
            alert('Игра закончена. Ничья.');
        }

        return;
    }
    /** end game over */


    /** current turn end time */
    currentTurnEndTime = new Date(currentStatus.currentTurnEndTime);
    console.log(currentTurnEndTime);
    /** end current turn end time */
}
eventSource.onmessage = changeGameBoard;
eventSource.onerror = function (e) {
    console.log('Fail!');
};

window.onload = function () {
    $.ajax({
        url: 'http://10.10.100.1/api/player',
        headers: {
            'X-AUTH-TOKEN': TOKEN
        },
        crossDomain: true,
        type: "POST",
        contentType: "application/json",
        dataType: "json",

        data: JSON.stringify({
            "url": window.location.href + '/status',
        }),
        success: function (data) {
            console.log(data.hash);
            hash = data.hash;
        },
    });
}

window.onbeforeunload = function () {
    eventSource.close();
}


let removeLetters = function (word, index) {
    let deleted = word.splice(index);

    deleted.forEach(function (item) {
        $('#' + item).removeClass("green");
    })

    return word;
}


let makeMove = function (data) {
    $.ajax({
        url: 'http://10.10.100.1/api/player/' + hash + '/game/move',
        headers: {
            'X-AUTH-TOKEN': TOKEN
        },
        crossDomain: true,
        type: "POST",
        data: JSON.stringify({
            "letters": data,
        }),
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            $('td.cell').removeClass('green');

            switch (JSON.parse(data.responseText).message) {
                case 'Player not found.':
                    alert('Игра еще не найдена.')
                    break;
                case 'Failed to create new player.':
                    alert('Не удалось создать пользлвателя.')
                    break;
                case 'The player does not have a game.':
                    alert('Игра еще не найдена.')
                    break;
                case 'There is no such word.':
                    alert('Такого слова не существует.')
                    break;
                case 'The player no longer has any hints.':
                    alert('Подсказки закончились.')
                    break;
                case 'This word has already been used.':
                    alert('Это слово уже использовалось.')
                    break;
                case 'Failed to found any word.':
                    alert('Не получилось найти слово')
                    break;
                case 'This is not the player\'s turn.':
                    alert('Сейчас ход противника.')
                    break;
                case 'The letters must be located in adjacent cells.':
                    alert('Буквы должны располагаться в соседних клетках.')
                    break;
                default:
                    alert('Ошибка.')
                    break;
            }
        },
        contentType: "application/json",
        dataType: "json"
    });
}


let getHint = function () {
    if ($('.hint-count').text() < 1) {
        alert('Подсказки закончились.');
        return;
    }
    $.ajax({
        url: 'http://10.10.100.1/api/player/' + hash + '/game/hint',
        headers: {
            'X-AUTH-TOKEN': TOKEN
        },
        crossDomain: true,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            console.log(data);
            makeMove(data);
            $('.hint-count').text($('.hint-count').text() - 1);
        },
        error: function (data) {
            console.log(data);
            switch (JSON.parse(data.responseText).message) {
                case 'Player not found.':
                    alert('Игра еще не найдена.')
                    break;
                case 'The player does not have a game.':
                    alert('Игра еще не найдена.')
                    break;
                case 'Failed to found any word.':
                    alert('Не получилось найти слово')
                    break;
                default:
                    alert('Ошибка.')
                    break;
            }
        },
    });
}

let cells;
let letter;
$('td.cell').mousedown(function () {
    if (hash !== undefined) {
        $('td.cell').removeClass('green'); // clear
        cells = [$(this).attr('id')]; // set first letter

        $(this).addClass("green"); // set green to current cell

        $('td.cell').mouseover(function () { // add new event
            if (cells.includes($(this).attr('id'))) {
                cells = removeLetters(cells, cells.indexOf($(this).attr('id')) + 1)
            } else {
                $(this).addClass("green");
                cells.push($(this).attr('id'));
            }
        });

        $(document).mouseup(function () { //
            $('td.cell').unbind('mouseover');
            $(document).unbind('mouseup'); // remove created events

            console.log(cells);

            $('#overlay').fadeIn(297, function () { // overlay animation
                $('#alphabet')
                    .css('display', 'block')
                    .animate({opacity: 1}, 198);
            });

            $('.letter').click(function () { // add new event
                $('.letter').unbind('click'); // remove this event
                console.log($(this).text())

                /** closing animation */
                $('#alphabet').animate({opacity: 0}, 198, function () {
                    $(this).css('display', 'none');
                    $('#overlay').fadeOut(297);
                });

                letter = $(this).text();

                // cells & letter logic
                let data = [];
                let hasEmptyCell = false;
                cells.forEach(function (cell) {
                    let cellLetter = $("#" + cell).text();
                    let x = cell.split("_").shift();
                    let y = cell.split("_").pop();

                    if (!cellLetter) {
                        if (hasEmptyCell) {
                            return;
                        }
                        hasEmptyCell = true;
                        cellLetter = letter;
                    }

                    data.push({
                        'x': parseInt(x),
                        'y': parseInt(y),
                        'letter': cellLetter,
                    })
                })
                if (!hasEmptyCell) {
                    return;
                }

                console.log(data);
                // todo make move query

                makeMove(data);
            })

            $('#alphabet__close').click(function () {
                $('#alphabet__close').unbind('click');
                $('#alphabet').animate({opacity: 0}, 198, function () {
                    $(this).css('display', 'none');
                    $('#overlay').fadeOut(297);
                });
            });
        });
    }
})

$('div.hint').click(function () {
    getHint();
})
