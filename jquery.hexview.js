(function( $ ) {
	$.fn.hexView = function(options) {
		var settings = $.extend( {
			'split': 4,
			'columns': 8,
			'address': 1280,
			'showAddress': true,
			'hover': {'decimal': true, 'binary':true, 'address':true}
		}, options);
		var i;
		
		chunks = this.text().match(RegExp('.{1,' + settings.split + '}','g'));
		cols = [];
		
		this.html('')
		
		// add the column of addresses
		if (settings.showAddress) {
			start = 0 + settings.address;
			rowsize = settings.split * settings.columns;
			rows = chunks.length / settings.columns;
			
			console.log(rows);
			console.log(rowsize);
			console.log(start);
			
			col = $('<div/>', {
				'class': 'hex-addresses'
			});
			this.append(col);
			
			for (i=0; i<rows; i++){
				col.append('<span class="hex-chunk">@'+(start + rowsize*i)+'</span>');
			}
		}
		
		// add the columns for the chunks
		for (i=0; i<settings.columns; i++){
			d = $('<div/>', {
				'class': 'hex-col ' + (i%2==0 ? 'hex-col-even' : 'hex-col-odd')
			});
			cols.push(d);
			this.append(d);
		}
		
		// add the chunks
		for (i=0; i<chunks.length; i++){
			cols[i%settings.columns].append('<span class="hex-chunk">'+chunks[i]+'</span>');
		}
		
		// and if we need any hover functionality, add that
		if (settings.hover) {
			this.append('<div class="hover-footer">hi there</div>');
			//this.hover(function(){})
		}
	};
})( jQuery );