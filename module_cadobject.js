/*  SUMMARY
  cadobject
      this.prt_dxf        // dxf 포맷 출력
      this.add            // cad object add
      this.check_id
    	this.check_var
      this.get_info
      this.get_point_posi
      this.get_info_posi
      this.get_object_posi  
      this.get_var_posi
      this.get_lay_posi
      this.get_var
      this.replace_var
      this.get_object_count  
      this.get_var_count
      this.get_lay_count  
      this.get_layer_color
      this.get_layer_linetype
      this.get_point
      this.get_line

  cadpoint / cadline / cadarc / cadcircle
      this.add
      this.info
      this.get_point

*/

var cadobject = new function(){

/*
	define
	
	Copy / offset 
	': copy 	: ref line / dx / dy / repeat
	': offset 	: ref line / +-doffset / repeat	
	
	point 		: x1 / y1 
	Line 		: x1 / y1 / x2 / y2
	circle 		: x1 / y1 / r
	arc 		: x1 / y1 / r / bang / eang
*/	

	var ocadobj = [];
	var ocadvar	= [];
	var ocadlay	= [];
	var iobjposi, sid, srefid, irep, x1, y1, x2, y2, dx, dy, radius;
	var bang, eang, dr, dtheta, doff;
	var scolor, sltype, slayer;

	var otbar_tipb	= [];
	var otbar_tipe	= [];
	var otbar_segment = [];
	
   this.init = function(){

        ocadobj  = [];
        ocadvar  = [];
        ocadlay  = [];
	   
        otbar_tipb  = [];
        otbar_tipe  = [];
        otbar_segment  = [];

   }

    this.prt_dxf = function(){
        
        var scontent;

        scontent = "";

        // Layer
        var atemp = [];

        for( var i = 0; i < cadobject.get_lay_count(); i++ ){
            
            atemp = []; 

            atemp = cadobject.get_lay_posi( i );

            // CAD DATA에 출력
            scontent += "LAYER," + atemp[1] + "," + atemp[2] + "," + atemp[3] + "<br>";  

        }

        for( var i = 0; i < cadobject.get_object_count(); i++ ){

            atemp = []; 
            
            atemp = cadobject.get_object_posi( i );

            /*
                atemp[0] : shape
                atemp[1] : id
                atemp[2] : layer

                atemp[3] ~ : data
            */

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
        }

        return scontent;

    }
  
   this.add = function( sshape, scomm, sdat1, sdat2, sdat3, sdat4, sdat5, sdat6, sdat7, sdat8){
                                    // id    layer (refid)
        sshape = sshape.toUpperCase();
        scomm = scomm.toUpperCase(); 
    
	if ( sshape == "LAYER") {
       
            sid = scomm.toUpperCase();
            //scolor = sdat1;
            //sltype = sdat2;
            
            // duplicate check
            //( "layer " + sid + " checked " + this.check_id(sid) )
            if (! this.check_id(sid)){

                //iobjposi = ocadobj.length;
                //ocadobj[ iobjposi ] = new cadlayer();
                //ocadobj[ iobjposi ].add( sid, scolor, sltype);	// id, color, linetype

                var atemp = [];
                atemp.push( sshape );	
                atemp.push( sid );	    // layer name
                atemp.push( sdat1 );	// layer color
                //atemp.push( sdat2 );	// layer linetype ???

                ocadlay.push( atemp );	

            } else {
                
                alert( sid + " is duplicated ");
                
            }

	}else if ( sshape == "VAR") {
             
            sid = scomm.toUpperCase();

            //alert( sshape + " " + sid + " " + sdat1 + " " + this.check_var(sid) );
            
            // duplicate check
            if (! this.check_var(sid)){

                var atemp = [];
                atemp.push( sshape );	
                atemp.push( sid );	// var name
                atemp.push( sdat1 );	// var value

                ocadvar.push( atemp );	

            } else {
                
                alert( sid + " is duplicated ");
                
            }
        
	}else if ( sshape == "POINT") {
 
            sid = sdat1.toUpperCase();
            slayer = sdat2;

	   if( scomm == "ADD" ){

                // duplicate check
                if (! this.check_id(sid)){

                    // change var value
                    //slayer = sdat2;
                    x1 = this.replace_var( sdat3 ) * 1.0;
                    y1 = this.replace_var( sdat4 ) * 1.0;

                    iobjposi = ocadobj.length;
                    ocadobj[ iobjposi ] = new cadpoint();
                    ocadobj[ iobjposi ].add( sid, slayer, x1, y1);	// id, layer, x1, y1
                
                } else {

                    alert( sid + " is duplicated ");

                }
          
	   }else if( scomm == "COPY" ){	

				// sdat1, sdat2,  sdat3, sdat4, sdat5, sdat6
				// id	, layer, ref_pt, 	dx,    dy, repeat num
                //sid = sdat1;
                srefid = sdat3;

                var atemp = this.get_info( srefid );
        
                if( atemp != false ){

                    // copy data
                    dx = this.replace_var( sdat4 ) * 1.0;
                    dy = this.replace_var( sdat5 ) * 1.0;
                    irep = this.replace_var( sdat6 ) * 1.0;

                    // ref data
                    x1 = atemp[3] * 1.0;
                    y1 = atemp[4] * 1.0;

                    
                    if( irep >=2 ){
                    
                        for( i = 1 ; i <= irep; i++){

                            iobjposi = ocadobj.length;
                            ocadobj[ iobjposi ] = new cadpoint();

                            if( i == 1){

                                ocadobj[ iobjposi ].add( sid , slayer, x1 + dx * i, y1 + dy * i);	// id, layer, x1, y1

                            } else {

                                ocadobj[ iobjposi ].add( sid + "-" + ( i - 1 ), slayer, x1 + dx * i, y1 + dy * i);	// id, layer, x1, y1

                            }

                        }
                    
                    } else {

                        iobjposi = ocadobj.length;
                        ocadobj[ iobjposi ] = new cadpoint();
                        ocadobj[ iobjposi ].add( sid, slayer, x1 + dx, y1 + dy);	// id, layer, x1, y1
                    
                    }
                
                } else{
                
                   alert( "Failed to find the reference point, " + srefid )
                
                }

			}else if( scomm == "INT" ){	

                // duplicate check
                if (! this.check_id(sid)){

                    var pt1 = this.get_line( sdat3 );
                    var pt2 = this.get_line( sdat4 );

                    //alert( " Line " + sdat3 + " , " + pt1[0] + " , " + pt1[1] + " , " + pt1[2] + " , " + pt1[3] )
                    //alert( " Line " + sdat4 + " , " + pt2[0] + " , " + pt2[1] + " , " + pt2[2] + " , " + pt2[3] )
                    var pt11 = [];
                    var pt12 = [];
                    var pt21 = [];
                    var pt22 = [];

                    pt11[0] = pt1[0];
                    pt11[1] = pt1[1];
                    pt12[0] = pt1[2];
                    pt12[1] = pt1[3];

                    pt21[0] = pt2[0];
                    pt21[1] = pt2[1];
                    pt22[0] = pt2[2];
                    pt22[1] = pt2[3];

                    var pt3 = [];

                    pt3 = geo_intersect( pt11, pt12, pt21, pt22 );

                    //alert( "int   " + pt3[0] + "   " + pt3[1]);

                    x1 = pt3[0] * 1.0 ;
                    y1 = pt3[1] * 1.0 ;

                    iobjposi = ocadobj.length;
                    ocadobj[ iobjposi ] = new cadpoint();
                    ocadobj[ iobjposi ].add( sid, slayer, pt3[0] , pt3[1] );	// id, layer, x1, y1

                } else {

                    alert( sid + " is duplicated ");

                }

            }
			
	}else if ( sshape == "LINE") {
             
            sid = sdat1.toUpperCase();
            slayer = sdat2.toUpperCase();

			if( scomm == "ADD" ){
          
              // duplicate check
              if (! this.check_id(sid)){

                // change var value
                x1 = this.replace_var( sdat3 ) * 1.0;
                y1 = this.replace_var( sdat4 ) * 1.0;
                x2 = this.replace_var( sdat5 ) * 1.0;
                y2 = this.replace_var( sdat6 ) * 1.0;

                iobjposi = ocadobj.length;
                ocadobj[ iobjposi ] = new cadline();
                ocadobj[ iobjposi ].add( sid, slayer, x1, y1, x2, y2);	

              } else {

                alert( sid + " is duplicated ");

              } 
          
			}else if( scomm == "COPY" ){

                srefid = sdat3.toUpperCase();
                
                var atemp = this.get_info( srefid );
                
                if( atemp != false ){
                    // copy
                    dx = this.replace_var( sdat4 ) 
                    dy = this.replace_var( sdat5 ) 
                    irep = this.replace_var( sdat6 ) 
                    
                    // ref data
                    x1 = atemp[3] * 1.0;
                    y1 = atemp[4] * 1.0;
                    x2 = atemp[5] * 1.0;
                    y2 = atemp[6] * 1.0;
                    
                    if( irep >=2 ){
                    
                      for( var i = 1 ; i <= irep; i++){

                          iobjposi = ocadobj.length;
                          ocadobj[ iobjposi ] = new cadline();

                          if( i != 1){

                            ocadobj[ iobjposi ].add( sid + "-" + (i-1), slayer, x1 + dx * i, y1 + dy * i, x2 + dx * i, y2 + dy * i);	// id, layer, x1, y1

                          }else{

                            ocadobj[ iobjposi ].add( sid , sdat2, x1 + dx * i, y1 + dy * i, x2 + dx * i, y2 + dy * i);	// id, layer, x1, y1

                          }
                          
                      }
                    
                    } else {

                      iobjposi = ocadobj.length;
                      ocadobj[ iobjposi ] = new cadline();
                      ocadobj[ iobjposi ].add( sid, slayer, x1 + dx, y1 + dy, x2 + dx, y2 + dy);	// id, layer, x1, y1
                    
                    }        

                } else{
                
                    alert( "Failed to find the reference line, " + srefid )
                
                }
        
			}else if( scomm == "OFFSET" ){
				
                srefid = sdat3.toUpperCase();
                
                var atemp = this.get_info( srefid );

                if( atemp != false ){
                    // offset
                    doff = this.replace_var( sdat4 ) * 1.0;
                    irep = this.replace_var( sdat5 ) * 1.0;
                
                    // ref data
                    var pt1 = [];
                    var pt2 = [];
                    pt1[0] = atemp[3] * 1.0;
                    pt1[1] = atemp[4] * 1.0;
                    pt2[0] = atemp[5] * 1.0;
                    pt2[1] = atemp[6] * 1.0;
            
                    // dx / dy due to offset

                    atemp = geo_offset(pt1, pt2, doff);

                    x1 = atemp[0];
                    y1 = atemp[1];
                    x2 = atemp[2];
                    y2 = atemp[3];
                
                    dx = atemp[4];
                    dy = atemp[5];

                    if( irep >=2 ){
                    
                        for( i = 1 ; i <= irep; i++){

                            iobjposi = ocadobj.length;
                            ocadobj[ iobjposi ] = new cadline();

                            if( i != 1){

                            	ocadobj[ iobjposi ].add( sid + "-" + (i-1), sdat2, x1 + dx * i, y1 + dy * i, x2 + dx * i, y2 + dy * i);	// id, layer, x1, y1

                            }else{

                            	ocadobj[ iobjposi ].add( sid , sdat2, x1 + dx * i, y1 + dy * i, x2 + dx * i, y2 + dy * i);	// id, layer, x1, y1

                            }
                            
                        }
                    
                    } else {

                        iobjposi = ocadobj.length;
                        ocadobj[ iobjposi ] = new cadline();
                        ocadobj[ iobjposi ].add( sid, sdat2, x1 + dx, y1 + dy, x2 + dx, y2 + dy);	// id, layer, x1, y1
                    
                    }        

                } else{
                
                    alert( "Failed to find the reference line, " + srefid )
                
                }        

            }else if( scomm == "2P" ){
				
                // sdat2 : layer , sdat3 : ref.pt1 , sdat4 : ref.pt2
                //sid = sdat1.toUpperCase();
                //alert( "asdfasdf " + sid + " " + sdat3 + " " + sdat4)

                var apt1 = this.get_point( sdat3 );
                var apt2 = this.get_point( sdat4 );

                if ( apt1 && apt2 ){

                    iobjposi = ocadobj.length;
                    ocadobj[ iobjposi ] = new cadline();

                    ocadobj[ iobjposi ].add( sid, slayer, apt1[0], apt1[1], apt2[0], apt2[1]);	// id, layer, x1, y1

                } else {

                    alert( "Failed to find the reference point " + sdat3 + " , " + sdat4 )

                }
/*
*/
	   }
			
	}else if ( sshape == "ARC") {
             
            sid = sdat1.toUpperCase();
            slayer = sdat2.toUpperCase();

			if( scomm == "ADD" ){
            
                // duplicate check
                if (! this.check_id(sid)){

                    // change var value
                    x1 = this.replace_var( sdat3 ) * 1.0;  // xc
                    y1 = this.replace_var( sdat4 ) * 1.0;  // yc
                    radius = this.replace_var( sdat5 ) * 1.0;  // radius
                    bang = this.replace_var( sdat6 ) * 1.0;  // bang
                    eang = this.replace_var( sdat7 ) * 1.0;  // eang
                    
                    iobjposi = ocadobj.length;
                    ocadobj[ iobjposi ] = new cadarc();
                    ocadobj[ iobjposi ].add( sid, slayer, x1, y1, radius, bang, eang);	

                } else {

                    alert( sid + " is duplicated ");

                }
        
			}else if( scomm == "COPY" ){

                srefid = sdat3;
                
                var atemp = this.get_info( srefid );
                
                if( atemp != false ){
                    // copy
                    dx = this.replace_var( sdat4 )  * 1.0;
                    dy = this.replace_var( sdat5 )  * 1.0;
                    dr = this.replace_var( sdat6 )  * 1.0;
                    dtheta = this.replace_var( sdat7 )  * 1.0;
                    irep = this.replace_var( sdat8 ) ;
                    
                    // ref data
                    x1 = atemp[3] * 1.0;
                    y1 = atemp[4] * 1.0;
                    radius = atemp[5] * 1.0;
                    bang = atemp[6] * 1.0;
                    eang = atemp[7] * 1.0;
                    
                    if( irep >=2 ){
                    
                      for( i = 1 ; i <= irep; i++){

                          iobjposi = ocadobj.length;
                          ocadobj[ iobjposi ] = new cadarc();

                          if( i != 1){

                              ocadobj[ iobjposi ].add( sid + "-" + (i-1), slayer, x1 + dx * i, y1 + dy * i, radius + dr * i, bang + dtheta * i, eang + dtheta * i);	// id, layer, x1, y1

                          } else {
                          
                              ocadobj[ iobjposi ].add( sid, slayer, x1 + dx * i, y1 + dy * i, radius + dr * i, bang + dtheta * i, eang + dtheta * i);	// id, layer, x1, y1
                              
                          }
                          
                      }
                    
                    } else {

                      iobjposi = ocadobj.length;
                      ocadobj[ iobjposi ] = new cadarc();
                      ocadobj[ iobjposi ].add( sid, slayer, x1 + dx, y1 + dy, radius + dr, bang + dtheta, eang + dtheta);	// id, layer, x1, y1
                      
                    }
                
                } else{
                
                    alert( "Failed to find the reference Arc, " + srefid )
                
                }

            }else if( scomm == "3P" ){

                var apt1 = this.get_point( sdat3 ) ;
                var apt2 = this.get_point( sdat4 ) ;
                var apt3 = this.get_point( sdat5 ) ;
                
                var atemp = geo_arc3p( apt1, apt2, apt3 );

                x1 = atemp[0] * 1.0;
                y1 = atemp[1] * 1.0;
                radius = atemp[3] * 1.0;

                apt2 = [];

                apt2[0] = x1;
                apt2[1] = y1;

                bang = geo_angle( apt2, apt1);  // degree
                eang = geo_angle( apt2, apt3);  // degree

                if ( apt1 && apt2 && apt3 ){

                    iobjposi = ocadobj.length;
                    ocadobj[ iobjposi ] = new cadarc();
                    ocadobj[ iobjposi ].add( sid, slayer, atemp[0], atemp[1], atemp[3], bang, eang);

                } else {

                    alert( "Failed to find the reference point " + sdat3 + " , " + sdat4 + " , " + sdat5 )

                }

	   }  
			
	}else if ( sshape == "CIRCLE") {
             
            sid = sdat1.toUpperCase();
            slayer = sdat2.toUpperCase();

	   if( scomm == "ADD" ){

                // duplicate check
                if (! this.check_id(sid)){

                    // change var value
                    x1 = this.replace_var( sdat3 ) * 1.0;
                    y1 = this.replace_var( sdat4 ) * 1.0;
                    radius = this.replace_var( sdat5 ) * 1.0;

                    iobjposi = ocadobj.length;
                    ocadobj[ iobjposi ] = new cadcircle();
                    ocadobj[ iobjposi ].add( sid, slayer, x1, y1, radius);
                    
                } else {

                    alert( sid + " is duplicated ");

                }        
        
	   }else if( scomm == "COPY" ){

                srefid = sdat3;	
                
                var atemp = this.get_info( srefid );
                
                if( atemp != false ){
                    // copy
                    dx = this.replace_var( sdat4 )  * 1.0;
                    dy = this.replace_var( sdat5 )  * 1.0;
                    dr = this.replace_var( sdat6 )  * 1.0;
                    irep = this.replace_var( sdat7 ) ;
                    
                    // ref data
                    x1 = atemp[3] * 1.0;
                    y1 = atemp[4] * 1.0;
                    radius = atemp[5] * 1.0;
                    
                    if( irep >=2 ){
                    
                      for( i = 1 ; i <= irep; i++){

                          iobjposi = ocadobj.length;
                          ocadobj[ iobjposi ] = new cadcircle();

                          if( i != 1){

                            ocadobj[ iobjposi ].add( sid + "-" + (i-1), slayer, x1 + dx * i, y1 + dy * i, radius + dr * i);	// id, layer, x1, y1

                          } else {

                            ocadobj[ iobjposi ].add( sid, slayer, x1 + dx * i, y1 + dy * i, radius + dr * i);	// id, layer, x1, y1

                          }  
                          
                      }
                    
                    } else {

                      iobjposi = ocadobj.length;
                      ocadobj[ iobjposi ] = new cadcircle();
                      ocadobj[ iobjposi ].add( sid, sdat2, x1 + dx, y1 + dy, radius + dr);	// id, layer, x1, y1
                    
                    }        

                } else{
                
                   alert( "Failed to find the reference circle, " + srefid )
                
                }
        
            }else if( scomm == "3P" ){

                var apt1 = this.get_point( sdat3 );
                var apt2 = this.get_point( sdat4 );
                var apt3 = this.get_point( sdat5 );
                
                var atemp = geo_arc3p( apt1, apt2, apt3 );

                if ( apt1 && apt2 && apt3 ){

                    iobjposi = ocadobj.length;
                    ocadobj[ iobjposi ] = new cadcircle();
                    ocadobj[ iobjposi ].add( sid, slayer, atemp[0], atemp[1], atemp[3]);

                } else {

                    alert( "Failed to find the reference point " + sdat3 + " , " + sdat4 + " , " + sdat5 )

                }

            }
                
	}else if ( sshape == "TBAR") {

            sid = sdat1.toUpperCase();
            slayer = sdat2.toUpperCase();
		
	    ' 참고 : function( sshape, scomm, sdat1, sdat2, sdat3, sdat4, sdat5, sdat6, sdat7, sdat8){
		    
	   if( scomm.toUpperCase() == "ADD" ){

                // duplicate check
                if (! this.check_id(sid)){

                    // change var value
                    ddia = this.replace_var( sdat3 ) * 1.0;
                    dbend_r = this.replace_var( sdat4 ) * 1.0;

                    iobjposi = ocadobj.length;
                    ocadobj[ iobjposi ] = new cadtbar();
                    ocadobj[ iobjposi ].add( sid, slayer, dia, radius);
                    
                } else {

                    alert( sid + " is duplicated ");

                }        
		   
 	   }else if( scomm.toUpperCase() == "TIPB" ){

		   atemp = [];
		   atemp[0] = sdat1.toUpperCase();	' reference id
		   atemp[1] = sdat2;			' tip length
		   atemp[2] = sdat3.toUpperCase();	' Cut / Bend
		   atemp[3] = sdat4;			' angle
		   atemp[4] = sdat5.toUpperCase();	' CW / CCW
		   
		   iobjposi = otbar_tipb.length;
		   otbar_tipb[ iobjposi ] = atemp;
		   
 	   }else if( scomm.toUpperCase() == "TIPE" ){

		   atemp = [];
		   atemp[0] = sdat1.toUpperCase();	' reference id
		   atemp[1] = sdat2;			' tip length
		   atemp[2] = sdat3.toUpperCase();	' Cut / Bend
		   atemp[3] = sdat4;			' angle
		   atemp[4] = sdat5.toUpperCase();	' CW / CCW
		   
		   iobjposi = otbar_tipe.length;
		   otbar_tipe[ iobjposi ] = atemp;
		   
 	   }else if( scomm.toUpperCase() == "SEGMENT" ){

		   atemp = [];
		   atemp[0] = sdat1.toUpperCase();	' reference id
		   atemp[1] = sdat2.toUpperCase();	' reference line
		   atemp[2] = sdat3;			' direction angle
		   
		   iobjposi = otbar_segment.length;
		   otbar_segment[ iobjposi ] = atemp;
		   
	   }
			
	}


   	' TBAR를 계산해서 geometry로 변환
	for( i = 0 ; i <= ocadobj.length ; i++){
		
		if( ocadobj[ i ].id.toUpperCase() == "TBAR" ){
			
			' TBAR Geometry 계산하여 object 목록에 추가

			
			
		}
	}
		
   }
	
	// check id exist
   this.check_id = function( sid ){

        /*
            id 중복시 true 반환
        */

		var bcheck;
		
		bcheck = false;
		
		for( var i = 0 ; i < ocadobj.length; i++){
			
			if( sid.toUpperCase() == ocadobj[ i ].id.toUpperCase() ){
				
				bcheck = true;
				
				return bcheck;
			}				
		
		}

		return bcheck;
		
   } 
  
	// check var exist
   this.check_var = function( sid ){

		var bcheck;
		
		bcheck = false;
		
		for(var i = 0 ; i < ocadvar.length; i++){
			
			if( sid.toUpperCase() == ocadvar[ i ][1].toUpperCase() ){
				
				bcheck = true;
				
				return bcheck;
			}				
		
		}

		return bcheck;
		
   }  

  // extract object information
	this.get_info = function( sid ){

		var ares;
		
		for(i = 0 ; i < ocadobj.length; i++){
			
			if( sid.toUpperCase() == ocadobj[ i ].id.toUpperCase() ){
				
				ares = ocadobj[ i ].info();
				//alert("her " + ocadobj[ i ].id + " " + ares.length)
				return ares;
				
			}
		
		}
    
		// if failed to find, return false
		return false; 
		
	}

  this.get_point_posi = function( iposi ){

		var ares;

        //alert("asaf her")

		ares = ocadobj[ iposi ].get_point();

        //alert("asaf her " + ares.length)

		return ares;
		
	}
  
	this.get_info_posi = function( iposi ){

		var ares;

		ares = ocadobj[ iposi ].info();

		return ares;
		
	}
  
    this.get_object_posi = function( iposi ){

		var ares;

		ares = ocadobj[ iposi ].info();

		return ares;
        
    }

	this.get_var_posi = function( iposi ){

		var ares;

		ares = ocadvar[ iposi ];

		return ares;
		
	}

	this.get_lay_posi = function( iposi ){

		var ares;

		ares = ocadlay[ iposi ];

		return ares;
		
	}
    
  // read variable value
	this.get_var = function( sid ){

		var ares;
		
		for(var i = 0 ; i < ocadvar.length; i++){
			
			if( sid.toUpperCase() == ocadvar[ i ][1].toUpperCase() ){
				
				ares = ocadvar[ i ];
				
				return ares;
				
			}
		
		}
    
        alert( "failed to find " + sid)
        
        return false;
		
	}
  
	this.replace_var = function( svalue ){
		
	  if( isNaN(svalue) ){

		for( var i = 0; i < ocadvar.length; i++ ){

		  if( svalue.toUpperCase() === ocadvar[i][1].toUpperCase() ){
			
			return ocadvar[i][2] * 1.0;

		  }

		}

		alert(svalue + " is not defined !!");

		return;
		
	  } else {
		
		return svalue * 1.0;
		
	  }    

	}
  
	this.get_object_count = function(){

		return ocadobj.length;

	}

	this.get_var_count = function(){

		return ocadvar.length;

	}

    this.get_lay_count = function(){

		return ocadlay.length;

	}
  
    this.get_layer_color = function( slayer ){

		for( var i = 0; i < ocadlay.length; i++ ){

            if( slayer.toUpperCase() === ocadlay[i][1].toUpperCase() ){
              
              return ocadlay[i][2]; // color
  
            }
  
        }        

        alert( "failed to find Layer " + slayer)
        
        return false;

    }
  
    this.get_layer_linetype = function( slayer ){

		for( var i = 0; i < ocadlay.length; i++ ){

            if( svalue.toUpperCase() === ocadlay[i][1].toUpperCase() ){
              
              return ocadlay[i][3]; // linetype
  
            }
  
        }        

        alert( "failed to find Layer " + slayer)
        
        return false;

    }

    this.get_point = function( iPointID ){
 
		for( var i = 0; i < ocadobj.length; i++ ){
            
            var atemp = ocadobj[i].info() ;
 
            if( atemp[0] == "POINT" && atemp[1].toUpperCase() == iPointID.toUpperCase() ){
 
                var ares = [];

                ares[0] = atemp[3];
                ares[1] = atemp[4];

                return ares;
            }
        }
        
        alert( "failed to find point " + iPointID);
        
        return false;
    }

    this.get_line = function( iLineID ){

		for( var i = 0; i < ocadobj.length; i++ ){
            
            var atemp = ocadobj[i].info() ;
 
            if( atemp[0] == "LINE" && atemp[1].toUpperCase() == iLineID.toUpperCase() ){
 
                var ares = [];

                ares[0] = atemp[3];
                ares[1] = atemp[4];
                ares[2] = atemp[5];
                ares[3] = atemp[6];

                return ares;
            }
        }
        
        alert( "failed to find line " + iLineID);
        
        return false;
        
    }

}

/*
function cadlayer(){
  
	var id			;
	var linetype		;
	var color		;
	
	//this.get_id		=	function(){ return this.id; }
	//this.get_linetype	=	function(){ return this.linetype; }
	//this.get_color	=	function(){ return this.color; }

	this.add	=	function( id, color, linetype){
		this.id			=	id;
		this.linetype	= linetype;
		this.color		=	color;
	}	
	
}
*/

function cadpoint(){

	var id;	
	var shape 	;	
	var layer	;	
    
    var x0;
    var y0;

	var x ;
	var y ;
	var z ;
    
	this.add			=	function(sid, layer, dx, dy){


		this.id		= sid.toUpperCase();
		this.shape	= "POINT" ;
		this.layer	= layer;


        this.x = [];
        this.y = [];
        this.z = [];
    
		this.x[0]	=  dx ;
		this.y[0]	=  dy ;
		//this.z	=  0;

        this.x0 = dx;//.toFixed(3) ;
        this.y0 = dy;//.toFixed(3) ;


//        this.x	=  dx * 1.0 ;
//        this.y	=  dy * 1.0;

    }
	
	this.info =	function(){
		
		var atemp = [];
		
		atemp[0] = this.shape;
		atemp[1] = this.id;
		atemp[2] = this.layer;

        //alert( xx1 + " " + yy1)
        atemp[3] = this.x0;//.toFixed(3);
        atemp[4] = this.y0;//.toFixed(3);

        return atemp;
        
	}

	this.get_point	=	function(){

		var node		= [];
        
		for( var i = 0 ; i < this.x.length ; i++){
            //i = 0;
			node[i]		= [];
			node[i][0]	= this.x[i];
			node[i][1]	= this.y[i];
			node[i][2]	= this.z[i];
		}

		return node;

    }

}

function cadline(){	// updated
	
	var id 			; 
	var shape	; 
	var layer	; 
	var x1;
	var y1;
	var z1;
	var x2;
	var y2;
	var z2;
	var length	;
	var angle	;

	var x;
	var y;
    var z;
	
	this.add			=	function(id, layer, x1, y1, x2, y2){
		
		this.id			=	id;
		this.shape	= "LINE";
		this.layer	=	layer;
		this.x1		= 	x1;
		this.y1		=	y1;
		this.z1		=  0;
		this.x2		=  x2;
		this.y2		=  y2;
		this.z2		=  0;

        this.x = [];
        this.y = [];
        this.z = [];

		this.x[0]		=  x1;
		this.y[0]		=  y1;
		this.z[0]		=  0;
		this.x[1]		=  x2;
		this.y[1]		=  y2;
		this.z[1]		=  0;
        
		//this.length		=	geo_length( this.x2 -  this.x1,  this.y2 -  this.y1, this.z2 -  this.z1 );
		//this.angle		=	geo_angle( x1, y1, z1, x2, y2, z2 );
		
	}

	this.info =	function(){
		
		var atemp = [];
		
		atemp[0] = this.shape;
		atemp[1] = this.id;
		atemp[2] = this.layer;
		atemp[3] = (this.x1);
		atemp[4] = (this.y1);
		atemp[5] = (this.x2);
		atemp[6] = (this.y2);
		
		return atemp;
		
	}

	this.get_point	=	function(){

		var node		= [];

		for( var i=0 ; i < this.x.length ; i++){

			node[i]		= [];
			node[i][0]	= this.x[i];
			node[i][1]	= this.y[i];
			node[i][2]	= this.z[i];
		}
		
		return node;
	}    

}

function cadarc( ){	// updated

	var id			;//= id;
	var shape		;//= SHAPE_ARC ;
	var layer		;//=	layer;
	var xc 		;//= parseFloat(xc);
	var yc 		;//= parseFloat(yc);
	var zc 		;//= parseFloat(zc);
	var bang 	;//= parseFloat(bAng); 		// degrees
	var eang 	;//= parseFloat(eAng); 		// degrees
	var radius 	;//= parseFloat(radius);

	var x;
	var y;
	var z;
	
	this.add		=	function(id, layer, xc, yc, radius, bang, eang){

		this.id		= id;
		this.shape	= "ARC" ;
		this.layer	= layer;
		this.xc 	= parseFloat(xc);
		this.yc 	= parseFloat(yc);
		this.zc 	= 0.0;
		this.radius = parseFloat(radius);
		this.bang 	= parseFloat(bang); 		// degrees
		this.eang 	= parseFloat(eang); 		// degrees

        this.x = [];
        this.y = [];
        this.z = [];

        // 	Points for bezier curve
		var delAng = Math.abs(this.eang - this.bang) ;  // 회전각 산정

		//alert( delAng);
		var iseg = parseInt (delAng / 90.0) + 1 ;	// Segment of Arc

		for( var i = 0 ;  i < iseg ; i++) {

			dang	= delAng / iseg;
			ang1 	= this.bang + dang / 2 + dang * ( i );	// 반대로 회전이동할 값

			var	temp	=	bezierarc( ang1, dang, this.radius, this.xc, this.yc, this.zc);	//	see geomath
			
			//	Data save
			if ( i == 0) {

				this.x[0]	=	temp[0][0];
				this.y[0]	=	temp[0][1];
				this.z[0]	=	temp[0][2];
			}
				
			for ( var j=0 ; j <= 2 ; j++){

				this.x[ j + 1 + 3 * i ] = temp[ j + 1 ][0];
				this.y[ j + 1 + 3 * i ] = temp[ j + 1 ][1];
				this.z[ j + 1 + 3 * i ]	= temp[ j + 1 ][2];
			}
            
		}        

	}

	this.info =	function(){
		
		var atemp = [];
		
		atemp[0] = this.shape;
		atemp[1] = this.id;
		atemp[2] = this.layer;
		atemp[3] = (this.xc).toFixed(3);
		atemp[4] = (this.yc).toFixed(3);
		atemp[5] = (this.radius).toFixed(3);
		atemp[6] = (this.bang).toFixed(3);
		atemp[7] = (this.eang).toFixed(3);
		
		return atemp;
		
	}

	this.get_point	=	function(){

		var node		= [];

		for( var i = 0 ; i < this.x.length ; i++){

			node[i]		= [];
			node[i][0]	= this.x[i];
			node[i][1]	= this.y[i];
			node[i][2]	= this.z[i];
		}		
		
		return node;
	}

}

function cadtbar (){		// updated
	
	var id		; 	' id;
	var shape	;
	var layer	;	' layer;
	var dia		; 	' rebar diameter
	var radii	;	' bending radius

	this.add = function(id, layer, dia, radius ){

		this.id		= id;
		this.shape	= "TBAR" ;
		this.layer	= layer;
		this.dia 	= dia * 1.0;
		this.radii 	= radius * 1.0;
	}	
}

function cadcircle (){		// updated

	var id				;//= 	id;
	var shape		;//= 	SHAPE_CIRCLE;
	var layer		;//=		layer;
	var xc 				;//=  	parseFloat(xc);
	var yc 				;//= 	parseFloat(yc);
	var zc 				;//= 	parseFloat(zc);
	var radius 		;

	var x;
	var y;
	var z;
    
	this.add				=	function(id, layer, xc, yc, radius){

		this.id				= 	id;
		this.shape		= 	"CIRCLE";
		this.layer		=		layer;
		this.xc 		=  	parseFloat(xc);
		this.yc 		= 	parseFloat(yc);
		//this.zc 		= 	parseFloat(zc);
		this.radius		=		parseFloat(radius);

		// Points for bezier curve
		var kappa 		=		4.0 * ( Math.sqrt(2.0) - 1.0 ) / 3.0 ;	// magic number
		
        var zc = 0;

        this.x = [];
        this.y = [];
        this.z = [];

		this.x[0]		=		xc + radius * 1;
		this.y[0]		=		yc + radius * 0;
		this.z[0]		=		zc;
		
		this.x[1]		=		xc + radius * 1;
		this.y[1]		=		yc + radius * kappa;
		this.z[1]		=		zc;
		
		this.x[2]		=		xc + radius * kappa;
		this.y[2]		=		yc + radius * 1;
		this.z[2]		=		zc;
		
		this.x[3]		=		xc + radius * 0;
		this.y[3]		=		yc + radius * 1;
		this.z[3]		=		zc;
		
		this.x[4]		=		xc + radius * -kappa;
		this.y[4]		=		yc + radius * 1;
		this.z[4]		=		zc;
 												
		this.x[5]		=		xc + radius * -1;
		this.y[5]		=		yc + radius * kappa;
		this.z[5]		=		zc;
		
		this.x[6]		=		xc + radius * -1;
		this.y[6]		=		yc + radius * 0;
		this.z[6]		=		zc;
		
		this.x[7]		=		xc + radius * -1;
		this.y[7]		=		yc + radius * -kappa;
		this.z[7]		=		zc;
 												
		this.x[8]		=		xc + radius * -kappa;
		this.y[8]		=		yc + radius * -1;
		this.z[8]		=		zc;
		
		this.x[9]		=		xc + radius * 0;
		this.y[9]		=		yc + radius * -1;
		this.z[9]		=		zc;
		
		this.x[10]		=		xc + radius * kappa;
		this.y[10]		=		yc + radius * -1;
		this.z[10]		=		zc;
		
		this.x[11]		=		xc + radius * 1;
		this.y[11]		=		yc + radius * -kappa;
		this.z[11]		=		zc;
		
		this.x[12]		=		xc + radius * 1;
		this.y[12]		=		yc + radius * 0;
		this.z[12]		=		zc;		        

	}

	this.info =	function(){
		
		var atemp = [];
		
		atemp[0] = this.shape;
		atemp[1] = this.id;
		atemp[2] = this.layer;
		atemp[3] = (this.xc);
		atemp[4] = (this.yc);
		atemp[5] = (this.radius);
		
		return atemp;
		
	}

	this.get_point	=	function(){

		var node		= [];

		for( i=0 ; i < this.x.length ; i++){
			node[i]		= [];
			node[i][0]	= this.x[i];
			node[i][1]	= this.y[i];
			node[i][2]	= this.z[i];
		}
		
		return node;
	}	
    
}
