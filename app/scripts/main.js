'use strict';
/*global moment*/
/*eslint camelcase: false*/
/*eslint no-loop-func: false*/


// function setPixel(imagedata, x, y, r, g, b, a) {
//     var i = (y * imagedata.width + x) * 4;
//     imagedata.data[i++] = r;
//     imagedata.data[i++] = g;
//     imagedata.data[i++] = b;
//     imagedata.data[i] = a;
// }

var one_day = 1000 * 60 * 60 * 24;

var git_size = {
    width: 0,
    height: 7
};

function getPixel(imagedata, x, y) {
    var i = (y * imagedata.width + x) * 4;
    return {
        r: imagedata.data[i],
        g: imagedata.data[i + 1],
        b: imagedata.data[i + 2],
        a: imagedata.data[i + 3]
    };
}

function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);

  pom.style.display = 'none';
  document.body.appendChild(pom);

  pom.click();

  document.body.removeChild(pom);
}

var downloadshell = function(){
    download('github-contridraer.sh', 'hello');
};

var handleDragOver = function(e){
    e.stopPropagation();
    e.preventDefault();
    // e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
};

var render_preview = function(){
    var input = document.getElementById('import-file');
    input.addEventListener('change', fileChangeHandler);  //eslint-disable-line no-use-before-define

    var importForm = document.getElementById('import-form');
    importForm.addEventListener('dragover', handleDragOver, false);
    importForm.addEventListener('drop', fileChangeHandler, false);  //eslint-disable-line no-use-before-define
    importForm.addEventListener('click', function(){
        input.click();
    });

    // var ctx = c.getContext("2d");
    // // debugger;
    var img = document.getElementById('import-image');

    var width_compress_rate = img.naturalHeight / 7;
    git_size.width = img.naturalWidth / width_compress_rate;

    var canvas = document.getElementById('myCanvas');
    canvas.width = git_size.width;
    canvas.height = git_size.height;
    // var canvas2 = document.getElementById("myCanvas2");


    var context = canvas.getContext('2d');

    // var context2 = canvas2.getContext("2d");

    // context2.beginPath();

    context.drawImage(img, 0, 0, git_size.width, git_size.height);
    var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

    // debugger;
    // var axis  = [];
    var dates = [];
    (function(){
        var contribution = document.getElementById('contribution');
        // reset preview block
        contribution.innerHTML = '';

        var start_date = new Date('2014-08-03');

        // var end_date = new Date( start_date.getTime() + (one_day * axis.length) );
        // var length = (end_date.getTime() - start_date.getTime()) / one_day;

        var i = 0;
        for( var x = 0; x < imagedata.width; x++ ) {
            var week = document.createElement('div');

            week.className = 'week week-' + x;

            for( var y = 0; y < imagedata.height; y++ ) {
                var day = document.createElement('span');

                var current_date = new Date( start_date.getTime() + (one_day * i) );
                // console.log(current_date);

                // get the pixel color code
                var pixel = getPixel(imagedata, x, y);
                if(pixel.r === 0 && pixel.g === 0 && pixel.b === 0 && pixel.a === 0){
                    // transparent pixel
                    pixel = null;
                }else{
                    day.className = 'dot';
                    dates.push(moment(current_date));
                }

                week.appendChild(day);
                i++;
            }

            contribution.appendChild(week);
        }
    })();

    (function(){
        // var a = dates;
        // var output = document.getElementById("output");

        var output = '';
        for (var i = dates.length - 1; i >= 0; i--) {
            // console.log(dates[i]);
            // var d = document.createElement('div');
            // d.innerHTML = dates[i];
            // output.appendChild(d);

            // output += dates[i]
            var date = dates[i];

            // var d   = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            var d = date.format('YYYY-MM-DD');
            // debugger;
            output += d + '\n';
        }

        // download('dates', output);

        // debugger;
        // var start_date = moment([2014,08,03]);

        // var end_date   = start_date.subtract(axis.length,'days');
        // debugger;
        // // end_date = moment(end_date);

        // var c = start_date.diff(end_date, 'days');
        // debugger;


        // var start_date = new Date('2014-08-03');
        // var end_date = new Date( start_date.getTime() + (one_day * axis.length) );
        // var length = (end_date.getTime() - start_date.getTime()) / one_day;

        // var for_start = parseInt( ( new Date().getTime() - start_date.getTime() ) / one_day );
        // var for_end  = for_start - axis.length;

        // // debugger;

        // // var end_date   = new Date();
        // for (var i = 0; i < axis.length; i++) {
        //     console.log(axis[i]);
        // };

// for i in {start..0}
// do
// date=`date -v -"$i"d +"%Y/%m/%d"`
//     for j in {0..50}
//     do
//         echo $date >> message.txt

//         git add .
//         git commit --date="$date" -m "$date"
//     done
// done

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

window.onload = function() {
    render_preview();

    var downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', downloadshell);
};
