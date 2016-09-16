$(".puzzles.show").ready(function() {
  // on page load, trigger init function
  window.onload = function() {
    init();
  };

  var difficulty = window.level;
  var hover = '#006699';
  var puzzleCanvas;
  var stage;
  var puzzleImage;
  var pieces;
  var puzzleWidth;
  var puzzleHeight;
  var pieceWidth;
  var pieceHeight;
  var currentPiece;
  var currentDropPiece;
  var playerMouse;
  var winning = document.getElementById('winning');

  // set offset for cross-browser support
  function getOffset(element, ancestor) {
    var left = 0,
        top = 0;
    while (element != ancestor) {
      left += element.offsetLeft;
      top += element.offsetTop;
      element = element.parentNode;
    }
    return { left: left, top: top };
  }

  function getMousePosition (event) {
    event = event || window.event;
    if (event.pageX) {
      return { x: event.pageX, y: event.pageY };
    }
    return {
      x: event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft,
      y: event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop
    };
  }
  // init function, loads image
  function init(){
      puzzleImage = new Image();
      puzzleImage.addEventListener('load',onImage,false);
      puzzleImage.src = window.mapImg;
  }
  // sets puzzle piece sizes based on difficulty
  function onImage(e){
      pieceWidth = Math.floor(puzzleImage.width / difficulty)
      pieceHeight = Math.floor(puzzleImage.height / difficulty)
      puzzleWidth = pieceWidth * difficulty;
      puzzleHeight = pieceHeight * difficulty;
      setCanvas();
      initPuzzle();
  }
  // sets canvas for script
  function setCanvas(){
      puzzleCanvas = document.getElementById('canvas');
      stage = puzzleCanvas.getContext('2d');
      puzzleCanvas.width = puzzleWidth;
      puzzleCanvas.height = puzzleHeight;
      puzzleCanvas.offset = getOffset(puzzleCanvas, document.body);
  }
  // draws image on canvas
  function initPuzzle(){
      winning.innerHTML = '';
      pieces = [];
      playerMouse = {x:0,y:0};
      currentPiece = null;
      currentDropPiece = null;
      stage.drawImage(puzzleImage, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
      buildPieces();
  }
  // builds pieces for puzzle
  function buildPieces(){
      var i;
      var piece;
      var xPos = 0;
      var yPos = 0;
      for(i = 0;i < difficulty * difficulty;i++){
          piece = {};
          piece.sx = xPos;
          piece.sy = yPos;
          pieces.push(piece);
          xPos += pieceWidth;
          if(xPos >= puzzleWidth){
              xPos = 0;
              yPos += pieceHeight;
          }
      }
      // shuffles puzzle on view
      shufflePuzzle();
  }
  // shuffles puzzle pieces
  function shufflePuzzle(){
      pieces = shuffleArray(pieces);
      stage.clearRect(0,0,puzzleWidth,puzzleHeight);
      var i;
      var piece;
      var xPos = 0;
      var yPos = 0;
      for(i = 0;i < pieces.length;i++){
          piece = pieces[i];
          piece.xPos = xPos;
          piece.yPos = yPos;
          stage.drawImage(puzzleImage, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
          xPos += pieceWidth;
          if(xPos >= puzzleWidth){
              xPos = 0;
              yPos += pieceHeight;
          }
      }
      document.onmousedown = onPuzzleClick;
  }

  function shuffleArray(o){
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }

  function onPuzzleClick(e){
      var position = getMousePosition(e);
      playerMouse.x = position.x - puzzleCanvas.offset.left;
      playerMouse.y = position.y - puzzleCanvas.offset.top;
      currentPiece = checkPieceClicked();
      if(currentPiece != null){
          stage.clearRect(currentPiece.xPos,currentPiece.yPos,pieceWidth,pieceHeight);
          stage.save();
          stage.globalAlpha = .9;
          stage.drawImage(puzzleImage, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, playerMouse.x - (pieceWidth / 2), playerMouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
          stage.restore();
          document.onmousemove = updatePuzzle;
          document.onmouseup = pieceDropped;
      }
  }

  function checkPieceClicked(){
      var i;
      var piece;
      for(i = 0;i < pieces.length;i++){
          piece = pieces[i];
          if(playerMouse.x < piece.xPos || playerMouse.x > (piece.xPos + pieceWidth) || playerMouse.y < piece.yPos || playerMouse.y > (piece.yPos + pieceHeight)){
              //PIECE NOT HIT
          }
          else{
              return piece;
          }
      }
      return null;
  }
   // update puzzle as user makes moves
  function updatePuzzle(e){
      var position = getMousePosition(e);
      playerMouse.x = position.x - puzzleCanvas.offset.left;
      playerMouse.y = position.y - puzzleCanvas.offset.top;
      currentDropPiece = null;
      stage.clearRect(0,0,puzzleWidth,puzzleHeight);
      var i;
      var piece;
      for(i = 0;i < pieces.length;i++){
          piece = pieces[i];
          if(piece == currentPiece){
              continue;
          }
          stage.drawImage(puzzleImage, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
          if(currentDropPiece == null){
              if(playerMouse.x < piece.xPos || playerMouse.x > (piece.xPos + pieceWidth) || playerMouse.y < piece.yPos || playerMouse.y > (piece.yPos + pieceHeight)){
                  //NOT OVER
              }
              else{
                  currentDropPiece = piece;
                  stage.save();
                  stage.globalAlpha = .4;
                  stage.fillStyle = hover;
                  stage.fillRect(currentDropPiece.xPos,currentDropPiece.yPos,pieceWidth, pieceHeight);
                  stage.restore();
              }
          }
      }
      stage.save();
      stage.globalAlpha = .6;
      stage.drawImage(puzzleImage, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, playerMouse.x - (pieceWidth / 2), playerMouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
      stage.restore();
  }

  function pieceDropped(e){
      document.onmousemove = null;
      document.onmouseup = null;
      if(currentDropPiece != null){
          var tmp = {xPos:currentPiece.xPos,yPos:currentPiece.yPos};
          currentPiece.xPos = currentDropPiece.xPos;
          currentPiece.yPos = currentDropPiece.yPos;
          currentDropPiece.xPos = tmp.xPos;
          currentDropPiece.yPos = tmp.yPos;
      }
      resetPuzzleAndCheckWin();
  }
  // logic for winning and puzzle progress
  function resetPuzzleAndCheckWin(){
      stage.clearRect(0,0,puzzleWidth,puzzleHeight);
      var gameWin = true;
      var i;
      var piece;
      for(i = 0;i < pieces.length;i++){
          piece = pieces[i];
          stage.drawImage(puzzleImage, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
          if(piece.xPos != piece.sx || piece.yPos != piece.sy){
              gameWin = false;
          }
      }
      if(gameWin){
        var title = window.puzzleTitle
        endScreen("Completed " + title);
        winning.innerHTML = "<p id='again'>Play again?</p>"
        document.getElementById('again').addEventListener('click', initPuzzle)
      }
  }

  function endScreen(msg){
          stage.fillStyle = "#000000";
          stage.globalAlpha = .9;
          stage.fillRect(100,puzzleHeight - 40,puzzleWidth - 200,40);
          stage.fillStyle = "#FFFFFF";
          stage.globalAlpha = 1;
          stage.textAlign = "center";
          stage.textBaseline = "middle";
          stage.font = "15px Arial";
          stage.fillText(msg,puzzleWidth / 2,puzzleHeight - 20);
          gameOver();
  }

  function gameOver(){
      document.onmousedown = null;
      document.onmousemove = null;
      document.onmouseup = null;
      // initPuzzle();
  }

});
