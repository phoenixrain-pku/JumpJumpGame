var chara = 1;
var canvas = document.getElementById("canvas");
var Height = window.screen.height * 0.8;
var Width = Math.min(window.screen.height * 0.6, window.screen.width) * 0.8;
canvas.height = Height;
canvas.width = Width;

var context = canvas.getContext("2d");
var backgroundimg = new Image();
var Ldoodle = new Image();
var Rdoodle = new Image();
var Lfrog = new Image();
var Rfrog = new Image();
var Mouse = new Image();
var Title = new Image();
var Select = new Image();
Ldoodle.src = "img/Ldoodle.png";
Rdoodle.src = "img/Rdoodle.png";
Lfrog.src = "img/Lfrog.png";
Rfrog.src = "img/Rfrog.png";
Mouse.src = "img/mouse.png";
Title.src = "img/title.png";
Select.src = "img/select.png";
backgroundimg.src = "img/bg.jpg";
backgroundimg.onload = function (ev) {
    var pattern = context.createPattern(backgroundimg, "repeat");
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(canvas.width / 2 - 30, canvas.height - 60);
    context.lineTo(canvas.width / 2 + 30, canvas.height - 60);
    context.lineWidth = 10;
    context.strokeStyle = "green";
    context.lineCap = "round";
    Player.x = canvas.width / 2 - 30;
    Player.y = canvas.height - 125;
    context.drawImage(Rdoodle, canvas.width / 2 - 30, canvas.height-290);
    context.drawImage(Rfrog, canvas.width / 2 - 30,canvas.height-170);
    context.drawImage(Title, Player.x + 30 - 150, Player.y - 400);
    context.drawImage(Select, Player.x + 30 - 100, Player.y+60);

    alert("您好，欢迎来到跳跳游戏！排行榜已上线，快来挑战吧！\n请理性游戏，不要沉迷；请理性刷分，不要攻击数据库！\n衷心感谢您的游玩，您的愉悦是本游戏最大的荣幸！");
    
    function startanimation() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        CreatePanel(context);
        context.fillStyle = pattern;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "bold 20px Arial";
        context.textAlign = "left";
        context.fillStyle = "#a0522d";
        context.fillText("Score: " + parseInt(GameData.score), 20, 30);
        // animation(context);
        jump();
        collide();
        gamescroll();
        move(context);

        if (Player.y > canvas.height) {
            window.cancelAnimationFrame(startanimation);
            var userName = prompt("Game Over!\nYour score is: " + parseInt(GameData.score) + "\n请留下尊姓大名!", "Anyomous User");
            alert(userName+", 你的得分是: " + parseInt(GameData.score)+"\n太棒了! 再来一局吧?");

            var userdata = {
                name :        userName, 
                score :       GameData.score
            };
            $.ajax({
                type :        "POST",
                async :       false,
                url :         "https://phoenix-jump-backend.zhengnq.com/insert",
                contentType : "application/json",
                dataType :    "json",
                data :        JSON.stringify(userdata),
                error :       function(jqXHR, textStatus, errorThrown){
                                  console.info(jqXHR.responseText);
                              }
            });

            $.ajax({
                 type :       "GET",
                 async :      false,
                 url :        "https://phoenix-jump-backend.zhengnq.com/query", 
                 success :    function(scores){
                                  alert(scores);
                              },
                 error :      function(jqXHR, textStatus, errorThrown){
                                  console.info(jqXHR.responseText);
                              }
            });
        
            location.reload();
        } else {
            requestAnimationFrame(startanimation);
            changeposition();
        }

    }
    var start1 = document.getElementById("startBTN");
    var start2 = document.getElementById("startBTN2");
    start1.addEventListener("click", function () {
                
        chara = 1;
        window.requestAnimationFrame(startanimation);
        start1.style.display = "none";
        start2.style.display = "none";
        Player.x = canvas.width / 2 - 30;
        Player.y = canvas.height - 220;
        
        panelgroup.push({
            x: Player.x+30,
            y: Player.y+90,
            status: 1,
            pcolor: "green",
            plength: 60
        });

    })
    start2.addEventListener("click", function () {
        
        chara = 2;
        window.requestAnimationFrame(startanimation);
        start1.style.display = "none";
        start2.style.display = "none";
        Player.x = canvas.width / 2 - 30;
        Player.y = canvas.height - 170;
        panelgroup.push({
            x: Player.x+30,
            y: Player.y+90,
            status: 1,
            pcolor: "green",
            plength: 60
        });
    })

};


function getLocation(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: (x - bbox.left) * (canvas.width / bbox.width),
        y: (y - bbox.top) * (canvas.height / bbox.height)
    };
}

canvas.onmousemove = function (e) {

    var location = getLocation(e.clientX, e.clientY);
    mouseX = parseInt(location.x) - 31;
    mouseY = parseInt(location.y);
};


