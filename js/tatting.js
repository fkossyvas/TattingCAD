var state = [];

$(function() {

var canvas = new fabric.Canvas('canvas', {backgroundColor: null, preserveObjectStacking: true});

canvasReset();
updateModifications(true);
var lastUndoStateIdx=0; // Last index used of undo states
//simpleCurve='<g transform="matrix(1 0 0 1 163.5 69.75)"  ><path style="stroke: rgb(255,0,0); stroke-width: 2; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;"  transform=" translate(-87.5, -68.75)" d="M 25 50 C 25 100 150 100 150 50" stroke-linecap="round" /></g>';
simpleNode='<g fill="none" stroke="#000"><path transform="matrix(.76615 0 0 .62499 17.985 19.709)" d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" stroke-width=".723"/><path d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" transform="matrix(.76615 0 0 .62499 22.04 19.709)" stroke-width=".723"/><path transform="matrix(1.00496 0 0 .76423 8.956 14.082)" d="M26.458 52.26c.882-1.323 1.764-2.646 2.646-2.646.882 0 1.764 1.323 2.646 2.646" stroke-width=".571"/><path transform="matrix(.76615 0 0 .62499 17.985 19.709)" d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" stroke-width=".723"/><path d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" transform="matrix(.76615 0 0 .62499 22.04 19.709)" stroke-width=".723"/><path transform="matrix(1.00496 0 0 .76423 8.956 14.082)" d="M26.458 52.26c.882-1.323 1.764-2.646 2.646-2.646.882 0 1.764 1.323 2.646 2.646" stroke-width=".571"/></g>';
nodeWithPicot='<g fill="none" stroke="#000"><path transform="matrix(.76615 0 0 .62499 17.985 19.709)" d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" stroke-width=".723"/><path d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" transform="matrix(.76615 0 0 .62499 22.04 19.709)" stroke-width=".723"/><path transform="matrix(1.00496 0 0 .76423 8.956 14.082)" d="M26.458 52.26c.882-1.323 1.764-2.646 2.646-2.646.882 0 1.764 1.323 2.646 2.646" stroke-width=".571"/><path transform="matrix(.76615 0 0 .62499 26.183 19.496)" d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" stroke-width=".723"/><path d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" transform="matrix(.76615 0 0 .62499 30.238 19.496)" stroke-width=".723"/><path transform="matrix(1.00496 0 0 .76423 17.155 13.869)" d="M26.458 52.26c.882-1.323 1.764-2.646 2.646-2.646.882 0 1.764 1.323 2.646 2.646" stroke-width=".571"/><path d="M51.575-37.419a9.324 5.48 0 0 1-9.41-2.435 9.324 5.48 0 0 1 .124-6.044 9.324 5.48 0 0 1 9.508-2.301" transform="matrix(-.00618 .99998 -.99982 -.019 0 0)" stroke-width=".6"/><path d="M49.062 53.808a7.918 11.695 0 0 0-1.237-15.327 7.918 11.695 0 0 0-10.45-.165A7.918 11.695 0 0 0 35.917 53.6" stroke-width=".588"/></g>';
var canCurveDrawing=false;
var isCurveDrawing=false;
//************************************************************************
// * My fabric.js defaults i.e. you can only rotate objects and groups
//************************************************************************

fabric.Group.prototype.lockScalingX = true;
fabric.Group.prototype.lockScalingY = true;
fabric.Group.prototype.borderColor= 'red';
fabric.Group.prototype.cornerColor= 'green';
fabric.Group.prototype.cornerSize= 10;
fabric.Group.prototype.transparentCorners= false;
fabric.Group.prototype.snapAngle= 5;
fabric.Group.prototype._controlsVisibility = {tl: false, tr: false, br: false, bl: false, ml: false, mt: false, mr: false, mb: false, mtr: true};
fabric.Object.prototype.lockScalingX = true;
fabric.Object.prototype.lockScalingY = true;
fabric.Object.prototype.borderColor= 'red';
fabric.Object.prototype.cornerColor= 'green';
fabric.Object.prototype.cornerSize= 10;
fabric.Object.prototype.transparentCorners= false;
fabric.Object.prototype.snapAngle= 5;
fabric.Object.prototype._controlsVisibility = {tl: false, tr: false, br: false, bl: false, ml: false, mt: false, mr: false, mb: false, mtr: true};

//************************************************************************
// * Canvas reset
//************************************************************************
    function canvasReset() {
    var imageUrl = "./img/graph-paper.png";
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
    backgroundImageOpacity: 0.5,
    backgroundImageStretch: false
    });
}

//************************************************************************
// * Use CTRL-Z keys to undo action 
// * Use DEL key to delete selected object 
// * Use CTRL-V keys to clone selected object 
//************************************************************************
$('html').keyup(function(e){
        if(e.keyCode == 90) { 
           canvasUndo();
        }
        if(e.keyCode == 46) { 
            deleteSelectedObjectsFromCanvas();
        }
        if(e.keyCode == 86) {
            if(e.ctrlKey) 
                {
                    Copy();
                    Paste();
                }
        }
});    

//************************************************************************
// * On object selected event (not used)
//************************************************************************
canvas.on('object:selected', function(o){
    var activeObj = o.target;
}); 

//************************************************************************
// * On new object addet to canvas, select it
//************************************************************************
canvas.on('object:added', function(o) {
canvas.setActiveObject(o.target);
});

//************************************************************************
// * On modifications to canvas, save the current state
//************************************************************************
canvas.on(
'object:modified', function () {
//console.log('object modified');
  updateModifications(true);
},
'object:added', function () {
//console.log('object added');
  updateModifications(true);
});

function updateModifications(savehistory) {
  if (savehistory === true) {
//    myjson = canvas.toJSON();
myjson=JSON.stringify(canvas);
//console.log(myjson);
    state.push(myjson);
    lastUndoStateIdx = state.length-1;
    if (lastUndoStateIdx<0) lastUndoStateIdx=0;
  }
}
//************************************************************************
// * DELETE object function
//************************************************************************
function deleteSelectedObjectsFromCanvas(){
    var selection = canvas.getActiveObject();
    if (typeof selection === "undefined") return;
    if (selection == null) return;
    if (selection.type === 'activeSelection') {
        selection.forEachObject(function(element) {
            console.log(element);
            canvas.remove(element);
            updateModifications(true);
        });
    }
    else{
        canvas.remove(selection);
        updateModifications(true);
    }
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}

//************************************************************************
// * COPY object function
//************************************************************************
    function Copy() {
        // clone what are you copying since you
        // may want copy and paste on different moment.
        // and you do not want the changes happened
        // later to reflect on the copy.
        canvas.getActiveObject().clone(function(cloned) {
            _clipboard = cloned;
        });
    }

//************************************************************************
// * COLORPICK function
//************************************************************************
    $("#colorPicker").change(function(){
var toColor=this.value;
	var selection = canvas.getActiveObject();
    if (typeof selection === "undefined") return;
    if (selection == null) return;
	if (selection.type === 'activeSelection') {
		selection.getObjects().forEach(function(obj) {
			obj.set('stroke', toColor);
            if (typeof(obj._objects) != "undefined") 
            { 
                obj.getObjects().forEach(function(obj2) {
                        obj2.set('stroke', toColor);
                        if (typeof(obj2._objects) != "undefined") 
                        { 
                            obj2.getObjects().forEach(function(obj3) {
                                obj3.set('stroke', toColor);
                            });
                        }
                });
            }
		});
	} 
    else 
    {
		selection.set('stroke', toColor);
        if (typeof(selection._objects) != "undefined") 
        { 
console.log('due');

            selection.getObjects().forEach(function(obj2) {
                    obj2.set('stroke', toColor);
                    if (typeof(obj2._objects) != "undefined") 
                    { 
                        obj2.getObjects().forEach(function(obj3) {
                            obj3.set('stroke', toColor);
                        });
                    }
            });
        }
    }
	canvas.requestRenderAll();
    updateModifications(true);
    });

//************************************************************************
// * PASTE object function
//************************************************************************
    function Paste() {
        // clone again, so you can do multiple copies.
        _clipboard.clone(function(clonedObj) {
            canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = canvas;
                clonedObj.forEachObject(function(obj) {
                    canvas.add(obj);
                });
                // this should solve the unselectability
                clonedObj.setCoords();
            } else {
                canvas.add(clonedObj);
            }
            _clipboard.top += 10;
            _clipboard.left += 10;
            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
        });
    }

//************************************************************************
// * Canvas UNDO function
//************************************************************************
    function canvasUndo() {
    if (lastUndoStateIdx>0) {
        canvasReset();
        lastUndoStateIdx-=1;
        canvas.loadFromJSON(state[lastUndoStateIdx]);
        canvas.renderAll();
        }
   }

//************************************************************************
// * Canvas SELECTION-SEND-BACKWARDS function
//************************************************************************
    function canvasSelectionSendBackwards() {
        var obj=canvas.getActiveObject()
        canvas.sendBackwards(obj)
    }

//************************************************************************
// * Canvas SELECTION-BRING-FORWARD function
//************************************************************************
    function canvasSelectionBringForward() {
        var obj=canvas.getActiveObject()
        canvas.bringForward(obj)
    }

//************************************************************************
// * Canvas ZOOM-IN function
//************************************************************************
    function canvasZoomIn() {
    var zoom = canvas.getZoom();
    zoom+=0.1;
    canvas.setZoom(zoom);
   }

//************************************************************************
// * Canvas ZOOM-OUT function
//************************************************************************
    function canvasZoomOut() {
    var zoom = canvas.getZoom();
    zoom-=0.1;
    canvas.setZoom(zoom);
   }

//************************************************************************
// * Canvas ZOOM-RESET function
//************************************************************************
    function canvasZoomReset() {
    canvas.setZoom(1);
   }

//************************************************************************
// * Button FILE_OPEN action
//************************************************************************
$(document).on('change','#file_open' , function(){
         var file = document.querySelector('input[type=file]').files[0];
         var reader = new FileReader()

        var textFile = /text.*/;
        reader.onload = function (event) {
            canvasReset();
            lastUndoStateIdx-=0;
            canvas.loadFromJSON(event.target.result);
            canvas.renderAll();
            updateModifications(true);
            var input = $("#file_open");
            input.replaceWith(input.val('').clone(true));
        }
         reader.readAsText(file);
    });

//************************************************************************
// * Button FILE_OPEN action
//************************************************************************
registerButton($("#toolbar-file-open"), function() {
$("#file_open").trigger("click");
});

//************************************************************************
// * Button FILE_SAVE action
// * Using window.saveAs instead of FileSaver.saveAs  https://github.com/eligrey/FileSaver.js/issues/421
//************************************************************************
registerButton($("#toolbar-file-save"), function() {
//  var jsonse = JSON.stringify(state[state.length-1]);
var jsonse = state[state.length-1];
var blob = new Blob([jsonse], {type: "application/json"});
window.saveAs(blob, "new.tat");
});

//************************************************************************
// * Button CLONE action
//************************************************************************
registerButton($("#toolbar-clone"), function() {
var selection = canvas.getActiveObject();
if (typeof selection === "undefined") return;
if (selection == null) return;
    Copy();
    Paste();
});

//************************************************************************
// * Button ZOOM-IN action
//************************************************************************
registerButton($("#toolbar-zoom-in"), function() {
    canvasZoomIn();
});

//************************************************************************
// * Button ZOOM-OUT action
//************************************************************************
registerButton($("#toolbar-zoom-out"), function() {
    canvasZoomOut();
});

//************************************************************************
// * Button ZOOM-RESET action
//************************************************************************
registerButton($("#toolbar-zoom-reset"), function() {
    canvasZoomReset();
});

//************************************************************************
// * Button DELETE action
//************************************************************************
registerButton($("#toolbar-delete"), function() {
    deleteSelectedObjectsFromCanvas();
});

//************************************************************************
// * Button ARC action
//************************************************************************
registerToggleButton($("#toolbar-arc"), function() {
// set strong font weight
canCurveDrawing=true;
}, function() {
// set normal font weight
canCurveDrawing=false;
});
//************************************************************************
// * Button SIMPLE-NODE action
//************************************************************************
registerButton($("#toolbar-simple-node"), function() {
    fabric.loadSVGFromString(simpleNode, function (objects, options) {
    group = fabric.util.groupSVGElements(objects, options);
    group.set({
                left: 150,
                top:200,
                scaleX: 1.35,
                scaleY:1.35
            });
    canvas.add(group);
    cursor = group;
    canvas.renderAll();
    updateModifications(true);
    });
});

//************************************************************************
// * Button NODE-WITH-PICOT action
//************************************************************************
registerButton($("#toolbar-node-with-picot"), function() {
    fabric.loadSVGFromString(nodeWithPicot, function (objects, options) {
    group = fabric.util.groupSVGElements(objects, options);
    group.set({
                left: 150,
                top:200,
                scaleX: 1.35,
                scaleY:1.35
            });
    canvas.add(group);
    cursor = group;
    canvas.renderAll();
    updateModifications(true);
    });
});

//************************************************************************
// * Button SELECTION-SEND-BACKWARDS action
//************************************************************************
/* --- sample event handlers for toolbar buttons --- */
registerButton($("#toolbar-send-backward"), function() {
    canvasSelectionSendBackwards();
});

//************************************************************************
// * Button SELECTION-BRING-FORWARD action
//************************************************************************
/* --- sample event handlers for toolbar buttons --- */
registerButton($("#toolbar-bring-forward"), function() {
    canvasSelectionBringForward();
});

//************************************************************************
// * Button UNDO action
//************************************************************************
/* --- sample event handlers for toolbar buttons --- */
registerButton($("#toolbar-undo"), function() {
    canvasUndo();
});

//************************************************************************
// * Button CLEAR CANVAS action
//************************************************************************
registerButton($("#toolbar-clear"), function() {
    if (confirm("Sei sicuro di voler cancellare tutto?")) {
        canvas.clear();
        canvasReset();
        canvas.renderAll();
    }
});






var simpleNodeImgWidth=12;
var simpleNodeImgHeight=24;
var curveShapeCurvature=0.4;
var curveLinePreview;
var curveShapeArray=[];

canvas.on('mouse:down', function (o) {
    if (canCurveDrawing) {
        isCurveDrawing=true;
        var pointer = canvas.getPointer(o.e);
        var points = [pointer.x, pointer.y, pointer.x, pointer.y];

        curveLinePreview = new fabric.Line(points, {
            strokeWidth: 3,
            stroke: 'black'
        });
        canvas.add(curveLinePreview);
    }
});


canvas.on('mouse:move', function (o) {
    if (isCurveDrawing) {
        var pointer = canvas.getPointer(o.e);
        curveLinePreview.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
    }
});

canvas.on('mouse:up', function (o) {  
    if (isCurveDrawing) {
        isCurveDrawing = false;
        canCurveDrawing=false;        
        curveShapeArray.length = 0; 
        toggle($("#toolbar-arc"), true);
        drawShapeCurve(curveLinePreview.x1,curveLinePreview.y1,curveLinePreview.x2,curveLinePreview.y2);
        var newgroup = new fabric.Group(curveShapeArray, { x1: curveLinePreview.x1, x2: curveLinePreview.x2, y1: curveLinePreview.y1, y2: curveLinePreview.y2 });
        canvas.remove(curveLinePreview);
        canvas.add(newgroup);
        canvas.renderAll();
//console.log("******************");console.log("After creation");console.log(newgroup);console.log("******************");
        updateModifications(true);
    }
});

function drawShapeCurve(startx, starty, endx, endy) {
    var startPoint = {
        x: startx,
        y: starty
    };

    var endPoint = {
        x: endx,
        y: endy
    };

    curveShapeArray.length = 0;

    var lineLength=Math.hypot(endPoint.x-startPoint.x,endPoint.y-startPoint.y);

    var control_point_distance=1+(curveShapeCurvature*lineLength);

    /*
    if (startPoint.x>endPoint.x ||startPoint.y>endPoint.y) 
        {
            var tmp_int=startPoint.x;
            startPoint.x=endPoint.x;
            endPoint.x=tmp_int;
            tmp_int=startPoint.y;
            startPoint.y=endPoint.y;
            endPoint.y=tmp_int;
        }
    */

    // mid-point of line:
    var mpx = (endPoint.x + startPoint.x) * 0.5;
    var mpy = (endPoint.y + startPoint.y) * 0.5;

    // angle of perpendicular to line:
    var theta = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) - Math.PI / 2;

    // distance of control point from mid-point of line:
    var offset = control_point_distance;

    // location of control point:
    var c1x = mpx + offset * Math.cos(theta);
    var c1y = mpy + offset * Math.sin(theta);


    var controlPoint = {
        x: c1x,
        y: c1y
    };

    var curveLength=Math.floor(quadraticBezierLength(startPoint, controlPoint, endPoint));

    for (var t = 0; t < curveLength; t += simpleNodeImgWidth) {
        var point = getQuadraticBezierXYatT(startPoint, controlPoint, endPoint, t / curveLength);
        var angle = getQuadraticAngleatT(startPoint, controlPoint, endPoint, t / curveLength);
        angle=toDegrees(angle);
        drawRotatedImage(point, angle);
    }
}

function getQuadraticBezierXYatT(startPt, controlPt, endPt, T) {
    var x = Math.pow(1 - T, 2) * startPt.x + 2 * (1 - T) * T * controlPt.x + Math.pow(T, 2) * endPt.x;
    var y = Math.pow(1 - T, 2) * startPt.y + 2 * (1 - T) * T * controlPt.y + Math.pow(T, 2) * endPt.y;
    return ({
        x: x,
        y: y
    });
}

function getQuadraticAngleatT(startPt, controlPt, endPt, T) {
  var dx = 2*(1-T)*(controlPt.x-startPt.x) + 2*T*(endPt.x-controlPt.x);
  var dy = 2*(1-T)*(controlPt.y-startPt.y) + 2*T*(endPt.y-controlPt.y);
  return -Math.atan2(dx, dy) + 0.5*Math.PI;
}

function drawRotatedImage(point, theAngle)
{ 
var shapeCurve;
fabric.loadSVGFromString(simpleNode, function (objects, options) {
    shapeCurve = fabric.util.groupSVGElements(objects, options);

    shapeCurve.set({
            left: point.x,
            top:point.y,
            scaleX: 1.35,
            scaleY:1.35,
            angle:theAngle,
        });
    curveShapeArray.push(shapeCurve);
    });

}

function quadraticBezierLength(p0, p1, p2) {
    var ax = p0.x - 2 * p1.x + p2.x;
    var ay = p0.y - 2 * p1.y + p2.y;
    var bx = 2 * p1.x - 2 * p0.x;
    var by = 2 * p1.y - 2 * p0.y;
    var A = 4 * (ax * ax + ay * ay);
    var B = 4 * (ax * bx + ay * by);
    var C = bx * bx + by * by;

    var Sabc = 2 * Math.sqrt(A+B+C);
    var A_2 = Math.sqrt(A);
    var A_32 = 2 * A * A_2;
    var C_2 = 2 * Math.sqrt(C);
    var BA = B / A_2;

    return (A_32 * Sabc + A_2 * B * (Sabc - C_2) + (4 * C * A - B * B) * Math.log((2 * A_2 + BA + Sabc) / (BA + C_2))) / (4 * A_32);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

//************************************************************************
// * How-to creating svg strings from object definitions
//************************************************************************
//var path = new fabric.Path('M25,50 C25,100 150,100 150,50', {
//left: 100,
//top: 50,
//stroke: 'red',
//strokeWidth: 2,
//fill: false,
//scaleY:1,
//});
//var svgStr = path.toSVG();
//console.log(svgStr);
//canvas.add(path);   
//************************************************************************

});
