	function read_xlsx_local( stargetid, akeys ){
		
	//alert("aa " + stargetid + " " +  akeys.length);
		
		// akeys : 0 - sheetname, 1 - start keyword , 2 - end keyword
		// set input file
		var f = document.getElementById( 'uploadfile' ).files[0]; //input file 객체를 가져온다.

		var reader = new FileReader();

		reader.onload = function() {

			var xlsx_sheet, sheetname;

			var data = reader.result;

			var workbook = XLSX.read(data, {type: 'array'}); // parse the file

			var shtml = '';
				
			var workbook = XLSX.read(data, {type:"array"});

			/* DO SOMETHING WITH workbook HERE */
			// Load data
			for( var i = 0 ; i < akeys.length ; i++ ){
				
				sheetname = akeys[i][0];

				xlsx_sheet = workbook.Sheets[ sheetname ]; // get the first worksheet  // 대소문자 구분
				
				if( xlsx_sheet ) {
					
					shtml += xlsx_loading( xlsx_sheet, sheetname, akeys[i][1], akeys[i][2] ) ;
					
				}	
				
			}
			
			//alert( shtml );
			// attach shtml data to ... somwhere & firing event
			document.getElementById(stargetid).innerHTML = shtml;			
			
		}
		
		// "reader" trigger
		 reader.readAsArrayBuffer(f);
		
	}

	function read_xlsx_server( sfilepath, stargetid, akeys ){

		/* akeys		: sheetname, begin key name , end key name */

		var ares; 
	   /* set up async GET request */
		var req = new XMLHttpRequest();
		req.open("GET", sfilepath);
		req.responseType = "arraybuffer";

		req.onload = function(e) {

			var shtml = '';
			//var ares;
			var data = '' ;
			    data = new Uint8Array(req.response);
			var workbook = XLSX.read(data, {type:"array"});

			/* DO SOMETHING WITH workbook HERE */
			// Load data
			for( var i = 0 ; i < akeys.length ; i++ ){
				
				sheetname = akeys[i][0];
				
				xlsx_sheet = workbook.Sheets[ sheetname ]; // get the first worksheet  // 대소문자 구분
				
				if( xlsx_sheet ) {
					
					shtml += xlsx_loading( xlsx_sheet, sheetname, akeys[i][1], akeys[i][2] ) ;
					
				}	
				
			}
//alert( shtml );
			// attach shtml data to ... somwhere & firing event
			document.getElementById(stargetid).innerHTML = shtml;			
		  
		}

		req.send();		

		return ares;
		
	}

	function read_xlsx_trigger( sid_file, sid_inputdata, sid_trigger){

		var 	input_tag = document.getElementById( sid_file ) ;
				input_tag.style.display		= 'none';
				input_tag.onclick			= function() { 															
															 document.getElementById( sid_inputdata ).contentDocument.body.innerHTML = '';
														}
														
				input_tag.onchange		= function() { 															

															
															 //read_RMMACRO();
															
															// javacode															
															this.type	=	'text';
															this.type	=	'file';
															
															//document.getElementById('userdata').contentDocument.location.reload(true);
															// I.E 에서는 Alert 가 작동할 동안 iframe에 데이터가 출력이 되어, TCL파일을 만들수 있었으나,
															//	Chrome에서는 작동하지 않음..
															
															// solution..
															//		iframe에 데이터가 들어올때까지 기다림..
															var owait = setInterval( 
															
																				function(){
																					
																					var scontent = document.getElementById( sid_inputdata ).contentDocument.body.innerHTML;
																					
																					if ( scontent.length !=0 ){
																						
																						clearInterval(owait);
																																																																		
																						document.getElementById( sid_trigger ).click();
																						
																					} 
																				}
																				
																			, 200);		// check every 0.2 seconds
																														
														}
														
	}

	function xlsx_loading( xlsx_sheet, sheetname, skey1, skey2 ){

		var range = XLSX.utils.decode_range( xlsx_sheet['!ref'] ); 

		var ic_b ;
		var ic_e = range.e.c;
		var ir_b, ir_e;
		
		var shtml = '';
		var shtml_r = '';
		var cell, cell0;
		// find max row
		var a;
		a = xlsx_find_keyword( xlsx_sheet, skey1 ); 
		ic_b = a[ 'c' ] ;
		ir_b = a[ 'r' ] + 1;

		a = xlsx_find_keyword( xlsx_sheet, skey2 );
		ir_e = a[ 'r' ] - 1 ;

		for( ia = ir_b; ia <= ir_e; ia++){

			shtml_r = '';
			cell 	= null;
			cell0	= null;
			
			for( ib = ic_b; ib <= ic_e; ib++){

				cell = xlsx_sheet[XLSX.utils.encode_cell({c:ib , r:ia})];
				
				if( ib == ic_b ){ cell0 = cell }
				
				if( cell != null ){
									
					shtml_r += cell.v + "!!";
					//shtml_r += XLSX.utils.format_cell( cell ) + "!!";  // formatted value
					
				} else {
					
					shtml_r += "!!";
				}
			
			}
			
			// 첫 칸 데이터 공백시 무시
			if( cell0 != null ){
				shtml += sheetname + "!!" + shtml_r + "<br>";
			}
			
		}

		return shtml;
	}	

	function xlsx_find_keyword( xlsx_sheet, skeyword ){
		
		var cell, ovalue;
		var bres;
		var res = [];
		var range = XLSX.utils.decode_range( xlsx_sheet['!ref'] ); 
		
		bres = false;
		for( ia = 0; ia <= range.e.r; ia++ ){

			for( ib = 0; ib <= range.e.c; ib++ ){
		
				cell = xlsx_sheet[XLSX.utils.encode_cell({c:ib , r:ia})];
				
				if( cell != null ){
					
					ovalue = XLSX.utils.format_cell(cell);

	//	alert( 'cell ' + ia + " , " + ib + " , " + ovalue );			
					
					if( ovalue.toUpperCase() == skeyword.toUpperCase() ){
						
						res[ 'c' ] = ib;
						res[ 'r' ] = ia;
						bres = true;
						
						return res;
						//break; 
					}
				}
			}
			
	//		if( bres == true ){
	//			
	//			break ;
	//		}
		}
		
		alert( 'failed to find : ' + skeyword );
	}


/*
	ExcelJS 
		- sheet delete / add
		- write data on cell
		
	
	refer :
	https://github.com/exceljs/exceljs		
*/

//	function save_xlsx_server(){
//
//		// Create Excel File
//		var wb = new ExcelJS.Workbook();
//		//var wb = createAndFillWorkbook();
//	
//	var ws = wb.addWorksheet('mcrp_fabrication'); 
//
//		// add header keyword
//		ws.getRow( 1 ).getCell( 1 ).value 		= 'FAB';
//	//	
//	//	//for( var i = 0 ; i < ahead.length; i++){
//	//	ws.getRow( 19 ).getCell( 2 + 1 ).value 		= 'aa';
//	//	ws.getRow( 19 ).getCell( 2 + 2 ).value 		= 'aa';
//	//	ws.getRow( 19 ).getCell( 2 + 3 ).value 		= 'aa';
//	//	//}
//	//	
//	//	// add end keyword
//	//	ws.getRow( 30 ).getCell( 1 ).value 		= 'END';
//	//
//	//	// export excel
//	//
//		var sfilename = "sema_mcrp.xlsx";
//	//	
//alert( 'aaa' );		//
//		wb.xlsx.writeFile( sfilename ).then(function () {
//  alert("Done OK.");
//})
//.catch(function (err) {
//  //console.error(err.stack);
//});	;
//	//	
//
//	//	//var buff = wb.xlsx.writeBuffer().then(function (data) {
//	//	//var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
//	//	//saveAs(blob, sfilename);
//	//	//});	   
//	//	
//		
//	}


//
//	this.exportExcelJS= function(){ 
//
//		// Create Excel File
//		var wb = new ExcelJS.Workbook();
//		var ws = wb.addWorksheet('My Sheet', {pageSetup:{paperSize: 9, orientation:'portrait'}}); //'landscape'
//
//		// adjust pageSetup settings afterwards
//		ws.pageSetup.margins = {
//		  left: 1.1 / 2.54, right: 1.1/ 2.54,
//		  top: 1.9/ 2.54, bottom: 1.9/ 2.54,
//		  header: 0.8/ 2.54, footer: 0.8/ 2.54
//		};
//		ws.properties.defaultRowHeight = 16;
//		// Set Print Area for a sheet
//		ws.pageSetup.printArea = 'A1:I45';
//		ws.pageSetup.horizontalCentered = true;
//
//		// set column width
//		ws.getColumn(1).width =  2;
//		ws.getColumn(2).width = 12;
//		ws.getColumn(3).width = 12;
//		ws.getColumn(4).width = 12;
//		ws.getColumn(5).width = 12;
//		ws.getColumn(6).width = 12;
//		ws.getColumn(7).width = 12;
//		ws.getColumn(8).width = 12;
//		ws.getColumn(9).width =  2;
//
//		// set column font
//		ws.getColumn(1).font = {name:'verdana', size:9};
//		ws.getColumn(2).font = {name:'verdana', size:9};
//		ws.getColumn(3).font = {name:'verdana', size:9};
//		ws.getColumn(4).font = {name:'verdana', size:9};
//		ws.getColumn(5).font = {name:'verdana', size:9};
//		ws.getColumn(6).font = {name:'verdana', size:9};
//		ws.getColumn(7).font = {name:'verdana', size:9};
//		ws.getColumn(8).font = {name:'verdana', size:9};
//		ws.getColumn(9).font = {name:'verdana', size:9};
//
//		// set column numformat
//		ws.getColumn(1).numFmt = '0.000';
//		ws.getColumn(2).numFmt = '0.000';
//		ws.getColumn(3).numFmt = '0.000';
//		ws.getColumn(4).numFmt = '0.000';
//		ws.getColumn(5).numFmt = '0.000';
//		ws.getColumn(6).numFmt = '0.000';
//		ws.getColumn(7).numFmt = '0.000';
//		ws.getColumn(8).numFmt = '0.000';
//		ws.getColumn(9).numFmt = '0.000';
//		
//		// set single thin border around A1
//		//		argb : 		black 			FF000000
//		//		argb : 		white 			FFFFFFFF
//		//		argb : 		yellow 			FFFFFF00
//		//		argb : 		red				FFFF0000
//		//		argb : 			crimson		FFDC143C
//		//		argb : 			orangered	FFFF4500
//		//		argb : 			Oragne		FFFFA500
//		//		argb : 		blue			FF0000FF
//		
//		//		argb : 		cyan 			FF00FFFF
//		//		argb : 		magneta			FFFF00FF
//		//		argb : 		lime			FF00FF00
//		//		argb : 	limegreen			FF32CD32
//		//		argb : 		violet			FFEE82EE
//		
//		//		argb : light grey 			FFD3D3D3
//		//		argb : dark	 grey 			FFA9A9A9
//		//		argb : 	 	 grey 			FF808080
//		//		argb : dim 	 grey 			FF696969
//
//		// styles
//		var sborder1 = {
//		  top: 		{style:'medium', color: {argb:'FF00FF00'}},
//		  left: 	{style:'medium', color: {argb:'FF00FF00'}},
//		  bottom: 	{style:'medium', color: {argb:'FF00FF00'}},
//		  right: 	{style:'medium', color: {argb:'FF00FF00'}}
//		};
//
//		var sborder_head = {
//		  top: 		{style:'thin', color: {argb:'FF000000'}},
//		  bottom: 	{style:'thin', color: {argb:'FF000000'}},
//		  //bottom: 	{style:'medium', color: {argb:'FF000000'}},
//		};
//		var sborder_bottom = {
//		  bottom: 	{style:'thin', color: {argb:'FF000000'}},
//		  //bottom: 	{style:'medium', color: {argb:'FF000000'}},
//		};
//		var sfill_grey = {  type: 'pattern',  pattern:'solid', fgColor : {argb:'FFD3D3D3'} };  // light grey
//
//
//		// Print Title
//		ws.mergeCells('B1:H1');
//		ws.getCell('B1').value = 'Pylon Form Setting Sheet';
//		ws.getCell('B1').alignment = { horizontal:'center'} ;
//		ws.getCell('B1').font = {
//			name: 'Verdana',
//			size: 16,
//			//underline: true,
//			bold: true
//		};
//
//		// Project info
//		ws.getCell('B3').value = 'PROJ CODE :';
//		ws.getCell('B3').font = { name: 'Verdana', size: 9, bold:true };
//			ws.getCell('C3').value = aprojinfo[0];
//			ws.getCell('C3').alignment = { horizontal:'center'} ;
//
//		ws.getCell('D3').value = 'PROJ NAME :';
//		ws.getCell('D3').font = { name: 'Verdana', size: 9, bold:true };
//		ws.getCell('D3').alignment 	= { horizontal:'center'} ;
//		
//		ws.mergeCells('E3:F3');
//		ws.getCell('E3').value = aprojinfo[1];
//			ws.getCell('E3').alignment = { horizontal:'center'} ;
//			
//		ws.getCell('G3').value = 'DATE :';
//		ws.getCell('G3').alignment 	= { horizontal:'center'} ;
//		ws.getCell('G3').font = { name: 'Verdana', size: 9, bold:true };
//			var sdate = new Date().toISOString().split('T')[0];
//			ws.getCell('H3').value = sdate;
//			ws.getCell('H3').alignment = { horizontal:'center'} ;
//			
//		ws.getCell('B4').value = 'PART :';
//		ws.getCell('B4').font = { name: 'Verdana', size: 9, bold:true };
//
//		ws.getCell('C4').value = acase[0];
//		ws.getCell('C4').alignment = { horizontal:'center'} ;
//
//		ws.getCell('D4').value = 'CON. STAGE :';
//			ws.getCell('D4').alignment = { horizontal:'center'} ;
//			ws.getCell('D4').font = { name: 'Verdana', size: 9, bold:true };
//
//		// target stage & elev
//		var sstage = 'asd' ; //document.getElementById( 'constg' ).innerHTML;
//		var delev = 'adsd' ; //document.getElementById( 'conelev' ).value;
//alert('aa');													
//		// add stage info
//		ws.mergeCells('E4:F4');
//		ws.getCell('E4').value =  sstage + " at Elev " + delev;
//		ws.getCell('E4').alignment = { horizontal:'center'} ;
//		
//		// COORD. SYSTEM
//		ws.getCell('B6').value = 'Coordinate System & Control Points Layout :';
//		ws.getCell('B6').font = { name: 'Verdana', size: 9, bold:true };
//
//		//	ADD image
//		//var simgfile = "./" + acase[0] + '.jpg';
////		var simgfile = "./PY1L.jpg";
////		const imageId1 = wb.addImage({ filename: simgfile, extension: 'jpeg'});
////		alert( simgfile );
////		//ws.addImage(imageId1, 'B2');
////		ws.addImage(imageId1, {
////		  tl: { col: 1.5, row: 1.5 },
////		  br: { col: 3.5, row: 5.5 }
////		});
//
//		// Theoretical Coordinate
//		ws.getCell('B17').value = 'Theoretical Coordinate :';
//		ws.getCell('B17').font = { name: 'Verdana', size: 9, bold:true };
//
//		var ahead = ['POINT', 'Long.(M)', 'Elev(M)', 'Trans(M)', 'Xg(M)', 'Yg(M)', 'Zg(M)'];
//
//		for( var i = 0 ; i < ahead.length; i++){
//			ws.getRow( 19 ).getCell( 2 + i ).value 		= ahead[i];
//			ws.getRow( 19 ).getCell( 2 + i ).alignment 	= { horizontal:'center'} ;
//			ws.getRow( 19 ).getCell( 2 + i ).border 	= sborder_head;
//			ws.getRow( 19 ).getCell( 2 + i ).fill 		= sfill_grey;
//		}
//
//		for( var i = 0 ; i < atheo.length; i++){
//			
//			for (var j = 0; j <= 6; j++ ){
//				
//				ws.getRow( 20 + i ).getCell( 2 + j ).value = atheo[i][j];
//				ws.getRow( 20 + i ).getCell( 2 + j ).alignment = { horizontal:'center'} ;
//				
//			}
//						
//			if( i == atheo.length - 1 ){
//				for (var j = 2; j <= 8; j++ ){
//					ws.getRow( 20 + i ).getCell( j ).border 	= sborder_bottom;				
//				}
//			}
//		}
//		
//		/* CAMBER & CORRECTION */
//		ws.getCell('B25').value = 'Camber & Correction :';
//		ws.getCell('B25').font = { name: 'Verdana', size: 9, bold:true };
//		
//		// 	header
//		var ahead = [ 'CamLong(mm)', 'CamElev(mm)', 'CamTran(mm)', 'Corr.Long(mm)', 'Corr.Elev(mm)', 'Corr.Tran(mm)'];
//
//		for( var i = 0 ; i < ahead.length; i++){
//			ws.getRow( 27 ).getCell( 3 + i ).value = ahead[i];
//			ws.getRow( 27 ).getCell( 3 + i ).alignment = { horizontal:'center'} ;
//			ws.getRow( 27 ).getCell( 3 + i ).border 	= sborder_head;
//			ws.getRow( 27 ).getCell( 3 + i ).fill 		= sfill_grey;
//		}
//		// 	data
//		for( var i = 0 ; i < acamcorr.length; i++){
//
//			for (var j = 0; j <= 5; j++ ){
//				
//				ws.getRow( 28 + i ).getCell( 3 + j ).value 		= acamcorr[i][j];
//				ws.getRow( 28 + i ).getCell( 3 + j ).alignment 	= { horizontal:'center'} ;
//				ws.getRow( 28 + i ).getCell( 3 + j ).border 	= sborder_bottom;
//				
//			}
//			
//		}
//		
//		/* Form Setting Target before Casting */
//		ws.getCell('B30').value = 'Form Setting Target before Casting :';
//		ws.getCell('B30').font = { name: 'Verdana', size: 9, bold:true };
//
//		// 	header
//		var ahead = ['POINT', 'Long.(M)', 'Trans(M)', 'Elev(M)', 'Xg(M)', 'Yg(M)', 'Zg(M)'];
//
//		for( var i = 0 ; i < ahead.length; i++){
//			ws.getRow( 32 ).getCell( 2 + i ).value = ahead[i];
//			ws.getRow( 32 ).getCell( 2 + i ).alignment = { horizontal:'center'} ;
//			ws.getRow( 32 ).getCell( 2 + i ).border 	= sborder_head;
//			ws.getRow( 32 ).getCell( 2 + i ).fill 		= sfill_grey;
//		}
//
//		// 	data
//		for( var i = 0 ; i < abfcast.length; i++){
//
//			for (var j = 0; j <= 6; j++ ){
//				
//				ws.getRow( 33 + i ).getCell( 2 + j ).value 		= abfcast[i][j];
//				ws.getRow( 33 + i ).getCell( 2 + j ).alignment 	= { horizontal:'center'} ;
//				
//				if( i == abfcast.length - 1 ){
//					ws.getRow( 33 + i ).getCell( 2 + j ).border 	= sborder_bottom;
//				}
//				
//			}
//			
//		}
//
//		// export excel
//
//		var sfilename = "Form_Setting_" + acase[0] + ".xlsx";
//		var buff = wb.xlsx.writeBuffer().then(function (data) {
//		var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
//		saveAs(blob, sfilename);
//		});	   
//  
//	}
//
