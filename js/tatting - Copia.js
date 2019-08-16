var state=[];

$(function() {

		var canvas=new fabric.Canvas('canvas',
				{
				backgroundColor: null,
				preserveObjectStacking: true
			}

		);
		fabric.Object.prototype.objectCaching=true;
		canvasReset();
		updateModifications(true);

		var lastUndoStateIdx=0; // Last index used of undo states
		simpleNode='<g fill="none" stroke="#000"><path transform="matrix(.76615 0 0 .62499 17.985 19.709)" d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" stroke-width=".723"/><path d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" transform="matrix(.76615 0 0 .62499 22.04 19.709)" stroke-width=".723"/><path transform="matrix(1.00496 0 0 .76423 8.956 14.082)" d="M26.458 52.26c.882-1.323 1.764-2.646 2.646-2.646.882 0 1.764 1.323 2.646 2.646" stroke-width=".571"/><path transform="matrix(.76615 0 0 .62499 17.985 19.709)" d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" stroke-width=".723"/><path d="M21.608 58.434c-.441 3.528-.441 10.583-.22 14.111.22 3.528.66 3.528 1.322 3.528h2.205c.662 0 1.103 0 1.323-3.526.22-3.526.22-10.585-.22-14.113-.441-3.528-1.323-3.528-1.764-3.528h-.882c-.441 0-1.323 0-1.764 3.528z" transform="matrix(.76615 0 0 .62499 22.04 19.709)" stroke-width=".723"/><path transform="matrix(1.00496 0 0 .76423 8.956 14.082)" d="M26.458 52.26c.882-1.323 1.764-2.646 2.646-2.646.882 0 1.764 1.323 2.646 2.646" stroke-width=".571"/></g>';
		picot='<g fill="none" stroke="#000"><path transform="rotate(90.607) skewX(-.029)" d="M52.048-37.646a5.443 5.48 0 0 1-5.493-2.436 5.443 5.48 0 0 1 .073-6.043 5.443 5.48 0 0 1 5.55-2.3" stroke-width=".458"/><path d="M49.11 53.814a7.976 6.804 0 0 0-1.246-8.917 7.976 6.804 0 0 0-10.527-.096 7.976 6.804 0 0 0-1.47 8.892" stroke-width=".45"/></g>';
		var canSimpleNodeDraw=false;
		var canPicotDraw=false;
		var canArcDraw=false;
		var isArcDrawing=false;
		var isArcDrawingInitiated=false;
		var isTeardropDrawingInitiated=false;
		var canTeardropDraw=false;
		var isTeardropDrawing=false;
		var canTextboxDraw=false;

		var simpleNodeImgWidth=10;
		var simpleNodeImgHeight=21;
		var simpleNodeScale=1.2;
		var curveShapeCurvature=0.4;
		var arcLine;
		var teardropLine;
		var arcCurvePreview;
		var teardropCurvePreview;
		var curveShapeArray=[];
		var mousePosX;
		var mousePosY;

		var debugOn=true;

		//************************************************************************
		// * My fabric.js defaults i.e. you can only rotate objects and groups
		//************************************************************************

		fabric.Group.prototype.lockScalingX=true;
		fabric.Group.prototype.lockScalingY=true;
		fabric.Group.prototype.borderColor='red';
		fabric.Group.prototype.cornerColor='green';
		fabric.Group.prototype.cornerSize=20;
		fabric.Group.prototype.transparentCorners=false;
		fabric.Group.prototype.snapAngle=5;

		fabric.Group.prototype._controlsVisibility= {
			tl: false,
			tr: false,
			br: false,
			bl: false,
			ml: false,
			mt: false,
			mr: false,
			mb: false,
			mtr: true
		}

		;
		fabric.Object.prototype.lockScalingX=true;
		fabric.Object.prototype.lockScalingY=true;
		fabric.Object.prototype.borderColor='red';
		fabric.Object.prototype.cornerColor='green';
		fabric.Object.prototype.cornerSize=20;
		fabric.Object.prototype.transparentCorners=false;
		fabric.Object.prototype.snapAngle=5;

		fabric.Object.prototype._controlsVisibility= {
			tl: false,
			tr: false,
			br: false,
			bl: false,
			ml: false,
			mt: false,
			mr: false,
			mb: false,
			mtr: true
		}

		;

		//************************************************************************
		// * Canvas reset
		//************************************************************************
		function canvasReset() {
			var imageUrl="./img/graph-paper.png";

			canvas.setBackgroundColor( {
					source: imageUrl,
					repeat: 'repeat'
				}

				, function() {
					canvas.renderAll();
				}

			);
		}

		//************************************************************************
		// * Use CTRL-Z keys to undo action 
		// * Use DEL key to delete selected object 
		// * Use CTRL-V keys to clone selected object 
		// * Use N to add a simple Node at mouse position 
		// * Use P to add a Picot at mouse position 
		//************************************************************************
		$('html').keyup(function(e) {
				if (e.keyCode==90) {
					canvasUndo();
				}

				if (e.keyCode==46) {
					deleteSelectedObjectsFromCanvas();
				}
			}

		);

		//************************************************************************
		// * On object selected event (not used)
		//************************************************************************
		canvas.on('object:selected', function(o) {
				var activeObj=o.target;
			}

		);

		//************************************************************************
		// * On new object addet to canvas, select it
		//************************************************************************
		canvas.on('object:added', function(o) {
				canvas.setActiveObject(o.target);
			}

		);

		//************************************************************************
		// * On modifications to canvas, save the current state
		//************************************************************************
		canvas.on('object:modified',
			function() {
				if (debugOn) console.log('DBG:ACTION:object modified');
				updateModifications(true);
			}

			,
			'object:added',
			function() {
				if (debugOn) console.log('DBG:ACTION:object added');
				updateModifications(true);
			}

		);

		function updateModifications(savehistory) {
			if (savehistory===true) {
				//    myjson = canvas.toJSON();
				myjson=JSON.stringify(canvas);
				state.push(myjson);
				if (debugOn) console.log('DBG:OPERATION:update history');
				lastUndoStateIdx=state.length - 1;
				if (lastUndoStateIdx < 0) lastUndoStateIdx=0;
			}
		}



		//************************************************************************
		// * ADD simple node function
		//************************************************************************
		function addSimpleNode(x, y) {
			fabric.loadSVGFromString(simpleNode, function(objects, options) {
					group=fabric.util.groupSVGElements(objects, options);

					group.set( {
							left: x,
							top: y,
							scaleX: simpleNodeScale,
							scaleY: simpleNodeScale
						}

					);
					canvas.add(group);
					cursor=group;
					canvas.renderAll();
					if (debugOn) console.log('DBG:ACTION:add simple node');
					updateModifications(true);
				}

			);
		}

		;

		//************************************************************************
		// * ADD picot function
		//************************************************************************
		function addPicot(x, y) {
			fabric.loadSVGFromString(picot, function(objects, options) {
					group=fabric.util.groupSVGElements(objects, options);

					group.set( {
							left: x,
							top: y,
							scaleX: simpleNodeScale,
							scaleY: simpleNodeScale
						}

					);
					canvas.add(group);
					cursor=group;
					canvas.renderAll();
					if (debugOn) console.log('DBG:ACTION:add picot');
					updateModifications(true);
				}

			);
		}

		;

		//************************************************************************
		// * ADD textbox function
		//************************************************************************
		function addTextbox(x, y) {

			var text=new fabric.IText('Testo',
					{
					fontFamily: 'arial black',
					left: x,
					top: y,
					backgroundColor: 'white',
					objecttype: 'text',
					lockScalingX: false,
					lockScalingY: false,
					hasControls: true
				}

			);

			text.setControlsVisibility( {
					'tl': true,
					'tr': true,
					'bl': true,
					'mb': true,
					'mr': true,
					'ml': true,
					'br': true,
					'mt': true
				}

			);
			canvas.add(text);
			canvas.renderAll();
			updateModifications(true);
			if (debugOn) console.log('DBG:ACTION:add textbox');
		}

		;

		//************************************************************************
		// * DELETE object function
		//************************************************************************
		function deleteSelectedObjectsFromCanvas() {
			var selection=canvas.getActiveObject();
			if (typeof selection==="undefined") return;
			if (selection==null) return;

			if (selection.type==='activeSelection') {
				selection.forEachObject(function(element) {
						canvas.remove(element);
						if (debugOn) console.log('DBG:ACTION:object deleted');
						updateModifications(true);


					}

				);
			}

			else {
				canvas.remove(selection);
				if (debugOn) console.log('DBG:ACTION:object deleted');
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
					_clipboard=cloned;
				}

			);
		}

		//************************************************************************
		// * COLORPICK function
		//************************************************************************
		$("#colorPicker").change(function() {
				var toColor=this.value;
				var selection=canvas.getActiveObject();
				if (typeof selection==="undefined") return;
				if (selection==null) return;

				if (selection.type==='activeSelection') {
					selection.getObjects().forEach(function(obj) {
							obj.set('stroke', toColor);

							if (typeof(obj._objects) !="undefined") {
								obj.getObjects().forEach(function(obj2) {
										obj2.set('stroke', toColor);

										if (typeof(obj2._objects) !="undefined") {
											obj2.getObjects().forEach(function(obj3) {
													obj3.set('stroke', toColor);
												}

											);
										}
									}

								);
							}
						}

					);
				}

				else {
					selection.set('stroke', toColor);

					if (typeof(selection._objects) !="undefined") {
						selection.getObjects().forEach(function(obj2) {
								obj2.set('stroke', toColor);

								if (typeof(obj2._objects) !="undefined") {
									obj2.getObjects().forEach(function(obj3) {
											obj3.set('stroke', toColor);
										}

									);
								}
							}

						);
					}
				}

				canvas.requestRenderAll();
				if (debugOn) console.log('DBG:ACTION:object color change');
				updateModifications(true);
			}

		);

		//************************************************************************
		// * PASTE object function
		//************************************************************************
		function Paste() {

			// clone again, so you can do multiple copies.
			_clipboard.clone(function(clonedObj) {
					canvas.discardActiveObject();

					clonedObj.set( {
							left: clonedObj.left + 10,
							top: clonedObj.top + 10,
							evented: true,
						}

					);

					if (clonedObj.type==='activeSelection') {
						// active selection needs a reference to the canvas.
						clonedObj.canvas=canvas;

						clonedObj.forEachObject(function(obj) {
								canvas.add(obj);
							}

						);
						// this should solve the unselectability
						clonedObj.setCoords();
					}

					else {
						canvas.add(clonedObj);
					}

					_clipboard.top +=10;
					_clipboard.left +=10;
					canvas.setActiveObject(clonedObj);
					canvas.requestRenderAll();
					if (debugOn) console.log('DBG:ACTION:object paste');
					updateModifications(true);
				}

			);
		}

		//************************************************************************
		// * Canvas UNDO function
		//************************************************************************
		function canvasUndo() {
			if (lastUndoStateIdx > 1) {
				canvasReset();
				lastUndoStateIdx -=1;
				canvas.loadFromJSON(state[lastUndoStateIdx]);
				canvas.renderAll();
				if (debugOn) console.log('DBG:ACTION:undo');

			}
		}

		//************************************************************************
		// * Canvas SELECTION-SEND-BACKWARDS function
		//************************************************************************
		function canvasSelectionSendBackwards() {
			var obj=canvas.getActiveObject();
			canvas.sendBackwards(obj);
			if (debugOn) console.log('DBG:ACTION:object send backwards');

		}

		//************************************************************************
		// * Canvas SELECTION-BRING-FORWARD function
		//************************************************************************
		function canvasSelectionBringForward() {
			var obj=canvas.getActiveObject();
			canvas.bringForward(obj);
			if (debugOn) console.log('DBG:ACTION:object bring forward');

		}

		//************************************************************************
		// * Canvas ZOOM-IN function
		//************************************************************************
		function canvasZoomIn() {
			var zoom=canvas.getZoom();
			zoom +=0.1;
			canvas.setZoom(zoom);
		}

		//************************************************************************
		// * Canvas ZOOM-OUT function
		//************************************************************************
		function canvasZoomOut() {
			var zoom=canvas.getZoom();
			zoom -=0.1;
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
		$(document).on('change', '#file_open', function() {
				var file=document.querySelector('input[type=file]').files[0];
				var reader=new FileReader();
                var textFile=/text.*/;

				reader.onload=function(event) {
					canvasReset();
					lastUndoStateIdx -=0;
					canvas.loadFromJSON(event.target.result);
					canvas.renderAll();
					if (debugOn) console.log('DBG:ACTION:file open');
					updateModifications(true);
					var input=$("#file_open");
					input.replaceWith(input.val('').clone(true));
				}

				reader.readAsText(file);
			}

		);

		//************************************************************************
		// * Button FILE_OPEN action
		//************************************************************************
		registerButton($("#toolbar-file-open"), function() {
				$("#file_open").trigger("click");
			}

		);

		//************************************************************************
		// * Button FILE_SAVE action
		// * Using window.saveAs instead of FileSaver.saveAs  https://github.com/eligrey/FileSaver.js/issues/421
		//************************************************************************
		registerButton($("#toolbar-file-save"), function() {
				//  var jsonse = JSON.stringify(state[state.length-1]);
				var jsonse=state[state.length - 1];

				var blob=new Blob([jsonse],
						{
						type: "application/json"
					}

				);
				window.saveAs(blob, "new.tat");
			}

		);

		//************************************************************************
		// * Button CLONE action
		//************************************************************************
		registerButton($("#toolbar-clone"), function() {
				var selection=canvas.getActiveObject();
				if (typeof selection==="undefined") return;
				if (selection==null) return;
				Copy();
				Paste();
			}

		);

		//************************************************************************
		// * Button GROUP action
		//************************************************************************
		registerButton($("#toolbar-group"), function() {
				if ( !canvas.getActiveObject()) {
					return;
				}

				if (canvas.getActiveObject().type !=='activeSelection') {
					return;
				}

				canvas.getActiveObject().toGroup();
				if (debugOn) console.log('DBG:ACTION:group objects');
				updateModifications(true);
				canvas.requestRenderAll();
			}

		);

		//************************************************************************
		// * Button UNGROUP action
		//************************************************************************
		registerButton($("#toolbar-ungroup"), function() {
				if ( !canvas.getActiveObject()) {
					return;
				}

				if (canvas.getActiveObject().type !=='group') {
					return;
				}

				canvas.getActiveObject().toActiveSelection();
				if (debugOn) console.log('DBG:ACTION:ungroup objects');
				canvas.requestRenderAll();
			}

		);

		//************************************************************************
		// * Button ZOOM-IN action
		//************************************************************************
		registerButton($("#toolbar-zoom-in"), function() {
				canvasZoomIn();
			}

		);

		//************************************************************************
		// * Button ZOOM-OUT action
		//************************************************************************
		registerButton($("#toolbar-zoom-out"), function() {
				canvasZoomOut();
			}

		);

		//************************************************************************
		// * Button ZOOM-RESET action
		//************************************************************************
		registerButton($("#toolbar-zoom-reset"), function() {
				canvasZoomReset();
			}

		);

		//************************************************************************
		// * Button DELETE action
		//************************************************************************
		registerButton($("#toolbar-delete"), function() {
				deleteSelectedObjectsFromCanvas();
			}

		);

		//************************************************************************
		// * Button ARC action
		//************************************************************************
		registerToggleButton($("#toolbar-arc"), function() {
				canArcDraw=true;
				canvas.discardActiveObject().renderAll();
				canvas.selection=false;

				canvas.forEachObject(function(o) {
						o.selectable=false;
					}

				);
			}

			, function() {
				canArcDraw=false;
				canvas.selection=true;

				canvas.forEachObject(function(o) {
						o.selectable=true;
					}

				);
			}

		);

		//************************************************************************
		// * Button TEARDROP action
		//************************************************************************
		registerToggleButton($("#toolbar-teardrop"), function() {
				canTeardropDraw=true;
				canvas.discardActiveObject().renderAll();
				canvas.selection=false;

				canvas.forEachObject(function(o) {
						o.selectable=false;
					}

				);
			}

			, function() {
				canTeardropDraw=false;
				canvas.selection=true;

				canvas.forEachObject(function(o) {
						o.selectable=true;
					}

				);
			}

		);

		//************************************************************************
		// * Button SIMPLE-NODE action
		//************************************************************************
		registerToggleButton($("#toolbar-simple-node"), function() {
				// set strong font weight
				canSimpleNodeDraw=true;
				canvas.discardActiveObject().renderAll();
				canvas.selection=false;

				canvas.forEachObject(function(o) {
						o.selectable=false;
					}

				);
			}

			, function() {
				// set normal font weight
				canSimpleNodeDraw=false;
				canvas.selection=true;

				canvas.forEachObject(function(o) {
						o.selectable=true;
					}

				);
			}

		);

		//************************************************************************
		// * Button PICOT action
		//************************************************************************
		registerToggleButton($("#toolbar-picot"), function() {
				// set strong font weight
				canPicotDraw=true;
				canvas.discardActiveObject().renderAll();
				canvas.selection=false;

				canvas.forEachObject(function(o) {
						o.selectable=false;
					}

				);
			}

			, function() {
				// set normal font weight
				canPicotDraw=false;
				canvas.selection=true;

				canvas.forEachObject(function(o) {
						o.selectable=true;
					}

				);
			}

		);


		//************************************************************************
		// * Button TEXTBOX action
		//************************************************************************
		registerToggleButton($("#toolbar-text-box"), function() {
				// set strong font weight
				canTextboxDraw=true;
				canvas.discardActiveObject().renderAll();
				canvas.selection=false;

				canvas.forEachObject(function(o) {
						o.selectable=false;
					}

				);
			}

			, function() {
				// set normal font weight
				canTextboxDraw=false;
				canvas.selection=true;

				canvas.forEachObject(function(o) {
						o.selectable=true;
					}

				);
			}

		);


		//************************************************************************
		// * Button SELECTION-SEND-BACKWARDS action
		//************************************************************************
		/* --- sample event handlers for toolbar buttons --- */
		registerButton($("#toolbar-send-backward"), function() {
				canvasSelectionSendBackwards();
			}

		);

		//************************************************************************
		// * Button SELECTION-BRING-FORWARD action
		//************************************************************************
		/* --- sample event handlers for toolbar buttons --- */
		registerButton($("#toolbar-bring-forward"), function() {
				canvasSelectionBringForward();
			}

		);

		//************************************************************************
		// * Button UNDO action
		//************************************************************************
		/* --- sample event handlers for toolbar buttons --- */
		registerButton($("#toolbar-undo"), function() {
				canvasUndo();
			}

		);

		//************************************************************************
		// * Button TOOLBAR-COLORS action
		//************************************************************************
		registerButton($("#toolbar-colors"), function() {
				$('#colorPicker').click();
			}

		);

		//************************************************************************
		// * Button CLEAR CANVAS action
		//************************************************************************
		registerButton($("#toolbar-clear"), function() {
				if (confirm("Sei sicuro di voler cancellare tutto?")) {
					canvas.clear();
					canvasReset();
					canvas.renderAll();
					if (debugOn) console.log('DBG:ACTION:clear canvas');
					updateModifications(true);

				}
			}

		);

		canvas.on('mouse:down', function(o) {
				var evt=o.e;

				if (canArcDraw) {
					isArcDrawing=true;
                    isArcDrawingInitiated=true;
					var pointer=canvas.getPointer(o.e);
					var points=[pointer.x, pointer.y, pointer.x, pointer.y];
					arcLine=new fabric.Line(points);
				}

				if (canTeardropDraw) {
					isTeardropDrawing=true;
                    isTeardropDrawingInitiated=true;
					var pointer=canvas.getPointer(o.e);
					var points=[pointer.x, pointer.y, pointer.x, pointer.y];
					teardropLine=new fabric.Line(points);
				}

				if (canSimpleNodeDraw) {
					var pointer=canvas.getPointer(o.e);
					addSimpleNode(pointer.x, pointer.y);
					toggle($("#toolbar-simple-node"), true);
				}

				if (canPicotDraw) {
					var pointer=canvas.getPointer(o.e);
					addPicot(pointer.x, pointer.y);
					toggle($("#toolbar-picot"), true);
				}

				if (canTextboxDraw) {
					var pointer=canvas.getPointer(o.e);
					addTextbox(pointer.x, pointer.y);
					toggle($("#toolbar-text-box"), true);
				}

				if (evt.altKey===true) {
					this.isDragging=true;
					canvas.selection=false;
					this.lastPosX=evt.clientX;
					this.lastPosY=evt.clientY;
				}
			}

		);


		canvas.on('mouse:move', function(o) {
				var pointer=canvas.getPointer(o.e);
				mousePosX=pointer.x;
				mousePosY=pointer.y;
				mousePosX=Math.round(mousePosX);
				mousePosY=Math.round(mousePosY);

				if (isArcDrawing) {
					arcLine.set( {
							x2: pointer.x,
							y2: pointer.y
						}

					);
					drawArc(arcLine.x1, arcLine.y1, arcLine.x2, arcLine.y2);				}

				if (isTeardropDrawing) {
					teardropLine.set( {
							x2: pointer.x,
							y2: pointer.y
						}

					);
					drawTeardrop(teardropLine.x1, teardropLine.y1, teardropLine.x2, teardropLine.y2);
				}

				if (this.isDragging) {
					var e=o.e;
					this.viewportTransform[4] +=e.clientX - this.lastPosX;
					this.viewportTransform[5] +=e.clientY - this.lastPosY;
					this.requestRenderAll();
					this.lastPosX=e.clientX;
					this.lastPosY=e.clientY;
				}
			}

		);

		canvas.on('mouse:up', function(o) {
				if (isArcDrawing) {
					isArcDrawing=false;
					canArcDraw=false;
					toggle($("#toolbar-arc"), true);
					drawArc(arcLine.x1, arcLine.y1, arcLine.x2, arcLine.y2);
					if (debugOn) console.log('DBG:ACTION:add arc');
					updateModifications(true);
				}

				if (isTeardropDrawing) {
					isTeardropDrawing=false;
					canTeardropDraw=false;
					toggle($("#toolbar-teardrop"), true);
					drawTeardrop(teardropLine.x1, teardropLine.y1, teardropLine.x2, teardropLine.y2);
					if (debugOn) console.log('DBG:ACTION:add teardrop');
					updateModifications(true);
				}

				if (this.isDragging) {
					this.isDragging=false;
					canvas.selection=true;

					canvas.forEachObject(function(o) {
							o.selectable=true;
							o.setCoords();
						}

					);
				}
			}

		);

		canvas.on('mouse:wheel', function(opt) {
				var delta=opt.e.deltaY;
				var zoom=canvas.getZoom();
				zoom=zoom + delta / 400;
				if (zoom > 20) zoom=20;
				if (zoom < 0.01) zoom=0.01;
				canvas.setZoom(zoom);
				opt.e.preventDefault();
				opt.e.stopPropagation();
			}

		) //************************************************************************
		// * Functions for Arc drawing
		//************************************************************************

		function drawArc(startx, starty, endx, endy) {
			var startPoint= {
				x: startx,
				y: starty
			}

			;

			var endPoint= {
				x: endx,
				y: endy
			}

			;

			var lineLength=Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);

			var control_point_distance=1 + (curveShapeCurvature * lineLength);

			// mid-point of line:
			var mpx=(endPoint.x + startPoint.x) * 0.5;
			var mpy=(endPoint.y + startPoint.y) * 0.5;

			// angle of perpendicular to line:
			var theta=Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) - Math.PI / 2;

			// distance of control point from mid-point of line:
			var offset=control_point_distance;

			// location of control point:
			var c1x=mpx + offset * Math.cos(theta);
			var c1y=mpy + offset * Math.sin(theta);


			var controlPoint= {
				x: c1x,
				y: c1y
			}

			;

			var curveLength=Math.floor(quadraticBezierLength(startPoint, controlPoint, endPoint));

			if  (isArcDrawingInitiated) 
                {isArcDrawingInitiated=false;}
            else
                {canvas.remove(arcCurvePreview);}

            arcShapeArray=[];


			for (var t=0; t < curveLength; t +=simpleNodeImgWidth) {
				var point=getQuadraticBezierXYatT(startPoint, controlPoint, endPoint, t / curveLength);
				var angle=getQuadraticAngle(startPoint, controlPoint, endPoint, t / curveLength);
				angle=toDegrees(angle);
                fabric.loadSVGFromString(simpleNode, function(objects, options) {
                        shapeCurve=fabric.util.groupSVGElements(objects, options);
                        shapeCurve.set( {
                                left: point.x,
                                top: point.y,
                                scaleX: simpleNodeScale,
                                scaleY: simpleNodeScale,
                                angle: angle,
                            }
                        );
                        arcShapeArray.push(shapeCurve);
                    }
                );
			}

            arcCurvePreview=new fabric.Group(arcShapeArray,
                    {
                    x1: arcLine.x1,
                    x2: arcLine.x2,
                    y1: arcLine.y1,
                    y2: arcLine.y2
                }

            );
            canvas.add(arcCurvePreview);
            canvas.renderAll();

		}

		function getQuadraticBezierXYatT(startPt, controlPt, endPt, T) {
			var x=Math.pow(1 - T, 2) * startPt.x + 2 * (1 - T) * T * controlPt.x + Math.pow(T, 2) * endPt.x;
			var y=Math.pow(1 - T, 2) * startPt.y + 2 * (1 - T) * T * controlPt.y + Math.pow(T, 2) * endPt.y;

			return ( {
					x: x,
					y: y
				}

			);
		}

		function getQuadraticAngle(startPt, controlPt, endPt, T) {
			var dx=2 * (1 - T) * (controlPt.x - startPt.x) + 2 * T * (endPt.x - controlPt.x);
			var dy=2 * (1 - T) * (controlPt.y - startPt.y) + 2 * T * (endPt.y - controlPt.y);
			return -Math.atan2(dx, dy) + 0.5 * Math.PI;
		}

		function quadraticBezierLength(startPoint, controlPoint, endPoint) {
			var ax=startPoint.x - 2 * controlPoint.x + endPoint.x;
			var ay=startPoint.y - 2 * controlPoint.y + endPoint.y;
			var bx=2 * controlPoint.x - 2 * startPoint.x;
			var by=2 * controlPoint.y - 2 * startPoint.y;
			var A=4 * (ax * ax + ay * ay);
			var B=4 * (ax * bx + ay * by);
			var C=bx * bx + by * by;

			var Sabc=2 * Math.sqrt(A + B + C);
			var A_2=Math.sqrt(A);
			var A_32=2 * A * A_2;
			var C_2=2 * Math.sqrt(C);
			var BA=B / A_2;

			return (A_32 * Sabc + A_2 * B * (Sabc - C_2) + (4 * C * A - B * B) * Math.log((2 * A_2 + BA + Sabc) / (BA + C_2))) / (4 * A_32);
		}

		//************************************************************************
		// * Functions for Teardrop drawing
		//************************************************************************

		function drawTeardrop(startx, starty, endx, endy) {

			var startPoint= {
				x: startx,
				y: starty
			}

			;

			var endPoint= {
				x: startx,
				y: starty
			}

			;

			curveShapeArray.length=0;

			var lineLength=Math.hypot(endx - startx, endy - starty);

			var controlPointsDistanceFromLine=1+Math.floor(lineLength);

			var mainLineAngle=Math.atan2(endy - starty, endx - startx);

			// location of control points:
			var c1x=Math.sin(mainLineAngle) * controlPointsDistanceFromLine + endx;
			var c1y=-Math.cos(mainLineAngle) * controlPointsDistanceFromLine + endy;
			var c2x=-Math.sin(mainLineAngle) * controlPointsDistanceFromLine + endx;
			var c2y=Math.cos(mainLineAngle) * controlPointsDistanceFromLine + endy;


			var controlPoint1= {
				x: c1x,
				y: c1y
			}

			;

			var controlPoint2= {
				x: c2x,
				y: c2y
			}

			;

			var curveLength=Math.floor(bezierLength(startPoint, controlPoint1, controlPoint2, endPoint));

			var curvePointsArray=new Array();
			var lastx=-1;
			var lasty=-1;

			for (var t=0; t < curveLength-simpleNodeImgWidth; t +=1) {
				var point=getBezierXYatT(startPoint, controlPoint1, controlPoint2, endPoint, t / curveLength);
				point.x=Math.floor(point.x);
				point.y=Math.floor(point.y);
				var dist=Math.hypot(point.x-lastx, point.y-lasty);

				if (dist >=simpleNodeImgWidth) {
					var angle=getBezierAngle(startPoint, controlPoint1, controlPoint2, endPoint, t / curveLength);
					angle=toDegrees(angle);
					point.angle=angle;
					curvePointsArray.push(point);
					lastx=point.x;
					lasty=point.y;
				}
			}

			for (var t=0; t < curvePointsArray.length; t +=1) {
				var point=curvePointsArray[t];
				var angle=curvePointsArray[t].angle;
				addRotatedImageToArray(point, angle);
			}
		}


		function getBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
			var x=Math.pow(1 - T, 3) * startPt.x + 3 * T * Math.pow(1 - T, 2) * controlPt1.x + 3 * T * T * (1 - T) * controlPt2.x + T * T * T * endPt.x;
			var y=Math.pow(1 - T, 3) * startPt.y + 3 * T * Math.pow(1 - T, 2) * controlPt1.y + 3 * T * T * (1 - T) * controlPt2.y + T * T * T * endPt.y;

			return ( {
					x: x,
					y: y
				}

			);
		}

		function getBezierAngle(startPt, controlPt1, controlPt2, endPt, T) {
			var dx=Math.pow(1 - T, 2) * (controlPt1.x - startPt.x) + 2 * T * (1 - T) * (controlPt2.x - controlPt1.x) + T * T * (endPt.x - controlPt2.x);
			var dy=Math.pow(1 - T, 2) * (controlPt1.y - startPt.y) + 2 * T * (1 - T) * (controlPt2.y - controlPt1.y) + T * T * (endPt.y - controlPt2.y);
			return -Math.atan2(dx, dy) + 0.5 * Math.PI;
		}

		function bezierLength(startPoint, controlPoint1, controlPoint2, endPoint) {
			var myCurve=new Bezier(startPoint.x, startPoint.y, controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
			var arclength=myCurve.length();
			var l=Math.floor(((100*arclength)|0)/100);
			return l;
		}

		//************************************************************************
		// * Add Rotated image to Array function
		//************************************************************************

		function addRotatedImageToArray(point, theAngle) {
			var shapeCurve;

			fabric.loadSVGFromString(simpleNode, function(objects, options) {
					shapeCurve=fabric.util.groupSVGElements(objects, options);

					shapeCurve.set( {
							left: point.x,
							top: point.y,
							scaleX: simpleNodeScale,
							scaleY: simpleNodeScale,
							angle: theAngle,
						}

					);
					curveShapeArray.push(shapeCurve);
				}

			);

		}

		function toDegrees(angle) {
			return angle * (180 / Math.PI);
		}

	}

);