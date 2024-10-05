var mod_table = new function(){

	this.fixedhead	= function( starget_table ){

		// Fixed Head Code !!!"
		document.getElementById( starget_table ).addEventListener("scroll",function(){
			var translate = "translate(0,"+this.scrollTop+"px)";
		   
			const allTh = this.querySelectorAll("th");
			for( let i=0; i < allTh.length; i++ ) {
				allTh[i].style.transform = translate;
			}
						
		});
				
	}
	
	// create table into target DIV
	//
	//		sdiv 		: target div
	//		acolsize 	: column width
	//		ahead 	: head data, 필요없으면 '' 로 전송
	//		adata	: body data, 필요없으면 '' 로 전송
		
	this.table_create = function(sdiv, stableid, itable_width, acolsize, ahead, adata){

		var odiv = document.getElementById( sdiv );
		// header / body 추가
		//		acolsize가 없으면 default : 90px;
		var sHTML;
		
		if( itable_width ){
			sHTML 	= "<table id='" + stableid + "' style='width:" + itable_width + "px; margin:auto;'>";
			
		} else {
			sHTML 	= "<table id='" + stableid + "' style='margin:auto;'>";
		}
		
		sHTML += "<thead >";

		if( ahead ){

			for( var j = 0; j < ahead.length; j++){
			
				sHTML += "<tr >";
				//sHTML += "<tr style='position:sticky; top:0;'>";

				if( acolsize !== '' ){
				
					for( var i = 0; i < ahead[j].length; i++){
						
						sHTML += "<th style='width:" + acolsize[i] + "px;'>" + ahead[j][i] + "</th>";
						
					}
					
				} else {

					for( var i = 0; i < ahead[j].length; i++){
						
						sHTML += "<th style='width:90px;'>" + ahead[j][i] + "</th>";
						
					}
					
				}
				
				sHTML += "</tr>";
			
			}
			
		}
		
		sHTML += "</thead>";
		
		sHTML += "<tbody style='width:100%; height:100%; overflow:auto;'>";
		
		if( adata ){
			
			for( var j = 0; j < adata.length; j++){
			
				sHTML += "<tr>";
				
					for( var i = 0; i < adata[j].length; i++){
						
						if( acolsize !== '' ){
							
							sHTML += "<td style='width:" + acolsize[i] + "px;'>" + adata[j][i] + "</td>";
							
						} else {

							sHTML += "<td style='width:90px; '>" + adata[j][i] + "</td>";
						
						}
					}		
					
				sHTML += "</tr>";
			}
		}
		
		sHTML += "</tbody>";
		
		sHTML += "</table>";
		
		odiv.innerHTML = sHTML;
		
	}

		
	this.table_add = function(sdiv, acolsize, ahead, adata){

		var odiv = document.getElementById( sdiv );
		// header / body 추가
		//		acolsize가 없으면 default : 30px;
		var sHTML;
		sHTML  = "<div id='" + sdiv + "_div_head' style='height:100%; overflow:auto; padding:0px;' >";
		sHTML += "<table >";
		
		sHTML += "<thead>";
		sHTML += "<tr>";

		if( acolsize !== '' ){
		
			for( var i = 0; i < ahead.length; i++){
				
				sHTML += "<th style='width:" + acolsize[i] + "px;'>" + ahead[i] + "</th>";
				
			}
			
		} else {

			for( var i = 0; i < ahead.length; i++){
				
				sHTML += "<th style='width:90px;'>" + ahead[i] + "</th>";
				
			}
			
		}
		
		sHTML += "</tr>";
		sHTML += "</thead>";
		
		sHTML += "<tbody>";
		
		if( adata ){
			for( var j = 0; j < adata.length; j++){
			
				sHTML += "<tr>";
				
					for( var i = 0; i < adata[j].length; i++){
						
						if( acolsize !== '' ){
							
							sHTML += "<td style='width:" + acolsize[i] + "px;'>" + adata[j][i] + "</td>";
							
						} else {

							sHTML += "<td style='width:90px;'>" + adata[j][i] + "</td>";
						
						}
					}		
					
				sHTML += "</tr>";
			}
		}
		
		sHTML += "</tbody>";
		
		sHTML += "</table>";
		sHTML += "</div>";	
		
		odiv.innerHTML = sHTML;
		
	}
		

	this.getvalues = function(tableid){
		
		var res = [];
		
		var table = document.getElementById( tableid );
		
		for (var r = 0, n = table.rows.length; r < n; r++) {
			
			res[r] = []
			for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
				
				res[r][c] = table.rows[r].cells[c].innerHTML;
				
			}
		}
		
		return res;
		
	}		

// End of Doucument !!	
}
