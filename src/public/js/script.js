const opponentTurn = 'Ход противника',
    playerTurn = 'Ход игрока';

const TOKEN = 'bgbGlMMuf4aibTplL2UzwSvIqFL-i1dFSMVFMsQjpxc';

let currentStatus;

let eventSource;
const u = new URL('http://10.10.101.1:3000/.well-known/mercure');
u.searchParams.append('topic', window.location.href);
eventSource = new EventSource(u, {withCredentials: true});

let changeGameBoard = function (e) {
    console.log(JSON.parse(e.data));

    currentStatus = JSON.parse(e.data);

    if (currentStatus.isPlayerTurn === true) {
        $("#turn").text(playerTurn);
    } else {
        $("#turn").text(opponentTurn);
    }

    currentStatus.gameBoard.forEach(function (item, x) {
        Object.keys(item).forEach(function (y) {
            $("#" + x + "_" + y).text(item[y]);
        });
    });
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
        data: JSON.stringify({
            "url": window.location.href + '/status',
        }),
        success: function (data) {
            console.log(data.hash);
            hash = data.hash;
        },
        contentType: "application/json",
        dataType: "json"
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

// let showOverlay = function () {
//     $('td').unbind('mouseover');
//     $(document).unbind('mouseup');
//
//     $('#overlay').fadeIn(297, function () {
//         $('#alphabet')
//             .css('display', 'block')
//             .animate({opacity: 1}, 198);
//     });
//
//     $(document).click(function (e) {
//         let div = $("#alphabet");
//
//         if (!div.is(e.target) && div.has(e.target).length === 0) {
//             $(document).unbind('click');
//
//             $('#alphabet').animate({opacity: 0}, 198, function () {
//                 $(this).css('display', 'none');
//                 $('#overlay').fadeOut(297);
//             });
//         }
//     })
//
//     $('.letter').click(function () {
//         console.log($(this).text())
//
//         $('#alphabet').animate({opacity: 0}, 198, function () {
//             $(this).css('display', 'none');
//             $('#overlay').fadeOut(297);
//         });
//
//         return $(this).text();
//     })
// }
//
// let cells;
// let newLetter;
// $('td').mousedown(function () {
//     if (!currentStatus || currentStatus.isPlayerTurn !== true) {
//         return;
//     }
//
//     if (hash !== undefined) {
//         $('td').removeClass('green');
//         cells = [$(this).attr('id')];
//         newLetter = null;
//
//         $(this).addClass("green");
//         $('td').mouseover(function () {
//             if (cells.includes($(this).attr('id'))) {
//                 cells = removeLetters(cells, cells.indexOf($(this).attr('id')) + 1)
//             } else {
//                 $(this).addClass("green");
//                 cells.push($(this).attr('id'));
//             }
//         });
//
//         $(document).mouseup(showOverlay());
//     }
// })

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
        error: function () {
            alert(data);
            alert(JSON.parse(data));
        },
        contentType: "application/json",
        dataType: "json"
    });
}

let cells;
let letter;
$('td').mousedown(function () {
    if (hash !== undefined) {
        $('td').removeClass('green'); // clear
        cells = [$(this).attr('id')]; // set first letter

        $(this).addClass("green"); // set green to current cell

        $('td').mouseover(function () { // add new event
            if (cells.includes($(this).attr('id'))) {
                cells = removeLetters(cells, cells.indexOf($(this).attr('id')) + 1)
            } else {
                $(this).addClass("green");
                cells.push($(this).attr('id'));
            }
        });

        $(document).mouseup(function () { //
            $('td').unbind('mouseover');
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
