Hexview Plugin for JQuery
=============

Renders a chunk of hex values (such as copied from a hex editor) in nice columns, with an ASCII representation, and hover functionality.  This hover functionality can show each chunk as hex, binary, decimal, or a custom function.  Supports big and little endian byte formats.

See sample.html for an example.

Usage
------------
	<div id="hex">50 00 00 00 00 00 00 00 49 00 42 00 32 00 3F 00 30 00 39 00 2B 00 3F 00 39 00 3B 00 5E 00 17 00 1A 00 43 00 5C 00 3B 00 30 00 39 00 32 00 37 00 2D 00 36 00 5C 00 40 00 34 00 9F 00 5E 00 08 00</div>
	
	<script type="text/javascript">                                         
	$(document).ready(function() {
		function stringXOR(num){
			return 'XOR: ' + String.fromCharCode(num ^ 0x7E);
		}
		$('#hex').hexView({'address':30592, 'bytesPerColumn':2, 'columns':8, 'hover':{'custom':stringXOR, 'address':true, 'decimal':true}});
	});
	</script>
