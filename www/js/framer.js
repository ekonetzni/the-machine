
function recreateImage(jsonPath) {
  var canvas = document.getElementById("surface");
  var ctx = canvas.getContext("2d");
  function drawPixel(x, y, r, g, b) {
    var color = 'rgb(' + r + ',' + g + ',' + b + ',1)';

    console.log("drawing rectangle at ", x, ", ", y, " in color ", color);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 2, 2);
  }

  function async(fun) {
    setTimeout(function () {
      fun();
    }, 1000);
  }

  var limit = 0;

  $.getJSON(jsonPath)
    .success(function (data) {
      $.each(data.pixels, function (name, pixel) {
        limit++;
        console.log(pixel);
        if (limit % 5 === 0) {
          async(drawPixel(pixel.x, pixel.y, pixel.r, pixel.g, pixel.b));
        }       
      });
    })
    .error(function (e) {
      console.log("Encountered ", e.message, " trying to retrieve json.");
    });
}

$("#go").click(function () {
  recreateImage('/pixels.json');
});