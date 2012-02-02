(function( $ ) {
	$.fn.hexView = function(options) {
		var settings = $.extend( {
			'bytesPerColumn': 4,
			'columns': 4,
			'address': 0,
			'showAddress': true,
			'showAscii': true,
			'littleEndian': true,
			'hover': {'address':true, 'hex':true, 'decimal':true, 'binary':false},
			'selectHistory': true
		}, options);
		var i;
		
		var bytes = this.text().match(RegExp('[0-9A-Fa-f]{2}\s?','g'));
		var hex_cols = [];
		var ascii_cols = [];
		
		this.html('');
		this.addClass('hex-viewer');
		
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
			var hexCol = $('<div/>', {
				'class': 'hex-col ' + (i%2==0 ? 'hex-col-even' : 'hex-col-odd')
			});
			hex_cols.push(hexCol);
			this.append(hexCol);
		}
		
		if (settings.showAscii){
			var asciiHolder = $('<div/>', {
				'class': 'hex-ascii'
			});
			this.append(asciiHolder);
			
			for (i=0; i<settings.columns; i++){
				var asciiCol = $('<div/>', {
					'class': 'hex-ascii-col ' + (i%2==0 ? 'hex-ascii-col-even' : 'hex-ascii-col-odd')
				});
				ascii_cols.push(asciiCol);
				asciiHolder.append(asciiCol);
			}
		}
		
		// add the bytes to chunks, and the chunks to columns
		var chunkSpan;
		var asciiSpan;
		for (i=0; i<bytes.length; i++){
			if (i % settings.bytesPerColumn == 0){
				chunkSpan = $('<span/>', {
					'class': 'hex-chunk chunk'+(start_address + i)
				});
				chunkSpan.data('address', (start_address + i));
				var col_index = (i % rowsize) / settings.bytesPerColumn;
				hex_cols[col_index].append(chunkSpan);
				
				if (settings.showAscii){
					asciiSpan = $('<span/>', {
						'class': 'hex-ascii-chunk chunk'+(start_address + i)
					});
					asciiSpan.data('address', (start_address + i));
					ascii_cols[col_index].append(asciiSpan);
				}
			}
			var byteSpan = $('<span/>', {
				'class': 'hex-byte',
				'text': bytes[i]
			});
			chunkSpan.append(byteSpan);
			
			if (settings.showAscii){
				var asciiByte = $('<span/>', {
					'class': 'hex-ascii-byte',
					'text': str(bytes[i])
				});
				asciiSpan.append(asciiByte);
			}
		}
		
		function str(hex){
			strRep = '.';
			var num = parseInt(hex, 16);
			if (num >= 32){
				strRep = String.fromCharCode(num);
			}
			return strRep;
		}
		
		function lpad(str, pad, length) {
			while (str.length < length){
				str = pad + str;
			}
			return str;
		}
		
		function chunkString(span){
			var stringRep = span.text()
			if (settings.littleEndian){
				stringRep = ''
				$.each(span.children().get().reverse(),
					function(i, v){stringRep += $(v).text();}
				);
			}
			return stringRep;
		}
		
		function hoverString(span){
			var stringRep = chunkString(span);
			var num = parseInt(stringRep, 16);
			var hoverString = "";
			
			if (settings.hover.address)
				hoverString += "@" + span.data('address') + ' '
			if (settings.hover.hex)
				hoverString += '0x' + stringRep + ' '
			if (settings.hover.decimal)
				hoverString += 'dec: ' + num.toString(10) + ' '
			if (settings.hover.binary)
				hoverString += 'bin: ' + lpad(num.toString(2), '0', settings.bytesPerColumn * 8) + ' '
			
			return hoverString;
		}
		
		// and if we need any hover functionality, add that
		if (settings.hover) {
			this.append('<div class="hex-hover-footer"></div>');
			this.find('span.hex-chunk').hover(function(e){
				$(this).addClass('over');
				// show the hover text
				$(".hex-hover-footer").text(hoverString($(this)));
				// and highlight the ascii
				$('.hex-ascii .chunk' + $(this).data('address')).addClass('over');
			},function(){
				$(this).removeClass('over');
				$('.hex-ascii-chunk.over').removeClass('over');
			});
		}
		
		// and the select history
		if (settings.selectHistory){
			this.append('<div class="hex-history-footer"></div>');
			this.find('span.hex-chunk').click(function(e){
				var historySpan = $('<span/>', {
					'class': 'hex-history-line',
					'text': hoverString($(this))
				});
				$(".hex-history-footer").append(historySpan);
			});
		}
	};
})( jQuery );