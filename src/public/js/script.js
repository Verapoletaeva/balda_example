let hash;
let gameBoard;
let url = 'http://10.10.101.1:3002/.well-known/mercure?topic=' + encodeURIComponent(window.location.href);
// const evtSource = new EventSource("http://10.10.101.1/ssedemo.php", { withCredentials: true } );
// const evtSource = new EventSource("ssedemo.php");
// evtSource.onmessage = function(event) {
//     const newElement = document.createElement("li");
//     const eventList = document.getElementById('list');
//
//     newElement.innerHTML = "message: " + event.data;
//     eventList.appendChild(newElement);
// }
const eventSource = new EventSource(url, {withCredentials: true});
eventSource.onmessage = event => {
    // Will be called every time an update is published by the server
    console.log(JSON.parse(event.data));
}

// window.onload = function () {
//     $.ajax({
//         url: 'http://10.10.100.1/api/player',
//         headers: {
//             'X-AUTH-TOKEN': 'bgbGlMMuf4aibTplL2UzwSvIqFL-i1dFSMVFMsQjpxc'
//         },
//         crossDomain: true,
//         type: "POST",
//         data: JSON.stringify({
//             "url": window.location.href + '/status',
//         }),
//         success: function (data) {
//             alert(data.hash);
//             hash = data.hash;
//         },
//         contentType: "application/json",
//         dataType: "json"
//     });
// }
