var embedImage = function (image, embedImage) {
	console.log('gonna embed', embedImage, 'in', image);
	var sWidth = image.width, sHeight = image.height;
	
	var tmp = document.createElement('canvas');
	var tmpContext = tmp.getContext('2d');
	tmp.width = sWidth; tmp.height = sHeight;
	
	tmpContext.drawImage(image, 0, 0);
	
	// $('body').append(tmp);
	
	var embed = document.createElement('canvas');
	var embedContext = embed.getContext('2d');
	embed.width = embedImage.width;
	embed.height = embedImage.height;
	embedContext.drawImage(embedImage, 0, 0);
	
	
  var embedData = embedContext.getImageData(0, 0, embed.width, embed.height);
  var origData = tmpContext.getImageData(0,0, embed.width, embed.height);
  
  var blackCount = 0;
  var whiteCount = 0;
  var count = 0;
  
  for (var x = 0; x < embedData.width; x++) {
    for (var y = 0; y < embedData.height; y++) {
      var idx = (x + y * embedData.width) * 4;
      
      // The RGB values
      var r = embedData.data[idx + 0];
      var g = embedData.data[idx + 1];
      var b = embedData.data[idx + 2];
      
      // The original RGB values
      var or = origData.data[idx + 0];
      var og = origData.data[idx + 1];
      var ob = origData.data[idx + 2];
      
      
      var isBlack = (r<=50) && (g<=50) && (b<=50);
      if (isBlack) ++blackCount; else ++whiteCount;
      
      var isOdd = ((or+og+ob)%2);
      var pixel = [or,og,ob];
      var fixedPixel = fixPixel(pixel, isBlack);
      // var fixedPixel = makeOddPixel(pixel, isOdd);
      
      
      embedData.data[idx + 0] = fixedPixel[0];
      embedData.data[idx + 1] = fixedPixel[1];
      embedData.data[idx + 2] = fixedPixel[2];
    }
  }
  tmpContext.putImageData(embedData, 0, 0);
  
  return tmp.toDataURL();
}

var fixPixel = function (pixel, needOdd) {
	var r = pixel[0], g = pixel[1], b = pixel[2];

	// see if odd already
	var isOdd = !((r+g+b) % 2);
	
	if ((needOdd && !isOdd) || (!needOdd && isOdd)) {
		if (r <= g && r <= b) {
			if (r==0) r++;
			else r--;
		}
		else if (g <= r && g <= b) {
			if (g == 0) g++;
			else g--;
		} else if (b <= r && b <= g) {
			if (b == 0) b++;
			else b--;
		}
		
	}
	return [r,g,b];
}

var parseImage = function (image) {
	var sWidth = image.width, sHeight = image.height;
	
	var tmp = document.createElement('canvas');
	var tmpContext = tmp.getContext('2d');
	tmp.width = sWidth; tmp.height = sHeight;
	
	tmpContext.drawImage(image, 0, 0);
	
	// $('body').append(tmp);
	
	
  var imageData = tmpContext.getImageData(0,0, tmp.width, tmp.height);
  for (var x = 0; x < tmp.width; x++) {
    for (var y = 0; y < tmp.height; y++) {
      var idx = (x + y * tmp.width) * 4;
      
      // The RGB values
      var r = imageData.data[idx + 0];
      var g = imageData.data[idx + 1];
      var b = imageData.data[idx + 2];
      
      var isOdd = !!((r+g+b) % 2);
      
      imageData.data[idx + 0] = isOdd ? 255 : 0;
      imageData.data[idx + 1] = isOdd ? 255 : 0;
      imageData.data[idx + 2] = isOdd ? 255 : 0;
    }
  }
  tmpContext.putImageData(imageData, 0, 0);
  
  return tmp.toDataURL();
}

// $(function() {
// 	$('#carrier').on('load', function () {
// 		$('#embed').on('load', function() {
// 			var result = embedImage($('#carrier')[0], $('#embed')[0]);
			
			
// 			var newImage = $('<img/>').attr('src', result).appendTo('body');
// 			console.log('result?', result);
// 			// parseImage(newImage[0]);
// 		});
// 	});

// 	$('#output').on('load', function() {
// 				var result = parseImage($('#output')[0])
				
// 				var newImage = $('<img/>').attr('src', result).appendTo('body');
// 	})
// });