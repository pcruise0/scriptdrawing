/*
*/

var atable_head = 	[
						//["SELECT","OBJECT", "ID", "LAYER", "DAT1", "DAT2", "DAT3", "DAT4", "DAT5"]
						["OBJECT", "ID", "LAYER", "DAT1", "DAT2", "DAT3", "DAT4", "DAT5"]
					];

var atable_head_layer = 	[
						["NAME", "COLOR", "RGB" ]	//	Layer  , "LineType"
					];

var atable_head_variable = 	[
						["VARIABLE", "VALUE"]	//	Layer
					];

var alayer = [];
var avar = [];
var aentity = [];		// "input" / "line" or "circle"... / Command / ID / Layer
var gaVertex = [];
/*
	entity[0]	entity[1]	entity[2]	entity[3]	entity[4]	entity[5]	entity[6]	entity[7]	entity[8]
	
	point		ID			layer		x1			y1			
	line		ID			layer		x1			y1			x2			y2
	arc			ID			layer		xc			yc			radius		bang		eang
	circle		ID			layer		xc			yc			radius		
	
	pline / spline / text
	table..
*/

var container;
var scene;
var camera;
var renderer;
var acadlines;
var acadcircles;
var acadarcs;
var acadsplines;
var gscanvas_id = 'tabcad';

/*
  CAD Graphic 변수
*/
var dthick_over	= 2;
var dthick   	= 1;
var dpoint_r 	= 3;
var xmax ;
var xmin ;
var ymax ;
var ymin ;
var yymax, yymin, xxmax, xxmin;
var xrange;
var yrange;
var ogmain, og, ox, oy, oXaxis, oYaxis, xscale, yscale;
var dataGroup;
var dwidth, dheight;


function example_click(){

    // wrap의 사이즈 기억하기..
    var dheight = document.getElementById("cad_right").clientHeight;
    var dwidth = document.getElementById("cad_right").clientWidth;

    document.getElementById("cad_right_wrap").style.display = "none";

    var odiv = document.getElementById("div-example");
    odiv.style.display ="block";
    odiv.style.width = dwidth + "px";
    odiv.style.height = dheight + "px";
    //odiv.style.backgroundColor ="cyan";
    odiv.style.position ="relative";

    document.getElementById("div-example-body").style.height = ( dheight - 35 ) + "px";
    document.getElementById("div-example-body").style.width = ( dwidth - 10 ) + "px";;
    //alert("aaa");

}

function example_close(){

    document.getElementById("cad_right_wrap").style.display = "block";
    document.getElementById("div-example").style.display = "none";
	
}

function tabloading(){

	const tabList = document.querySelectorAll('.tab_menu .tablist li');
	
	for(var i = 0; i < tabList.length; i++){
	
		tabList[i].querySelector('.btn-box').addEventListener('click', function(e){ 
		
                e.preventDefault();
                
                for(var j = 0; j < tabList.length; j++){
                
                    tabList[j].classList.remove('is_on');
                    
                }
                
                this.parentNode.classList.add('is_on');
                
            }

		);
	}
}

function cad_init(){

	alayer = [];
	avar = [];
	aentity = [];

	//cadgeometry.init();
	cadobject.init();

	var stargetid = "tablayer";
	
	document.getElementById(stargetid).innerHTML = "";
	
	mod_table.table_create( "tablayer", "tab_excelcad", 1000, "", atable_head_layer, "" );
	mod_table.fixedhead("tab_excelcad");

	var stargetid = "tabvar";
	
	document.getElementById(stargetid).innerHTML = "";
	
	mod_table.table_create( "tabvar", "tab_excelcad", 1000, "", atable_head_variable, "" );
	mod_table.fixedhead("tab_excelcad");
	
	var stargetid = "tabdata";
	
	document.getElementById(stargetid).innerHTML = "";
	
	mod_table.table_create( "tabdata", "tab_excelcad", 1000, "", atable_head, "" );
	mod_table.fixedhead("tab_excelcad");

	var stargetid = "userdata";
	
	document.getElementById(stargetid).innerHTML = "";

	var stargetid = "tabcad";
	
	document.getElementById(stargetid).innerHTML = "";	

	var stargetid = "caddata";
	
	document.getElementById(stargetid).innerHTML = "";	


    //draw_cad_d3();
    //svg_init();
		
}

function openxls_click( sobj ){

	cad_init();
 
	sobj.type	=	'text';
	sobj.type	=	'file';

	var owait = setInterval( 
															
				function(){

						var scontent = document.getElementById( "userdata" ).innerHTML;

						if ( scontent.length !=0 ){

							clearInterval(owait);

                            cadobject.init();							
																																																		
							//-------------------------------------------------------------
							// load excel data
							//      split input data and send to "layer" "variable" "input"
							//-------------------------------------------------------------

							var sdata = scontent.split("<br>");

							for( var i = 0; i < sdata.length; i++ ){
                                //alert("asdfasd  iteraer " + i)														
								if( sdata[i].length != 0){
										
									sdata[i] = sdata[i].replace(" ","");
									sdata[i] = sdata[i].replace(/\t/g, "");
									sdata[i] = sdata[i].replace(/\s/g, "");
									sdata[i] = sdata[i].replace(/\s{2,}/g, "");
									sdata[i] = sdata[i].replace(/(\r\n|\n|\r)/g,"");									
									
									var stext  = sdata[i].split("!!");
									
									// 대문자로 변경
									for( var ii = 0; ii < stext.length; ii++){
										
										stext[ ii ] = stext[ ii ].toUpperCase();
										
									}									
                                    //alert(" staret laod  " + i + " " + stext[1].toUpperCase() + " " + stext[3].toUpperCase() )							
									if( stext[1].toUpperCase() == "LAYER" ){
										//alert("row " + i + " layer " + stext[2])
										alert( stext[3] )
										cadobject.add( stext[1], stext[2], get_colorcode( stext[3] ), stext[4]);
									
									}else if( stext[1].toUpperCase() == "VAR" ){
										//alert("row " + i + "var "  + stext[2])
										cadobject.add( stext[1], stext[2], stext[3]);
										
									}else{
                                                         // shape, comm,     id        layer     
										cadobject.add( stext[1], stext[2], stext[3], stext[4], stext[5], stext[6], stext[7], stext[8], stext[9], stext[10]);
										
									}

								}
							}

							alert( "excel data LOADED!!");
							
							//-------------------------------------------------------------
							// insert data into entity array
							//-------------------------------------------------------------

                            scontent = "";

//alert( "var count " + cadobject.get_var_count())

                            // Variable
                            avar = [];

                            var atemp = [];
                            var atemp1 = [];

							for( var i = 0; i < cadobject.get_var_count(); i++ ){
								
                                atemp = []; 

                                atemp = cadobject.get_var_posi( i );

                                atemp1 = [];

                                atemp1.push(atemp[1]);
                                atemp1.push(Number(atemp[2]).toFixed(3));

                                avar.push( atemp1 );

							}
//alert("var inserted")
                            // Layer
                            alayer = [];

                            var atemp = [];

							for( var i = 0; i < cadobject.get_lay_count(); i++ ){
								
                                atemp = []; 

                                atemp = cadobject.get_lay_posi( i );

                                atemp1 = [];

                                atemp1.push(atemp[1]);  // layer name
                                atemp1.push(atemp[2]);  // layer color
                                atemp1.push( getrgb( atemp[2] ) );  // layer rbg color

                                alayer.push( atemp1 );

                                // CAD DATA에 출력
                                scontent += "LAYER," + atemp[1] + "," + atemp[2] + "," + atemp[3] + "<br>";  

							}
//alert("layer inserted")
                            // Geometry Data
                            aentity = [];
                            gaVertex = [];

							for( var i = 0; i < cadobject.get_object_count(); i++ ){

                                atemp = []; 
                                
                                atemp = cadobject.get_object_posi( i );

                                /*
                                    atemp[0] : shape
                                    atemp[1] : id
                                    atemp[2] : layer
                                    atemp[3] ~ : data
                                */

                                // drawing을 위한 데이터 저장

                                    // id를 비교해서 새로운 object만 vertex에 담는다.   module_cad.js 참조
                                    var dvertex = [];
 
                                    dvertex = cadobject.get_point_posi( i );

                                    if ( dvertex.length > 0 ) {

                    					for ( var j = 0; j < dvertex.length ; j++)	{

                                            var iindex = gaVertex.length;

                                            // 새로운 object일 경우만 추가한다..
                                            gaVertex[iindex] = [];
                                            gaVertex[iindex]["name"]  	=	atemp[1];
                                            gaVertex[iindex]["id"]  	=	atemp[1];
                                            gaVertex[iindex]["shape"] 	=	atemp[0];
                                            gaVertex[iindex]["layer"] 	=	atemp[2];
                                            //gaVertex[iindex]["info"]  	=	geometries[iobject].info();
                                            gaVertex[iindex]["x"] 	 	=	dvertex[j][0];
                                            gaVertex[iindex]["y"] 	 	=	dvertex[j][1];			
                                        }
                                    }

                                // CAD Data 출력
                                scontent += atemp[0] + "," + atemp[1] + ", ," + atemp[2]  + ", ,"    ;
                                

                                if( atemp[0] == "POINT" ){

                                    var ss1, ss2;
                                    ss1 = atemp[3];
                                    ss2 = atemp[4];

                                    scontent += atemp[3] + "," + atemp[4] + ",0,,,,<br>";

                                }else if( atemp[0] == "LINE" ){

                                    scontent += atemp[3] + "," + atemp[4] + ",0," + atemp[5] + "," + atemp[6] + ", ,<br>";

                                }else if( atemp[0] == "CIRCLE" ){

                                    scontent += atemp[3] + "," + atemp[4] + ",0," + atemp[5] + ", , <br>";

                                }else if( atemp[0] == "ARC" ){

                                    scontent += atemp[3] + "," + atemp[4] + ",0," + atemp[5]  + "," + atemp[6] + "," + atemp[7] + "<br>";

                                }
                                
                                // entity 배열에 저장
                                atemp1 = [];

                                //atemp1.push( "<input type='checkbox' style='width:20px; height:20px; display:inline-block; margin:0px;'/>" );

                                for( var j = 0; j < atemp.length; j++){

                                    if( j < 3){

                                        atemp1.push(atemp[j]);

                                    } else {

                                        atemp1.push( Number( atemp[j] ).toFixed(3) );

                                    }
                                        
                                }

                                if(  atemp[0] == "POINT" ){

                                    atemp1.push(" ");
                                    atemp1.push(" ");
                                    atemp1.push(" ");

                                } else if( atemp[0] == "LINE" ){

                                    atemp1.push(" ");

                                } else if( atemp[0] == "CIRCLE" ){

                                    atemp1.push(" ");
                                    atemp1.push(" ");

                                }


                                aentity.push( atemp1 );                                

							}								
 
                            document.getElementById( "caddata" ).innerHTML = scontent;
                            
							//alert( "excel data transfered!!");
                            
							//-------------------------------------------------------------
							// Print / Display Input data to Table
							//-------------------------------------------------------------
							
							var stargetid = "tablayer";
							
							document.getElementById(stargetid).innerHTML = "";
							
							mod_table.table_create( "tablayer", "tab_excelcad", 1000, "", atable_head_layer, alayer );
							mod_table.fixedhead("tab_excelcad");

							var stargetid = "tabvar";
							
							document.getElementById(stargetid).innerHTML = "";
							
							mod_table.table_create( "tabvar", "tab_excelcad", 1000, "", atable_head_variable, avar );
							mod_table.fixedhead("tab_excelcad");
							
							var stargetid = "tabdata";
							
							document.getElementById(stargetid).innerHTML = "";
							
							mod_table.table_create( "tabdata", "tab_excelcad", 1000, "", atable_head, aentity );
							mod_table.fixedhead("tab_excelcad");							
							
							//alert( "excel data printed to table !!");
							

							//-------------------------------------------------------------
							// Draw objects
							//-------------------------------------------------------------

							//draw_cad();

                            draw_cad_d3(); // See below
							
							//alert( scontent );
							alert( "SUCCESSFULLY LOADED!!");
							
						} 
				    }
					
				, 200);		// check every 0.2 seconds	
	
}


function readxls(){

	var aKeys = [];
	
	aKeys[0] = [];
	
	aKeys[0][0] = "INPUT";	// sheet name
	aKeys[0][1] = "PLOT";	// keyword
	aKeys[0][2] = "END";	// keyword
	
	var stargetid = "userdata";
 
	read_xlsx_local( stargetid, aKeys );

}


/*
    D3 graphic
*/

function svg_init(){

    // split data
    dataGroup = d3.nest() 
                    .key(function(d) {return d.name;}) 	// split by ID
                    .entries( gaVertex ); 
 
    xmax = d3.max( gaVertex, function(d) { return d.x; });
    xmin = d3.min( gaVertex, function(d) { return d.x; });
    ymax = d3.max( gaVertex, function(d) { return d.y; });
    ymin = d3.min( gaVertex, function(d) { return d.y; });

    dwidth		=	document.getElementById(gscanvas_id).clientWidth;// - margin.left - margin.right ;
    dheight		=	document.getElementById(gscanvas_id).clientHeight;// - margin.top - margin.bottom ;	
 
    /*
        SET SCALE
        scale = width / dx = height / dy
        therefore, domain should be changed as much as width / height
    */

    xrange = Math.abs( xmax - xmin);
    yrange = Math.abs( ymax - ymin);


    if (xrange >= yrange ) {
        yrange = dheight / dwidth * xrange ;
        yymax = ( ymax + ymin ) / 2 + yrange / 2;
        yymin = ( ymax + ymin ) / 2 - yrange / 2;
        ymax = yymax;
        ymin = yymin;
    } else {
        xrange = dwidth / dheight * yrange ;
        xxmax = ( xmax + xmin ) / 2 + xrange / 2;
        xxmin = ( xmax + xmin ) / 2 - xrange / 2;
        xmax = xxmax;
        xmin = xxmin;
    }

    xscale = d3.scaleLinear()
                .range([ -1, dwidth ])
                .domain( [xmin, xmax] );
                
    yscale = d3.scaleLinear()
                .range([ dheight, -1 ])	
                .domain( [ymin, ymax] );	

    // SVG
    ogmain = d3.select("#" + gscanvas_id )
    .append('svg')  // svg와 g는 다름
    .attr("width", dwidth)
    .attr("height", dheight);

    //***********************************************************************/
    // axis

    // ADD child layer 
    og = ogmain.append("g")
    .attr("width", dwidth )
    .attr("height", dheight );    

    // Add X axis
    // Add Y axis
    oXaxis = d3.axisBottom(xscale);

    oYaxis = d3.axisLeft(yscale);

    oX = ogmain.append('g')
        .attr('transform', "translate(0," + (dheight - 50) + ")")
        .style('font-size', '0.8em')
        .call(oXaxis)       ;

    oY = ogmain.append('g')
        .attr('transform', `translate(50,0)`)
        .style('font-size', '0.8em')
        .call(oYaxis)        ;

    // Add X axis label:
    ogmain.append("text")
        .attr("text-anchor", "end")
        .attr("x", dwidth * 0.5 )
        .attr("y", dheight - 10  )
        .style('font-size', '1.0em')
        .style('fill', 'grey')        
        .text("X");

    // Y axis label:
    ogmain.append("text")
        .attr("text-anchor", "end")
        //.attr("transform", "rotate(-230)")
        .attr("x", 15 )
        .attr("y", dheight * 0.5)
        .style('font-size', '1.0em')
        .style('fill', 'grey')        
        .text("Y");

    //***********************************************************************/

}

function draw_cad_d3(){

    //draw_axis();
	svg_init();

    //***********************************************************************/    
    // activate zoom trigger
    var zoom = d3.zoom()
    .scaleExtent([1/1000,1000])
    //.translateExtent([[-10, -10], [dwidth, dheight]])
    .on("zoom", 

        function () {

            og.attr("transform", d3.event.transform);
            oX.call(oXaxis.scale(d3.event.transform.rescaleX(xscale)));
            oY.call(oYaxis.scale(d3.event.transform.rescaleY(yscale)));              

            //og.select("path").attr('stroke-width', dthick);
            og.selectAll("path").style('stroke-width', dthick / d3.event.scale());
            og.selectAll("line").style('stroke-width', dthick / d3.event.scale());
            //og.selectAll("svg:line").attr('stroke', 'rgb(255,0,0)');
        }
    );

    ogmain.call( zoom );
    //***********************************************************************/    

    //***********************************************************************/    
    //	add Layer	
    for( var i = 0; i < alayer.length; i++ ){
        og.append('g')
          .attr("id","layer" + alayer[i][0] )
          .attr('stroke', getrgb( alayer[i][1] ) )
        .attr("clip-path","url(#clip)");				
    }	
    //***********************************************************************/    


    //***********************************************************************/    
    //	draw 													
    for( var i = 0; i < dataGroup.length; i++ ){    // 각 datagroup마다 포인트만큼 저장되어있다.. datagroup.values[]

        if( dataGroup[i].values[0].shape == "POINT" ){

            // extract color
            scolor = og.select("#layer" + aentity[i][2] ).attr('stroke') ;
            
            og.select("#layer" + dataGroup[i].values[0].layer )
            .append('svg:circle')
            .attr("id",  dataGroup[i].values[0].name )				
            .attr("cx", xscale( dataGroup[i].values[0].x ) )
            .attr("cy", yscale( dataGroup[i].values[0].y ) )
            //.attr('fill', 'none')
            //.attr('shape-rendering', 'crispEdges') 
            .attr('stroke-width', dthick) 
            .attr('fill', scolor)
            .attr("r", dpoint_r)
            .on("mouseover", function (){ d3.select(this).style("stroke-width", dthick_over );}  )
            .on("mouseout", function(){ d3.select(this).style("stroke-width", dthick ); } );

            //.on("mouseover", function(){d3.select(this).style("stroke-width", dwidth_over / zoom.scale() + 'px');})
            //.on("click", function() {		
            //                            var scontent =  showinfo( d3.select(this).attr("id") );
            //                            popup_call( scontent  , d3.event.pageX, d3.event.pageY, 'auto', 'auto' );
            //                        }
            //    )
            //.on("mouseout", function(){ d3.select(this).style("stroke-width", dwidth_out / zoom.scale() + 'px'); } );			
            
        //            alert('d3 point');

        } else if( dataGroup[i].values[0].shape == "LINE" ){

            og.select("#layer" + dataGroup[i].values[0].layer )
            .append('svg:line') 
            .attr("id",  dataGroup[i].values[0].name )				
            .attr("x1", xscale( dataGroup[i].values[0].x ) )
            .attr("y1", yscale( dataGroup[i].values[0].y ) )
            .attr("x2", xscale( dataGroup[i].values[1].x ) )
            .attr("y2", yscale( dataGroup[i].values[1].y ) )
            .attr('stroke-width', dthick / d3.event.scale() ) 
            .attr('fill', 'none')
            .on("mouseover", function (){ d3.select(this).style("stroke-width", dthick_over );}  )
            .on("mouseout", function(){ d3.select(this).style("stroke-width", dthick ); } );

        } else if ( dataGroup[i].values[0].shape == "ARC"){

            var vertex = [];

            for( var j = 0; j < dataGroup[i].values.length; j++ ){
                var iposi = vertex.length;
                vertex[iposi] = [];
                vertex[iposi]['x'] = xscale( dataGroup[i].values[j].x );
                vertex[iposi]['y'] = yscale( dataGroup[i].values[j].y );
            }

            og.select("#layer" + dataGroup[i].values[0].layer )
            .append('svg:path') 
            .attr("id", dataGroup[i].values[0].name )				
            //.attr('d', pathline.arc( vertex ) )  
            .attr('d', d3_path( vertex ) )  
            .attr('stroke-width', dthick ) 
            .attr('fill', 'none')
            .on("mouseover", function (){ d3.select(this).style("stroke-width", dthick_over );}  )
            .on("mouseout", function(){ d3.select(this).style("stroke-width", dthick ); } );

        } else if ( dataGroup[i].values[0].shape == "CIRCLE"){

            var vertex = [];

            for( var j = 0; j < dataGroup[i].values.length; j++ ){
                var iposi = vertex.length;
                vertex[iposi] = [];
                vertex[iposi]['x'] = xscale( dataGroup[i].values[j].x );
                vertex[iposi]['y'] = yscale( dataGroup[i].values[j].y );
            }

            og.select("#layer" + dataGroup[i].values[0].layer )
            .append('svg:path') 
            .attr("id", dataGroup[i].values[0].name )				
            //.attr('d', pathline.arc( vertex ) )  
            .attr('d', d3_path( vertex ) + " Z" )  
            .attr('stroke-width', dthick) 
            .attr('fill', 'none')
            .on("mouseover", function (){ d3.select(this).style("stroke-width", dthick_over );}  )
            .on("mouseout", function(){ d3.select(this).style("stroke-width", dthick ); } );

        }

    }
    //***********************************************************************/    

}


function getrgb( icolor ){
 
    var scolor;

    if( ! isNaN( icolor ) ){
	    
	    if( icolor == 0 ){ scolor =  'rgb(0,0,0)' }   // black
	    if( icolor == 1 ){ scolor = 'rgb(255,0,0)' }   // red
	    if( icolor == 2 ){ scolor = 'rgb(255,255,0)' }   // yellow       
	    if( icolor == 3 ){ scolor = 'rgb(0,255,255)' }   // green
	    if( icolor == 4 ){ scolor = 'rgb(0,255,255)' }   // cyan
	    if( icolor == 5 ){ scolor = 'rgb(0,0,255)' }     // blue
	    if( icolor == 6 ){ scolor = 'rgb(255,0,255)' }   // magneta
	    if( icolor == 7 ){ scolor = 'rgb(0,0,0)' }       // black
	    if( icolor == 8 ){ scolor = 'rgb(128,128,128)' } // grey
	    if( icolor == 9 ){ scolor = 'rgb(139,0,0)' }     // brown
	    if( icolor == 10 ){ scolor = 'rgb(138,128,0)' }  // khaki
	    if( icolor == 11 ){ scolor = 'rgb(0,128,0)' }      // dark green    
	    if( icolor == 12 ){ scolor = 'rgb(70,130,180)' }     // steel blue
	    if( icolor == 13 ){ scolor = 'rgb(0,0,139)' }        // dark blue
	    if( icolor == 14 ){ scolor = 'rgb(128,0,128)' }      // purple
	    if( icolor == 15 ){ scolor = 'rgb(169,169,169)' }    // dark grey
	    if( icolor == 16 ){ scolor = 'rgb(255,255,255)' }    // white
	    if( icolor == 17 ){ scolor = 'rgb(211,211,211)' }    // ligbht grey    

    } else {

	    if( icolor.toUpperCase() == 'BLACK' ){ scolor =  'rgb(0,0,0)' }   // black
	    if( icolor.toUpperCase() == 'RED' ){ scolor = 'rgb(255,0,0)' }   // red
	    if( icolor.toUpperCase() == 'YELLOW' ){ scolor = 'rgb(255,255,0)' }   // yellow       
	    if( icolor.toUpperCase() == 'GREEN' ){ scolor = 'rgb(0,255,0)' }   // green
	    if( icolor.toUpperCase() == 'CYAN' ){ scolor = 'rgb(0,255,255)' }   // cyan
	    if( icolor.toUpperCase() == 'BLUE' ){ scolor = 'rgb(0,0,255)' }     // blue
	    if( icolor.toUpperCase() == 'MAGNETA' ){ scolor = 'rgb(255,0,255)' }   // magneta
	    if( icolor.toUpperCase() == 'GREY' ){ scolor = 'rgb(128,128,128)' } // grey
	    if( icolor.toUpperCase() == 'PURPLE' ){ scolor = 'rgb(128,0,128)' }      // purple
	    if( icolor.toUpperCase() == 'WHITE' ){ scolor = 'rgb(255,255,255)' }    // white
	    
    }
	
    return scolor;
}    

function get_colorcode( icolor ){

	if( icolor.toUpperCase() == 'BLACK' ){ scolor =  '0' }   // black
	if( icolor.toUpperCase() == 'RED' ){ scolor = '1' }   // red
	if( icolor.toUpperCase() == 'YELLOW' ){ scolor = '2' }   // yellow       
	if( icolor.toUpperCase() == 'GREEN' ){ scolor = '3' }   // green
	if( icolor.toUpperCase() == 'CYAN' ){ scolor = '4' }   // cyan
	if( icolor.toUpperCase() == 'BLUE' ){ scolor = '5' }     // blue
	if( icolor.toUpperCase() == 'MAGNETA' ){ scolor = '6' }   // magneta
	if( icolor.toUpperCase() == 'GREY' ){ scolor = '8' } // grey
	if( icolor.toUpperCase() == 'PURPLE' ){ scolor = '14' }      // purple
	if( icolor.toUpperCase() == 'WHITE' ){ scolor = '16' }    // white
	    
	return scolor;

}

	


// convert path bezier data
function d3_path( apts ){

    var sPath;
    
    sPath = "";

    sPath = "M " + apts[0]['x'] + " " + apts[0]['y'] + " C "; 

    for( var i = 1 ;  i < apts.length ; i++) {

        sPath += apts[i]['x'] + " " + apts[i]['y'] + " " ;

    }        

    return sPath

}

