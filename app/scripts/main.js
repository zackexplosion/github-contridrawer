'use strict';
/*global moment*/
/*eslint camelcase: false*/
/*eslint no-loop-func: false*/
(function(){



// function setPixel(imagedata, x, y, r, g, b, a) {
//     var i = (y * imagedata.width + x) * 4;
//     imagedata.data[i++] = r;
//     imagedata.data[i++] = g;
//     imagedata.data[i++] = b;
//     imagedata.data[i] = a;
// }

    var ONE_DAY = 1000 * 60 * 60 * 24;

    var GIT_SIZE = {
        width: 0,
        height: 7
    };

    var DATES_TO_DRAW = [];

    var getPixel = function (imagedata, x, y) {
        var i = (y * imagedata.width + x) * 4;
        return {
            r: imagedata.data[i],
            g: imagedata.data[i + 1],
            b: imagedata.data[i + 2],
            a: imagedata.data[i + 3]
        };
    }

    var download = function(filename, text) {
      var pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text) );
      pom.setAttribute('download', filename);

      pom.style.display = 'none';
      document.body.appendChild(pom);

      pom.click();

      document.body.removeChild(pom);
    }

    var downloadshell = function(){
        var template = document.getElementById('shell-template').innerText;
        var dates = 'dates=(';

        for (var i = DATES_TO_DRAW.length - 1; i >= 0; i--) {
            var d = new Date(DATES_TO_DRAW[i]);
            var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            dates += date + ' ';
        }

        dates += ')';

        template = template.replace('dates=()', dates);
        download('github-contridrawer.sh', template);
    };

    var handleDragOver = function(e){
        e.stopPropagation();
        e.preventDefault();
        // e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    var render_preview = function(){
        // var ctx = c.getContext("2d");
        // // debugger;
        var img = document.getElementById('import-image');

        var width_compress_rate = img.naturalHeight / 7;
        GIT_SIZE.width = img.naturalWidth / width_compress_rate;

        var canvas = document.getElementById('myCanvas');
        canvas.width = GIT_SIZE.width;
        canvas.height = GIT_SIZE.height;
        // var canvas2 = document.getElementById("myCanvas2");


        var context = canvas.getContext('2d');

        // var context2 = canvas2.getContext("2d");

        // context2.beginPath();

        context.drawImage(img, 0, 0, GIT_SIZE.width, GIT_SIZE.height);
        var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

        // debugger;
        // var axis  = [];
        (function(){
            var contribution = document.getElementById('contribution');
            // reset preview block
            contribution.innerHTML = '';

            var start_date = new Date('2014-08-03');

            // var end_date = new Date( start_date.getTime() + (ONE_DAY * axis.length) );
            // var length = (end_date.getTime() - start_date.getTime()) / ONE_DAY;

            var i = 0;
            for( var x = 0; x < imagedata.width; x++ ) {
                var week = document.createElement('div');

                week.className = 'week week-' + x;

                for( var y = 0; y < imagedata.height; y++ ) {
                    var day = document.createElement('span');

                    var current_date = new Date( start_date.getTime() + (ONE_DAY * i) );
                    // console.log(current_date);

                    // get the pixel color code
                    var pixel = getPixel(imagedata, x, y);
                    if(pixel.r === 0 && pixel.g === 0 && pixel.b === 0 && pixel.a === 0){
                        // transparent pixel
                        pixel = null;
                    }else{
                        day.className = 'dot';
                        DATES_TO_DRAW.push(moment(current_date));
                    }

                    week.appendChild(day);
                    i++;
                }

                contribution.appendChild(week);
            }
        })();
    };

    var fileChangeHandler = function(e){
        e.stopPropagation();
        e.preventDefault();


        var files;
        if(typeof e.target.files === 'undefined'){
            files = e.dataTransfer.files;
        }else{
            files = e.target.files;
        }

        for (var i = 0, f; f = files[i]; i++) {  //eslint-disable-line no-cond-assign
            if(!f.type.match('image.*')){
                continue;
            }

            var reader = new FileReader();

            reader.onload = (function(){  //eslint-disable-line no-loop-func
                return function(evt){  //eslint-disable-line no-loop-func
                    var data = evt.target.result;

                    var img = document.getElementById('import-image');
                    img.src = data;
                    render_preview();
                };
            })(f);

            reader.readAsDataURL(f);
            // debugger;

        }

    };
    window.addEventListener('load', function(){
        var input = document.getElementById('import-file');
        var importForm = document.getElementById('import-form');
        var downloadButton = document.getElementById('download-button');

        input.addEventListener('change', fileChangeHandler);  //eslint-disable-line no-use-before-define


        importForm.addEventListener('dragover', handleDragOver, false);
        importForm.addEventListener('drop', fileChangeHandler, false);  //eslint-disable-line no-use-before-define
        importForm.addEventListener('click', function(){
            input.click();
        });

        downloadButton.addEventListener('click', downloadshell);

        render_preview();
    });
})();