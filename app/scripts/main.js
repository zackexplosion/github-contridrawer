function setPixel(imagedata, x, y, r, g, b, a) {
    var i = (y * imagedata.width + x) * 4;
    imagedata.data[i++] = r;
    imagedata.data[i++] = g;
    imagedata.data[i++] = b;
    imagedata.data[i] = a;
}

function getPixel(imagedata, x, y) {
    var i = (y * imagedata.width + x) * 4;
    return {r: imagedata.data[i], g: imagedata.data[i+1], b: imagedata.data[i+2], a: imagedata.data[i+3]};
}

var git_size = {
    width  : 31,
    height : 7
}
      window.onload = function() {
          
          // var ctx = c.getContext("2d");
          // // debugger;
          var img = document.getElementById("scream");

      
          var canvas  = document.getElementById("myCanvas");
          canvas.width  = git_size.width  ;
          canvas.height = git_size.height ;
          var canvas2 = document.getElementById("myCanvas2");


          var context  = canvas.getContext("2d");

          // var context2 = canvas2.getContext("2d");

          // context2.beginPath();

          context.drawImage(img, 0, 0, git_size.width, git_size.height);
          var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

          // debugger;
          var axis = [];

          var contribution = document.getElementById('contribution');
          for( var x = 0 ; x < imagedata.width; x++ ) {
            var week = document.createElement('div');
            week.className = 'week week-' + x;

            for( var y = 0 ; y < imagedata.height; y++ ) {          
              var day = document.createElement('span');
              
              // get the pixel color code
              var pixel = getPixel(imagedata,x,y);

              if(pixel.r === 0 && pixel.g === 0 && pixel.b === 0 && pixel.a === 0){
                // transparent pixel
              }else{
                axis.push({
                  x : x,
                  y : y,
                  data : pixel
                });
                day.className = 'dot';
              }
              week.appendChild(day);
            }

            contribution.appendChild(week);
          }
   
      };