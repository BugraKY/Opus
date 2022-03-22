$(document).ready(function(){

	function windowOffset(elem){
		var iTop = elem.offset().top;
		var iLeft = elem.offset().left;
		var res = {
			top: iTop - $(window).scrollTop(),
			left: iLeft - $(window).scrollLeft()
		}
		return res;
	} 


	//Inserting required elements.
	var pixelarityHTML = '<div class="pixelarity-img-edit"><canvas class="pixelarity-img-edit-can"> </canvas><canvas class="pixelarity-img-edit-process-can"></canvas><div class="pixelarity-img-edit-select"><div class="pixelarity-img-edit-select-resize"></div></div> <div id="pixelarity-side-opt-holder"> <div class="pixelarity-side-opt pixelarity-active-side-opt" id="pixelarity-side-opt-crop"> Crop </div> <div class="pixelarity-side-opt" id="pixelarity-side-opt-draw"> Draw </div> <div class="pixelarity-side-opt" id="pixelarity-side-opt-filter"> Filters </div> </div>  <div id="pixelarity-filter-opt-cont"><div class="pixelarity-filter-opt pixelarity-active-filter-opt" id="pixelarity-filter-opt-1">None</div><div class="pixelarity-filter-opt" id="pixelarity-filter-opt-2">Grayscale</div><div class="pixelarity-filter-opt" id="pixelarity-filter-opt-3">Chrome</div><div class="pixelarity-filter-opt" id="pixelarity-filter-opt-4">Nova</div><div class="pixelarity-filter-opt" id="pixelarity-filter-opt-5">Blur</div></div>  <div id="pixelarity-draw-opt-color-cont"><div class="pixelarity-draw-opt-color" id="pixelarity-draw-opt-color-1"></div><div class="pixelarity-draw-opt-color" id="pixelarity-draw-opt-color-2"></div><div class="pixelarity-draw-opt-color pixelarity-active-draw-opt-color" id="pixelarity-draw-opt-color-3"></div><div class="pixelarity-draw-opt-color" id="pixelarity-draw-opt-color-4"></div><div class="pixelarity-draw-opt-color" id="pixelarity-draw-opt-color-5"></div><div class="pixelarity-draw-opt-color" id="pixelarity-draw-opt-color-6"></div></div> <div class="pixelarity-img-edit-act pixelarity-img-edit-save"> Done </div><div class="pixelarity-img-edit-act pixelarity-img-edit-cancel"> Cancel </div></div>';
	$("body").append(pixelarityHTML);
		
	//Main Image Editor Object
	window.pixelarity = {

		//Caching Selectors
		can: $('.pixelarity-img-edit-can')[0],
		ctx: null,
		processCan: $('.pixelarity-img-edit-process-can')[0],

		selectionBox: $('.pixelarity-img-edit-select'),
		container: $('.pixelarity-img-edit'),

		saveBtn: $(".pixelarity-img-edit-save"),
		cancelBtn: $('.pixelarity-img-edit-cancel'),

		sideOpts: $(".pixelarity-side-opt"),
		sideOptCrop: $("#pixelarity-side-opt-crop"),
		sideOptDraw: $("#pixelarity-side-opt-draw"),		
		sideOptFilter: $("#pixelarity-side-opt-filter"),		

		drawOptsColorsContainer: $("#pixelarity-draw-opt-color-cont"),
		drawOptsColors: $(".pixelarity-draw-opt-color"),				
		drawOptColor1: $("#pixelarity-draw-opt-color-1"),				
		drawOptColor1: $("#pixelarity-draw-opt-color-2"),				
		drawOptColor1: $("#pixelarity-draw-opt-color-3"),						
		drawOptColor1: $("#pixelarity-draw-opt-color-4"),				
		drawOptColor1: $("#pixelarity-draw-opt-color-5"),				
		drawOptColor1: $("#pixelarity-draw-opt-color-6"),				

		filterOptsContainer: $("#pixelarity-filter-opt-cont"),
		filterOpts: $(".pixelarity-filter-opt"),
		filterOptNone: $("#pixelarity-filter-opt-1"),
		filterOptGray: $("#pixelarity-filter-opt-2"),
		filterOptChrome: $("#pixelarity-filter-opt-3"),
		filterOptNova: $("#pixelarity-filter-opt-4"),
		filterOptBlur: $("#pixelarity-filter-opt-5"),

		//Internal Properties
		drag: false,
		resize: false,

		square: true,
		status: false,

		grcx: null,
		grcy: null,

		callback: null,

		imageType: null,
		imageQuality: 1,

		tool: "crop",

		drawing: false,
		colors: ["000000", "ffffff", "2795f3", "ec5454", "2ecc71", "efd244"],
		drawColor: "2795f3",

		//Open the Image Editor with appropriate settings
		open: function(imgObj, square, callback, imageType, imageQuality){

			if(imgObj.constructor !== File || !imgObj.type.match('image.*')){
				return false;
			}

			this.drag = false;
			this.resize = false;
			
			this.changeTool("crop");

			//Using the supplied settings or using defaults in case of invalid settings

			this.square = (square === true) ? true : false;
			this.imageQuality = (Number(imageQuality) > 0 && Number(imageQuality) <= 1) ? Number(imageQuality) : 1;

			if(imageType == "jpeg" || imageType == "png" || imageType == "gif" || imageType == "bmp"){ //JPG and any other would default to JPEG//
				this.imageType = imageType;
			}else{
				this.imageType = "jpeg";	
			}

			//false: Not In Use
			this.grcx = false;
			this.grcy = false;					

			//Checking if callback is a valid function
			var getType = {};
			this.callback = (callback && getType.toString.call(callback) === '[object Function]') ? callback : false;
			 
			this.status = true;

			this.ctx = this.can.getContext("2d");

			//Shwoing the conatiner on screen
			pixelarity.container.css("display","block").stop().animate({"opacity":"1"});

			var img = new Image();
			var that =  this;

			//Draw the image on the visible canvas depending on the aspect ratio of the image.
			$(img).on("load", function(){

				if(img.width > img.height){
					that.can.width = img.width;
					that.can.height = img.height;

					that.can.style.width = ($(window).width()/2*1)+"px"; 
					that.can.style.height = (img.height*(($(window).width()/2*1)/img.width))+"px";
	
					
					pixelarity.ctx.fillStyle = '#fff'; 
					pixelarity.ctx.fillRect(0, 0, that.can.width, that.can.height);

					pixelarity.ctx.drawImage(img, 0, 0, that.can.width, that.can.height);

					pixelarity.selectionBox.height($(that.can).height()-20);
					pixelarity.selectionBox.width($(that.can).height()-20);

					pixelarity.selectionBox.css({'left': (($(window).width()/2) - $(that.can).height()/2) + 10  + 'px' ,'top': $(window).height()/2 - $(that.can).height()/2 - 15 + 'px' });

				}else if(img.width < img.height){

					that.can.width = img.width;
					that.can.height = img.height;

					that.can.style.width = (img.width*(($(window).height()/3*2)/img.height)) + "px";
					that.can.style.height = ($(window).height()/3*2) + "px"; 

					pixelarity.ctx.fillStyle = '#fff'; 
					pixelarity.ctx.fillRect(0, 0, that.can.width, that.can.height);

					pixelarity.ctx.drawImage(img, 0, 0, that.can.width, that.can.height);

					pixelarity.selectionBox.height($(that.can).width()-20);
					pixelarity.selectionBox.width($(that.can).width()-20);

					pixelarity.selectionBox.css({'left': (($(window).width()/2) - $(that.can).width()/2) + 10  + 'px' ,'top': $(window).height()/2 - $(that.can).width()/2 - 15 + 'px' });


				}else{

					that.can.width = img.width;
					that.can.height = img.height;

					that.can.style.width = ($(window).height()/4.8*3.3) + "px";
					that.can.style.height = ($(window).height()/4.8*3.3) + "px";					


					pixelarity.ctx.fillStyle = '#fff'; 
					pixelarity.ctx.fillRect(0, 0, that.can.width, that.can.height);

					pixelarity.ctx.drawImage(img, 0, 0, that.can.width, that.can.height);

					pixelarity.selectionBox.height($(that.can).width()-20);
					pixelarity.selectionBox.width($(that.can).width()-20);
				
					pixelarity.selectionBox.css({'left': (($(window).width()/2) - $(that.can).width()/2) + 10  + 'px' ,'top': $(window).height()/2 - $(that.can).width()/2 - 15 + 'px' });
				}

				var ratio = pixelarity.can.width/$(pixelarity.can).width();
				var h = pixelarity.can.height * ratio;
				var w = pixelarity.can.width * ratio;		

				pixelarity.processCan.height = h;
				pixelarity.processCan.width = w;		
				
				var pCtx = pixelarity.processCan.getContext("2d");
				pCtx.drawImage(pixelarity.can, 0, 0, w, h);

			});			

			img.src = URL.createObjectURL(imgObj);
			return true;
		},

		changeTool: function(tool){

			if(tool == "crop"){
				this.selectionBox.css("display", "block");

				this.tool = "crop";
				this.sideOpts.removeClass("pixelarity-active-side-opt");
				this.sideOptCrop.addClass("pixelarity-active-side-opt");
				
				this.drawOptsColorsContainer.css("display", "none");
				this.filterOptsContainer.css("display", "none");
				
				
				return true;

			}else if(tool == "draw"){
				
				this.tool = "draw";
				this.sideOpts.removeClass("pixelarity-active-side-opt");
				this.sideOptDraw.addClass("pixelarity-active-side-opt");
				
				this.selectionBox.css("display", "none");
				this.filterOptsContainer.css("display", "none");
				
				this.drawOptsColorsContainer.css("display", "block");

				return true;

			}else if(tool == "filter"){
				this.tool = "filter";
				this.sideOpts.removeClass("pixelarity-active-side-opt");
				this.sideOptFilter.addClass("pixelarity-active-side-opt");
				
				this.drawOptsColorsContainer.css("display", "none");
				this.selectionBox.css("display", "none");

				this.filterOptsContainer.css("display", "block");	
			}

		},

		changeFilter: function(filter){
		
			pixelarity.filterOpts.removeClass("pixelarity-active-filter-opt");
			$("#pixelarity-filter-opt-"+filter).addClass("pixelarity-active-filter-opt");
	
			if(filter == 1){
				pixelarity.ctx.filter = "none";				
			}else if(filter == 2){
				pixelarity.ctx.filter = "grayscale(1)";								
			}else if(filter == 3){
				pixelarity.ctx.filter = "sepia(0.42) saturate(1.4) contrast(1.1)";							
			}else if(filter == 4){
				pixelarity.ctx.filter = "grayscale(0.25) saturate(0.75) contrast(1.5)";								
			}else if(filter == 5){
				pixelarity.ctx.filter = "blur(14px)";				
			}
			this.ctx.height = this.ctx.height;
			this.ctx.drawImage(pixelarity.processCan, 0, 0, pixelarity.can.width,  pixelarity.can.height);
		},

		//Close the image editor and reset the settings.
		close: function(){
			this.drag = false;
			this.resize = false;
			this.square = true;
			this.status = false;
			this.grcx = undefined;
			this.grcy = undefined;
			this.callback = undefined;

			this.can.height = 0;
			this.can.width = 0;

			this.processCan.height = 0;
			this.processCan.width = 0;


			pixelarity.ctx.filter = "none";
			pixelarity.filterOpts.removeClass("pixelarity-active-filter-opt");
			pixelarity.filterOptNone.addClass("pixelarity-active-filter-opt");			

			var pCtx = this.processCan.getContext("2d");			

			pixelarity.ctx.clearRect(0, 0, 0, 0);
			pCtx.clearRect(0, 0, 0, 0);
		
			pixelarity.selectionBox.css({
				"height":'0px',
				"width":'0px',				
			});		

			pixelarity.container.stop().animate({
				"opacity":"0"
			}, 300);

			setTimeout(function(){
				pixelarity.container.css({"display":"none"});
			}, 300);

		}
	}

	//Set flags to stop tracking mouse movement.
	$(document).on("mouseup",function(){
		pixelarity.drag = false;
		pixelarity.resize = false;	
		pixelarity.grcx = false;
		pixelarity.grcy = false;
		pixelarity.drawing = false;
	});


	//Set flags to start trachong mouse movement.
	pixelarity.selectionBox.on("mousedown", function(e){
		var that = $(this);

		var rcx = e.clientX - windowOffset(that).left;
		var rcy = e.clientY - windowOffset(that).top;

		pixelarity.grcx = false;
		pixelarity.grcy = false;

		if( (pixelarity.selectionBox.width() - rcx <= 28) && (pixelarity.selectionBox.height() - rcy <= 28)){
			pixelarity.drag = false;
			pixelarity.resize = true;
		}else{
			pixelarity.drag = true;
			pixelarity.resize = false;
		}

	});

	$(pixelarity.can).on("mousedown", function(e){
		if(pixelarity.tool == "draw"){
			pixelarity.drawing = true;
			var ratio = pixelarity.can.width/$(pixelarity.can).width();
			pixelarity.lastDrawX = (e.clientX - windowOffset($(pixelarity.can)).left) * ratio;
			pixelarity.lastDrawY = (e.clientY - windowOffset($(pixelarity.can)).top) * ratio;

		}
	});


	//Track mouse movements when the flags are set.
	$(document).on('mousemove', function(e){

		var rcx = e.clientX - windowOffset(pixelarity.selectionBox).left;
		var rcy = e.clientY - windowOffset(pixelarity.selectionBox).top;

		if(pixelarity.drag === true && pixelarity.status){

			if(pixelarity.grcx === false){
				pixelarity.grcx = rcx;
			}

			if(pixelarity.grcy === false){
				pixelarity.grcy = rcy;
			}

			var xMove = e.clientX - pixelarity.grcx;
			var yMove = e.clientY - pixelarity.grcy;


			if( (xMove + pixelarity.selectionBox.width() >= $(pixelarity.can).width() + windowOffset($(pixelarity.can)).left) || xMove <= windowOffset($(pixelarity.can)).left){
				if(xMove <= windowOffset($(pixelarity.can)).left){
					pixelarity.selectionBox.css({"left":windowOffset($(pixelarity.can)).left+"px"});
				}else{
					pixelarity.selectionBox.css({"left":windowOffset($(pixelarity.can)).left + $(pixelarity.can).width() - pixelarity.selectionBox.width() + "px"});						
				}
			}else{
				pixelarity.selectionBox.css({"left":xMove+"px"});
			}


			if((yMove + pixelarity.selectionBox.height() >= $(pixelarity.can).height() + windowOffset($(pixelarity.can)).top) || (yMove <= windowOffset($(pixelarity.can)).top) ){
				if(yMove <= windowOffset($(pixelarity.can)).top){
					pixelarity.selectionBox.css({"top":windowOffset($(pixelarity.can)).top+"px"});
				}else{
					pixelarity.selectionBox.css({"top":windowOffset($(pixelarity.can)).top + $(pixelarity.can).height() - pixelarity.selectionBox.height() + "px"});
				}
			}else{
				pixelarity.selectionBox.css({"top":yMove+"px"});
			}

		}else if(pixelarity.resize === true && pixelarity.status){

			var nWidth = rcx;
			var nHeight = rcy;

			if(pixelarity.square){
				if(nWidth >= nHeight){//Width is the dominating dimension; 
					nHeight = nWidth;
					if(nWidth < 100){
						nWidth = 100;
						nHeight = 100;						
					}
				}else{//Height is the dominating dimension; 
					nWidth = nHeight;
					if(nHeight < 100){
						nWidth = 100;
						nHeight = 100;
					}
				}				

				if((nWidth + windowOffset(pixelarity.selectionBox).left) >= $(pixelarity.can).width() + windowOffset($(pixelarity.can)).left){
					nWidth = (windowOffset($(pixelarity.can)).left + $(pixelarity.can).width()) - (windowOffset(pixelarity.selectionBox).left);
					if(windowOffset(pixelarity.selectionBox).top + nWidth > $(pixelarity.can).height() + windowOffset($(pixelarity.can)).top){
						nWidth = (windowOffset($(pixelarity.can)).top + $(pixelarity.can).height()) - (windowOffset(pixelarity.selectionBox).top);
					}
					nHeight = nWidth;
				}else if((nHeight + windowOffset(pixelarity.selectionBox).top) >= $(pixelarity.can).height() + windowOffset($(pixelarity.can)).top){
					nHeight = (windowOffset($(pixelarity.can)).top + $(pixelarity.can).height()) - (windowOffset(pixelarity.selectionBox).top);
					if(windowOffset(pixelarity.selectionBox).left + nHeight > $(pixelarity.can).width() + windowOffset($(pixelarity.can)).left){
						nHeight = (windowOffset($(pixelarity.can)).left + $(pixelarity.can).width()) - (windowOffset(pixelarity.selectionBox).left);
					}
					nWidth = nHeight;
				}


			}else{

				if(nWidth <= 100){
					nWidth = 100;
				}
				if(nHeight <= 100){
					nHeight = 100;
				}			
				if(e.clientX >= $(pixelarity.can).width() + windowOffset($(pixelarity.can)).left){    //REASON: nWidth + windowOffset(pixelarity.selectionBox).left = e.clientX;
					nWidth = (windowOffset($(pixelarity.can)).left + $(pixelarity.can).width()) - (windowOffset(pixelarity.selectionBox).left);
				}
				if(e.clientY >= $(pixelarity.can).height() + windowOffset($(pixelarity.can)).top){	//REASON: Same logic as nWidth
					nHeight = (windowOffset($(pixelarity.can)).top + $(pixelarity.can).height()) - (windowOffset(pixelarity.selectionBox).top);
				}
			}
			
			pixelarity.selectionBox.css({
				"width":nWidth+"px",
				"height":nHeight+"px",				
			});
	
		}else if(pixelarity.drawing && pixelarity.status){

			var ratio = pixelarity.can.width/$(pixelarity.can).width();
			var x = (e.clientX - windowOffset($(pixelarity.can)).left) * ratio;
			var y = (e.clientY - windowOffset($(pixelarity.can)).top) * ratio;
			
			var n = 21;
			
			pixelarity.ctx.fillStyle = "#"+pixelarity.drawColor;
			var pCtx = pixelarity.processCan.getContext("2d");
			pCtx.fillStyle = "#"+pixelarity.drawColor;

			var xMove = (x-pixelarity.lastDrawX) / n, yMove = (y-pixelarity.lastDrawY) / n;

			for(var i = 1; i <= n; i++){					
				pixelarity.ctx.beginPath();			
				pixelarity.ctx.arc(x - (xMove*i), y - (yMove*i), ratio*3 , 0, 2 * Math.PI, false);
				pixelarity.ctx.fill();

				pCtx.beginPath();			
				pCtx.arc((x-xMove*i)*ratio, (y-yMove*i)*ratio, ratio * ratio * 3 , 0, 2 * Math.PI, false);
				pCtx.fill();
			}

			pixelarity.lastDrawX = x;
			pixelarity.lastDrawY = y;		

		}

	});

	//Process the selected region and return it as an image to the user defined callback.
	pixelarity.saveBtn.on("click", function(){

		if(!pixelarity.callback){
			pixelarity.close();
			return;
		}

		if(pixelarity.tool != "crop"){			
			pixelarity.changeTool("crop");
		}

		var ratio = pixelarity.can.width/$(pixelarity.can).width();

		var h = pixelarity.selectionBox.height() * ratio;
		var w = pixelarity.selectionBox.width() * ratio;		
		var x = (windowOffset(pixelarity.selectionBox).left - windowOffset($(pixelarity.can)).left) * ratio;
		var y = (windowOffset(pixelarity.selectionBox).top - windowOffset($(pixelarity.can)).top) * ratio;		

		pixelarity.processCan.height = h;
		pixelarity.processCan.width = w;		
		
		var pCtx = pixelarity.processCan.getContext("2d");

		pCtx.drawImage(pixelarity.can, x, y, w, h, 0, 0, w, h);


		pixelarity.callback(pixelarity.processCan.toDataURL("image/"+pixelarity.imageType, pixelarity.imageQuality));
		pixelarity.close();

	});

	//Close the canvas without processing the image on cancel.
	pixelarity.cancelBtn.on("click", function(){
		pixelarity.close();
	});


	pixelarity.sideOpts.click(function(){
		var t = $(this).attr("id").substr(20);
		pixelarity.changeTool(t);
	});

	//Setup canvas when window is resized. 
	$(window).on("resize", function(){
		if(pixelarity.status){
			pixelarity.selectionBox.css({'left': (($(window).width()/2) - $(pixelarity.can).height()/2) + 10  + 'px' ,'top': $(window).height()/2 - $(pixelarity.can).height()/2 + 10 + 'px' });
		}
	});	

	pixelarity.drawOptsColors.on("click", function(){
		var n = Number($(this).attr("id").substr(26)) - 1;
		pixelarity.drawColor = pixelarity.colors[n];
		pixelarity.drawOptsColors.removeClass("pixelarity-active-draw-opt-color");
		$(this).addClass("pixelarity-active-draw-opt-color");
	});

	pixelarity.filterOpts.on("click", function(){
		var n = Number($(this).attr("id").substr(22));
		pixelarity.changeFilter(n);
	});

});