(function( $ ) {
	"use strict";
	$.fn.hexView = function(options) {
		var settings = $.extend( {
			'bytesPerColumn': 1,
			'columns': 16,
			'address': 0,
			'showAddress': true,
			'showAscii': true,
			'littleEndian': true,
			'hover': {'address':true, 'hex':true, 'decimal':true, 'binary':false, 'custom':false},
			'selectHistory': true
		}, options);
		
		function ascii(hex){
			var str = '.';
			var num = parseInt(hex, 16);
			if (num >= 32){
				str = String.fromCharCode(num);
			}
			return str;
		}
		
		function lpad(str, pad, length) {
			while (str.length < length){
				str = pad + str;
			}
			return str;
		}
		
		function chunkString(span){
			var stringRep = span.text();
			if (settings.littleEndian){
				stringRep = '';
				$.each(span.children().get().reverse(),
					function(i, v){stringRep += $(v).text();}
				);
			}
			stringRep = stringRep.replace(/\s/, '');
			return stringRep;
		}
		
		function hoverString(span){
			var stringRep = chunkString(span);
			var num = parseInt(stringRep, 16);
			var str = "";
			
			if (settings.hover.address){
				str += "@" + span.data('address') + ' ';
			}
			if (settings.hover.hex){
				str += '0x' + stringRep + ' ';
			}
			if (settings.hover.decimal){
				str += 'dec: ' + num.toString(10) + ' ';
			}
			if (settings.hover.binary){
				str += 'bin: ' + lpad(num.toString(2), '0', settings.bytesPerColumn * 8) + ' ';
			}
			if (settings.hover.custom){
				str += settings.hover.custom(num);
			}
			
			return str;
		}
		
		var top = this;
		// split the hex content into bytes
		// and redisplay as columns
		var i;
		
		var bytes = this.text().match(/[0-9A-Fa-f]{2}\s*/g);
		var hex_cols = [];
		
		this.addClass('hex-viewer').html('');
		
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
		var hexColumns = $('<div/>', {
			'class': 'hex-columns'
		});
		this.append(hexColumns);
		for (i=0; i<settings.columns; i++){
			var hexCol = $('<div/>', {
				'class': 'hex-col ' + ((i%2)===0 ? 'hex-col-even' : 'hex-col-odd')
			});
			hex_cols.push(hexCol);
			hexColumns.append(hexCol);
		}
		
		// add the bytes to chunks, and the chunks to columns
		var chunkSpan;
		for (i=0; i<bytes.length; i++){
			if ((i % settings.bytesPerColumn) === 0){
				chunkSpan = $('<span/>', {
					'class': 'hex-chunk chunk'+(start_address + i)
				});
				chunkSpan.data('address', (start_address + i));
				hex_cols[(i % rowsize) / settings.bytesPerColumn].append(chunkSpan);
			}
			var byteSpan = $('<span/>', {
				'class': 'hex-byte',
				'text': bytes[i]
			});
			chunkSpan.append(byteSpan);
		}
		
		// add the ascii columns too
		if (settings.showAscii){
			var asciiHolder = $('<div/>', {
				'class': 'hex-ascii'
			});
			this.append(asciiHolder);
			
			var ascii_cols = [];
			for (i=0; i<settings.columns; i++){
				var asciiCol = $('<div/>', {
					'class': 'hex-ascii-col ' + ((i%2)===0 ? 'hex-ascii-col-even' : 'hex-ascii-col-odd')
				});
				ascii_cols.push(asciiCol);
				asciiHolder.append(asciiCol);
			}
			
			var asciiSpan;
			for (i=0; i<bytes.length; i++){
				if ((i % settings.bytesPerColumn) === 0){
					asciiSpan = $('<span/>', {
						'class': 'hex-ascii-chunk chunk'+(start_address + i)
					});
					asciiSpan.data('address', (start_address + i));
					ascii_cols[(i % rowsize) / settings.bytesPerColumn].append(asciiSpan);
				}
				var asciiByte = $('<span/>', {
					'class': 'hex-ascii-byte',
					'text': ascii(bytes[i])
				});
				asciiSpan.append(asciiByte);
			}
		}
		
		// and if we need any hover functionality, add that
		if (settings.hover) {
			this.append('<div class="hex-hover-footer"></div>');
			this.find('span.hex-chunk').hover(function(e){
				$(this).addClass('over');
				// show the hover text
				top.find(".hex-hover-footer").text(hoverString($(this)));
				// and highlight the ascii
				top.find('.hex-ascii .chunk' + $(this).data('address')).addClass('over');
			},function(){
				$(this).removeClass('over');
				top.find('.hex-ascii-chunk.over').removeClass('over');
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
				top.find(".hex-history-footer").append(historySpan);
			});
		}
	};
})( jQuery );