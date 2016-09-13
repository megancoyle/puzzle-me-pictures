$(".puzzles.show").ready(function() {
  console.log('load')
  // on page load, trigger init function
  window.onload = function() {
    init();
  };

  var puzzleDifficulty = 4;
  var puzzleHover = '#006699';

  var stage;
  var puzzleCanvas;

  var puzzleImage;
  var pieces;
  var puzzleWidth;
  var puzzleHeight;
  var pieceWidth;
  var pieceHeight;
  var currentPiece;
  var currentDropPiece;

  var mouse;

  // init function, loads image
  function init(){
      puzzleImage = new Image();
      puzzleImage.addEventListener('load', onImage, false);
      puzzleImage.src = window.mapImg;

  }
  // sets puzzle piece sizes based on difficulty
  function onImage(e){
      pieceWidth = Math.floor(puzzleImage.width / puzzleDifficulty)
      pieceHeight = Math.floor(puzzleImage.height / puzzleDifficulty)
      puzzleWidth = pieceWidth * puzzleDifficulty;
      puzzleHeight = pieceHeight * puzzleDifficulty;
      setCanvas();
      initPuzzle();
  }
  // sets canvas for script
  function setCanvas(){
      puzzleCanvas = document.getElementById('canvas');
      stage = puzzleCanvas.getContext('2d');
      puzzleCanvas.width = puzzleWidth;
      puzzleCanvas.height = puzzleHeight;
      puzzleCanvas.style.border = "1px solid black";
  }
  // draws image on canvas
  function initPuzzle(){
      pieces = [];
      mouse = {x:0,y:0};
      currentPiece = null;
      currentDropPiece = null;
      stage.drawImage(puzzleImage, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
      // createTitle("Click to Start");
      buildPieces();
  }

  // builds pieces for puzzle
  function buildPieces(){
      var i;
      var piece;
      var xPos = 0;
      var yPos = 0;
      for(i = 0;i < puzzleDifficulty * puzzleDifficulty;i++){
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
      // code below is used for a click event to start puzzle
      // document.onmousedown = shufflePuzzle;

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
          // stage.strokeRect(xPos, yPos, pieceWidth,pieceHeight);
          xPos += pieceWidth;
          if(xPos >= puzzleWidth){
              xPos = 0;
              yPos += pieceHeight;
          }
      }
      document.onmousedown = onPuzzleClick;
  }
  function onPuzzleClick(e){
      if(e.layerX || e.layerX == 0){
          mouse.x = e.layerX - puzzleCanvas.offsetLeft;
          mouse.y = e.layerY - puzzleCanvas.offsetTop;
      }
      else if(e.offsetX || e.offsetX == 0){
          mouse.x = e.offsetX - puzzleCanvas.offsetLeft;
          mouse.y = e.offsetY - puzzleCanvas.offsetTop;
      }
      currentPiece = checkPieceClicked();
      if(currentPiece != null){
          stage.clearRect(currentPiece.xPos,currentPiece.yPos,pieceWidth,pieceHeight);
          stage.save();
          stage.globalAlpha = .9;
          stage.drawImage(puzzleImage, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
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
          if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
          // piece not selected
          }
          else{
              return piece;
          }
      }
      return null;
  }

  // update puzzle as user makes moves
  function updatePuzzle(e){
      currentDropPiece = null;
      if(e.layerX || e.layerX == 0){
          mouse.x = e.layerX - puzzleCanvas.offsetLeft;
          mouse.y = e.layerY - puzzleCanvas.offsetTop;
      }
      else if(e.offsetX || e.offsetX == 0){
          mouse.x = e.offsetX - puzzleCanvas.offsetLeft;
          mouse.y = e.offsetY - puzzleCanvas.offsetTop;
      }
      stage.clearRect(0,0,puzzleWidth,puzzleHeight);
      var i;
      var piece;
      for(i = 0;i < pieces.length;i++){
          piece = pieces[i];
          if(piece == currentPiece){
              continue;
          }
          stage.drawImage(puzzleImage, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
          // stage.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
          if(currentDropPiece == null){
              if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
                  //NOT OVER
              }
              else{
                  currentDropPiece = piece;
                  stage.save();
                  stage.globalAlpha = .4;
                  stage.fillStyle = puzzleHover;
                  stage.fillRect(currentDropPiece.xPos,currentDropPiece.yPos,pieceWidth, pieceHeight);
                  stage.restore();
              }
          }
      }
      stage.save();
      stage.globalAlpha = .6;
      stage.drawImage(puzzleImage, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
      stage.restore();
      // stage.strokeRect( mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth,pieceHeight);
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
          // stage.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
          if(piece.xPos != piece.sx || piece.yPos != piece.sy){
              gameWin = false;
          }
      }
      if(gameWin){
          alert("you win!");
          setTimeout(gameOver,500);
      }
  }
  function gameOver(){
      document.onmousedown = null;
      document.onmousemove = null;
      document.onmouseup = null;
      initPuzzle();
  }

  function shuffleArray(o){
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }

});
