(function( $ ) {
	$.fn.hexView = function(options) {
		var settings = $.extend( {
			'bytesPerColumn': 4,
			'columns': 4,
			'address': 1280,
			'showAddress': true,
			'littleEndian': true,
			'hover': {'decimal': true, 'binary':true, 'address':true}
		}, options);
		var i;
		
		var bytes = this.text().match(RegExp('[0-9A-Fa-f]{2}\s?','g'));
		var cols = [];
		
		this.html('')
		
		var start_address = 0 + settings.address;
		var rowsize = settings.bytesPerColumn * settings.columns;
		var rows = bytes.length / rowsize;
		
		// add the column of addresses
		if (settings.showAddress) {
			var col = $('<div/>', {
				'class': 'hex-addresses'
			});
			this.append(col);
			
			for (i=0; i<rows; i++){
				col.append('<span class="hex-address">@'+(start_address + rowsize*i)+'</span>');
			}
		}
		
		// add the columns for the chunks
		for (i=0; i<settings.columns; i++){
			var d = $('<div/>', {
				'class': 'hex-col ' + (i%2==0 ? 'hex-col-even' : 'hex-col-odd')
			});
			cols.push(d);
			this.append(d);
		}
		
		// add the bytes to chunks, and the chunks to columns
		var chunkSpan;
		for (i=0; i<bytes.length; i++){
			if (i % settings.bytesPerColumn == 0){
				chunkSpan = $('<span/>', {
					'class': 'hex-chunk'
				});
				chunkSpan.data('address', (start_address + i));
				
				console.log(i, settings.bytesPerColumn, (i % settings.bytesPerColumn), rowsize, (i % rowsize), settings.columns);
				
				cols[(i % rowsize) / settings.bytesPerColumn].append(chunkSpan);
			}
			var byteSpan = $('<span/>', {
				'class': 'hex-byte',
				'text': bytes[i]
			});
			chunkSpan.append(byteSpan);
		}
		
		// and if we need any hover functionality, add that
		if (settings.hover) {
			this.append('<div class="hover-footer">sd</div>');
			this.find('span.hex-chunk').hover(function(e){
				$(this).addClass('over');
				
				var stringRep = $(this).text()
				if (settings.littleEndian){
					stringRep = ''
					$.each($(this).children().get().reverse(),
						function(i, v){stringRep += $(v).text();}
					);
				}
				var val = parseInt(stringRep, 16);
				var hover_string = "@" + $(this).data('address') + ' 0x' + stringRep + ' bin: ' + val.toString(2) + ' dec: ' + val.toString(10);
				$(".hover-footer").text(hover_string);
			},function(){
				$(this).removeClass('over');
			})
		}
	};
})( jQuery );