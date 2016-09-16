$(".puzzles.new, .puzzles.edit").ready(function() {
  var rangeInput = document.getElementById('range-value');
  var rangeText = document.getElementById('range-text');
  var defaultValue = rangeInput.value;

  rangeText.innerHTML = 'Difficulty Level: ' + defaultValue;

  function updateRangeText() {
    var rangeInputValue = rangeInput.value;
    rangeText.innerHTML = 'Difficulty Level: ' + rangeInputValue;
  }

  rangeInput.addEventListener("mousedown", function() {
    updateRangeText();
    rangeInput.addEventListener("mousemove", updateRangeText);
  });
  rangeInput.addEventListener("mouseup", function() {
    rangeInput.removeEventListener("mousemove", updateRangeText);
  });


});
