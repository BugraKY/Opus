$(document).ready(function(){
	$("#file").change(function(e){
		
		var img = e.target.files[0];

		if(!pixelarity.open(img, false, function(res){
			$("#result").attr("src", res);
		}, "jpg", 0.7)){
			alert("Whoops! That is not an image!");
		}

	});
});