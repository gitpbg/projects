var automatafn = function() {
    var width = 640;
    var height = 480;
    var running = false;
    var current = 0;
    var mappingTable = new Array(8);
    var data = [];
    var dcur = 0;
    var automaton = 0;
    var randomInit = false;
    var ctx = null;
    var raf = window.requestAnimationFrame;
    var rv =  {
        init : function() {
            var canvas = document.getElementById("automaton-canvas")
            ctx = canvas.getContext("2d");
            width = canvas.getAttribute("width");
            height = canvas.getAttribute("height");
            console.log("Width = " + width + " height = " + height);
            data.push(new Array(width));
            data.push(new Array(width));
            document.getElementById("automaton-number").value = 110;
        },
        start : function() {
            if (running) {
                console.log("already running");
            } else {
                running = true;
                rv.begin();
                raf(rv.animate);
            }
        },
        begin: function() {
            console.log("begin called");
            automaton = document.getElementById("automaton-number").value;
            randomInit = document.getElementById("automaton-random").checked;
            console.log("Begin Called Automaton is " + automaton + " randomInit = " + randomInit);
            for (var i = 0; i < 8; i++) {
                mappingTable[i] = (automaton & (1 << i)) ? 1 : 0;
                console.log(i + " maps to " + mappingTable[i]);
            }
            dcur = 0;
            var dtmp = data[dcur];
            for (var i = 0; i < width; i++) {
                dtmp[i] = (randomInit) ? (Math.random() > 0.5 ? 1 : 0) : 0;
            }
            if (!randomInit) {
                dtmp[width-2] = 1;
//                dtmp[width/4] = 1;
//                dtmp[width/4*3] = 1;
            }
            current = 0;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, width, height);
        },
        renderLine: function() {
            var dtmp = data[dcur];
            console.log(dtmp.length);
            for (var i = 0; i < width; i++) {
                if (dtmp[i]==1) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(i, current, 1, 1);
                }
            }
        },
        animate:function() {
            var i = 8;
            while (i > 0 && current < height) {
                rv.step();
                i--;
                //console.log(i + " cur " + current);
            }
            if (current < height) {
                raf(rv.animate);
            } else {
                rv.renderLine();
                running = false;
            }
        },
        step: function() {
            //console.log("Step " + current);;
            rv.renderLine();
            current++;
            dcur = current%2;
            var dprev = (dcur + 1) % 2;
            var dcurline = data[dcur];
            var dprevline = data[dprev];
            dcurline[0] = dcurline[width-1] = 0;
            for (var i=1;i<width-1;i++) {
                var p = dprevline[i-1] * 4 + dprevline[i] * 2 + dprevline[i+1];
                //console.log(dprevline[i-1] + " " + dprevline[i] + " " + dprevline[i+1] + " maps to " + mappingTable[p]);
                dcurline[i] = mappingTable[p];
/*                if (current==1) {
                    console.log(dprevline[i-1] + " " + dprevline[i] + " " + dprevline[i+1] + " maps to " + mappingTable[p]);
                }*/
            }
        }
    };
    return rv;
}

var automata = automatafn();