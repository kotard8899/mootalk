const socket = io();
let chatMsg = '';
let myId = '';
let once = true;

$('.start-btn').click((e) => { 
    e.preventDefault();
    socket.connect()
    socket.emit('start');
    $('body').addClass('start');
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
});

socket.on('currentId',(id) => {
    if(once) {
        myId = id;
        once = false;
    }
})
$(document).on('keypress',(e) => {
    if(e.which == 13) {
        sendMsg(e);
    }
});
$('#submitBtn').click((e) => sendMsg(e));

socket.on('outputMsg',({chatMsg,id}) => {
    outputMsg(chatMsg, id);
});

socket.on('sysMsg',(msg) => {
    outputMsg(msg, 'system')
});

$('.leave-btn').click((e) => { 
    e.preventDefault();
    socket.emit('gone');
    $('html, body').animate({scrollTop: '0px'}, 300);
    $('body').removeClass('start');
    $('.text').remove();
    $('html, body').animate({scrollTop: '0px'}, 300);
    once = true;
});

const sendMsg = (e) => {
    e.preventDefault();
    chatMsg = $('#msg').val();
    if (!chatMsg) {
        return;
    }
    socket.emit('inputMsg', chatMsg);
    $('#msg').val('');
} 

const outputMsg = (msg, id) => {
    let tempClass = 'stranger';
    if (id === myId) { 
        tempClass = 'me'
    }
    if (id === 'system') {
        tempClass = 'system'
    }
    const div = $('<div></div>')
        .addClass("text")
        .addClass(tempClass)
        .html(msg);

    $('.chat-wrapper').append(div);
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
} 