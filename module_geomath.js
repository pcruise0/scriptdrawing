/* FUNCTION SUMMARY

   geo_length
   geo_angle
   geo_offset
   geo_intersect
   geo_shortest_point
   geo_arc3p
   geo_fillet
   geo_pts_fillet
   ge0_rotation

*/


function geo_length( apt1, apt2 ){
    
    var x1, y1, z1,  x2, y2, z2,  dx, dy, dz;

    x1 = apt1[0];
    y1 = apt1[1];

    if( apt1.length == 3 ){
        z1 = apt1[2];
    }else{
        z1 = 0;
    }

    x2 = apt2[0];
    y2 = apt2[1];

    if( apt1.length == 3 ){
        z2 = apt2[2];
    }else{
        z2 = 0;
    }

    dx = x2 - x1;
    dy = y2 - y1;
    dz = z2 - z1;

    return	Math.sqrt( dx * dx + dy * dy + dz * dz);
    
}
    
function geo_angle( apt1, apt2 ){

    var x1, y1, x2, y2;

    x1 = apt1[0];
    y1 = apt1[1];
    x2 = apt2[0];
    y2 = apt2[1];

    var  dL	=	geo_length( apt1, apt2 ) ;

    if ( dL == 0 ){
        
        alert( " length is zero!" );
        return 0;
    }

    if ( ( x2 - x1 ) >= 0 ){
        
            return	Math.asin( ( y2 - y1 ) / dL ) * 180 / Math.PI;
            
    } else {
        
        if ( y2 - y1 >= 0 ) {
            
            return 	( Math.PI - Math.asin( ( y2 - y1 ) / dL ) ) * 180 / Math.PI;
            
        } else {
            
            //alert( 'her ');
            return 	( Math.PI - Math.asin( ( y2 - y1 ) / dL ) ) * 180 / Math.PI;
            
        }
  }

}

    /*
    */
function geo_offset( apt1, apt2, doffset ){
    
    //  angle from P1 to P2
    //    right side : + offset
    //		left side : - offset
  
    //  수직선 수평선 판단.
    //  Line은 왼쪽에서 오른쪽으로 
  
    var x1, y1, x2, y2;
  
    var dang;
    var x3, y3;
  
    x1 = apt1[0];
    y1 = apt1[1];
    x2 = apt2[0];
    y2 = apt2[1];
  
      if( Math.abs( x2 - x1 ) <= 0.0000000001 ) {  
  
          // 수직선
          dang = 90;
      
      } else if ( Math.abs( y2 - y1 ) <= 0.0000000001 ) {  
          // 수평선
          dang = 0;
      
      } else {
  
          // 왼쪽에서 오른쪽으로 데이터를 변환해주어야함
          if( x2 <= x1 ) {
                  
          x3 = x1;
          y3 = y1;
          
          x1 = x2;
          y1 = y2;
          
          x2 = x3;
          y2 = y3;
          
          }
  
          var appt1 = [];
          var appt2 = [];
  
          appt1[0] = x1;
          appt1[1] = y1;
          appt2[0] = x2;
          appt2[1] = y2;
          
          dang	=	geo_angle( appt1, appt2 );
    
      }
    // offset 부호에 따른 방향 설정
    if( doffset >= 0 ) {
  
      dang = dang + 90;
  
    } else {
  
      dang = dang - 90;
  
    }
      
    doffset	=	Math.abs( doffset );
  
      //	return lines
    var atemp = [];
  
    atemp[0] = x1 + doffset * Math.cos( dang * Math.PI / 180 );  // x1
    atemp[1] = y1 + doffset * Math.sin( dang * Math.PI / 180 );  // y1
    atemp[2] = x2 + doffset * Math.cos( dang * Math.PI / 180 );  // x2
    atemp[3] = y2 + doffset * Math.sin( dang * Math.PI / 180 );  // y2
    
    //atemp[4] = doffset * Math.cos( dang * Math.PI / 180 );  // dx
    //atemp[5] = doffset * Math.sin( dang * Math.PI / 180);  // dy
  
    return atemp;

}
        
// Intersection
function geo_intersect( apt11, apt12, apt21, apt22 ){
  
    var x11, y11, x12, y12, x21, y21, x22, y22;

    x11 = apt11[0] * 1.0;
    y11 = apt11[1] * 1.0;
    x12 = apt12[0] * 1.0;
    y12 = apt12[1] * 1.0;

    x21 = apt21[0] * 1.0;
    y21 = apt21[1] * 1.0;
    x22 = apt22[0] * 1.0;
    y22 = apt22[1] * 1.0;

    // parallel
    //   slope = dy1 / dx1 = dy2 / dx2 -> dy1*dx2 - dy2 * dx1 = 0
    var dx1 = parseFloat(x12) - parseFloat(x11); //$x12 - $x11;
    var dx2 = parseFloat(x22) - parseFloat(x21); //$x22 - $x21;
    var dy1 = parseFloat(y12) - parseFloat(y11); //$y12 - $y11;
    var dy2 = parseFloat(y22) - parseFloat(y21); //$y22 - $y21;
    
    // 평행하면 해가 없음.
    if( Math.abs( dy1 * dx2 - dy2 * dx1 ) <= ( 1/10 )**10  ){

        alert("Parallel Lines, can't find intersect point!");

        return false;

    }

    //  x11 + t (x12 - x11) = x21 + s (x22 - x21)
    //  y11 + t (y12 - y11) = y21 + s (y22 - y21)
    //  var ds = (dx1 * (y21 - y11) + dy1 * (x11 - x21)) / ( dx2 * dy1 - dy2 * dx1);
    var dt = (dx2 * (y11 - y21) + dy2 * (x21 - x11)) / ( dy2 * dx1 - dx2 * dy1) * 1.0;

    // If it exists, the point of intersection is:
    // (x1 + t * dx, y1 + t * dy)

    var atemp = [];

    atemp[0] = ( x11 + dt * dx1 ) ;
    atemp[1] = ( y11 + dt * dy1 ) ;
    
    //echo $t." ".$x." ".$y."inter </br>";
    //alert( atemp[0] + "  " + atemp[1])
    
    return atemp;
}	
    
function geo_shortest_point( apt1, apt2, apt){
//	find a point which intersect with pt1~pt2 with 90 degress
//	Pint = p1 + t (p2 - p1)
//	P1Pint * PiPint = 0	
//	-t(P2-P1) * (Pi - P1-t(P2-P1))=0
//	'(x2-x1, y2-y1)*(xi - x1 - t(x2-x1), yi-y1-t(y2-y1))=0
//	'(x2-x1)*{xi-x1-t(x2-x1)} + (y2-y1)*{yi-y1-t(y2-y1)}=0
//	't = {(x2-x1)*(xi-x1)+(y2-y1)*(yi-y1)}/{(x2-x1)^2+(y2-y1)^2}
    var x1, y1, x2, y2, px, py;
    var dt;

    x1 = apt1[0];
    y1 = apt1[1];

    x2 = apt2[0];
    y2 = apt2[1];

    px = apt[0];
    py = apt[1];

    dt	=	( (x2 - x1) * ( px - x1) + (y2 - y1y)*(py - y1) ) / ( ( x2 - x1)**2 + ( y2 - y1)**2 );
    
    var atemp = [];

    atemp[0]	= pt1x + dt * ( pt2x - pt1x );
    atemp[1]	= pt1y + dt * ( pt2y - pt1y ); 
    atemp[2]	= dt;
    
    return atemp;
}

/*
    calculate arc by 3P	
*/
function geo_arc3p( apt1, apt2, apt3){
/*
    reference : https://minstudyroom.tistory.com/4

    input : apt1[2], apt2[2], apt3[2], dradii

    return
        res[0] : xc
        res[1] : yc
        res[2] : radii
        res[3] : begin angle
        res[4] : end angle
*/

    var d;
    var x1, x2, x3, y1, y2, y3, xc, yc, radii;

    x1 = apt1[0];
    y1 = apt1[1];
    x2 = apt2[0];
    y2 = apt2[1];
    x3 = apt3[0];
    y3 = apt3[1];

    d = 2 * ( x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));

    xc = ( (x1**2 + y1**2) * (y2 - y3) + (x2**2 + y2**2) * (y3 - y1) + (x3**2 + y3**2) * (y1 - y2) ) / d;

    yc = ( (x1**2 + y1**2) * (x3 - x2) + (x2**2 + y2**2) * (x1 - x3) + (x3**2 + y3**2) * (x2 - x1) ) / d;

    radii = ((x1 - xc)**2 + (y1 - yc)*21)**(1/2);

    //	return
    var ares = [];

    ares[0] = xc;	// 
    ares[1] = yc;
    ares[2] = 0;
    ares[3] = radii;
    
    return	ares;
}


/*
    chamfer by 3P	: a x b
*/
function geo_chamfer( apt1, apt2, apt3, dL12, dL23 ){
/*
      input : apt1[2], apt2[2], apt3[2], chamfer a, chamfer b

      return
          res[0] : x1
          res[1] : y1
          res[2] : z1
          res[3] : x2
          res[4] : y2
          res[5] : z2
*/
 
    //var iccw 	= 	geo_rotation( apt1, apt2, apt3 );
 
    //var dtheta	=	vector_inner_angle(apt1, apt2, apt3) / 2.0 ;

    var dl_vec1	=	geo_length( apt1, apt2 );
    var dl_vec2	=	geo_length( apt3, apt2 );
    
    // 접선까지 거리 : chamfer에서는 주어지므로 필요없음..
    //var dTL	=	dradii / Math.tan( dtheta * Math.PI / 180.0 );
  
    var avec1 = [];
    var avec2 = [];

    avec1[0]	=	apt1[0] - apt2[0];
    avec1[1]	=	apt1[1] - apt2[1];
    avec1[2]	=	apt1[2] - apt2[2];
    
    avec2[0]	=	apt3[0] - apt2[0];
    avec2[1]	=	apt3[1] - apt2[1];
    avec2[2]	=	apt3[2] - apt2[2];
  
    var apt_r1 = [];
    var apt_r2 = [];
    var apt_rm = [];

    apt_r1[0]	=	apt2[0] + dL12 / dl_vec1 * avec1[0] ;
    apt_r1[1]	=	apt2[1] + dL12 / dl_vec1 * avec1[1] ;
    apt_r1[2]	=	apt2[2] + dL12 / dl_vec1 * avec1[2] ;

    apt_r2[0]	=	apt2[0] + dL23 / dl_vec2 * avec2[0] ;
    apt_r2[1]	=	apt2[1] + dL23 / dl_vec2 * avec2[1] ;
    apt_r2[2]	=	apt2[2] + dL23 / dl_vec2 * avec2[2] ;
    
    var ares = [];      

    ares[0] = apt_r1[0];         //  x1                
    ares[1] = apt_r1[1];         //  y1
    ares[2] = apt_r1[2];         //  z1
    ares[3] = apt_r2[0];         //  x2
    ares[4] = apt_r2[1];         //  y2
    ares[5] = apt_r2[2];         //  z2
	
    return ares;	
}

/*
    fillet by 3P	
*/
function geo_fillet( apt1, apt2, apt3, dradii ){
/*
      input : apt1[2], apt2[2], apt3[2], dradii

      return
          res[0] : xc
          res[1] : yc
          res[2] : radii
          res[3] : begin angle
          res[4] : end angle
*/
 
    var iccw 	= 	geo_rotation( apt1, apt2, apt3 );
 
    var dtheta	=	vector_inner_angle(apt1, apt2, apt3) / 2.0 ;

    var dl_vec1	=	geo_length( apt1, apt2 );
    var dl_vec2	=	geo_length( apt3, apt2 );
    
    // 접선까지 거리
    var dTL	=	dradii / Math.tan( dtheta * Math.PI / 180.0 );
  
    var avec1 = [];
    var avec2 = [];

    avec1[0]	=	apt1[0] - apt2[0];
    avec1[1]	=	apt1[1] - apt2[1];
    avec1[2]	=	apt1[2] - apt2[2];
    
    avec2[0]	=	apt3[0] - apt2[0];
    avec2[1]	=	apt3[1] - apt2[1];
    avec2[2]	=	apt3[2] - apt2[2];
  
    var apt_r1 = [];
    var apt_r2 = [];
    var apt_rm = [];

    apt_r1[0]	=	apt2[0] + dTL / dl_vec1 * avec1[0] ;
    apt_r1[1]	=	apt2[1] + dTL / dl_vec1 * avec1[1] ;
    apt_r1[2]	=	apt2[2] + dTL / dl_vec1 * avec1[2] ;

    apt_r2[0]	=	apt2[0] + dTL / dl_vec2 * avec2[0] ;
    apt_r2[1]	=	apt2[1] + dTL / dl_vec2 * avec2[1] ;
    apt_r2[2]	=	apt2[2] + dTL / dl_vec2 * avec2[2] ;
    
    //	mid point on chord
    apt_rm[0]	=	( apt_r1[0] + apt_r2[0] ) / 2;
    apt_rm[1]	=	( apt_r1[1] + apt_r2[1] ) / 2;
    apt_rm[2]	=	( apt_r1[2] + apt_r2[2] ) / 2;

    // Pt2부터 fillet 원 중심까지 거리
    //    sqrt( TL ^ 2 + Radii ^ 2)
    var dpt2tocen = Math.sqrt( dTL * dTL + dradii * dradii );
    var ddiag = Math.sqrt( ( apt_rm[0] - apt2[0] ) * ( apt_rm[0] - apt2[0] ) + ( apt_rm[1] - apt2[1] ) * ( apt_rm[1] - apt2[1] ) + ( apt_rm[2] - apt2[2] ) * ( apt_rm[2] - apt2[2] ) );
    
    var dxc = apt2[0] + ( apt_rm[0] - apt2[0] ) * dpt2tocen / ddiag;
    var dyc = apt2[1] + ( apt_rm[1] - apt2[1] ) * dpt2tocen / ddiag;
    var dzc = apt2[2] + ( apt_rm[2] - apt2[2] ) * dpt2tocen / ddiag;      

    var oarc = [];
  
    oarc[0] = dxc;
    oarc[1] = dyc;
    oarc[2] = dzc;

    var ares = [];      // xc, yc , radii, bang , eang

    ares[0] = dxc;          //  xc                
    ares[1] = dyc;          //  yc
    ares[2] = dradii;          //  radii
    
	if( iccw == -1 ){
		
		ares[3] = geo_angle( oarc, apt_r1);     // bang
		ares[4] = geo_angle( oarc, apt_r2);     // eang
		
	}else if( iccw == 1 ){

		ares[3] = geo_angle( oarc, apt_r2);     // eang
		ares[4] = geo_angle( oarc, apt_r1);     // bang
		
	}

    ares[5] = iccw;          //  cw / ccw
	
    return ares;	
}

/*
    multiple points fillets	
*/
function geo_pts_fillet( apts, dradii, dlb, dle ){
/*
      input : apts[][2], dradii, dlb : Start Length, dle : End Length (0으로 입력시 그냥 좌표값을 사용)

		데이터 포인트가 2개면 직선
  		데이터 포인트가 3개 이상이면 철근 절곡

      return
          ares[][0] : "ARC"
          ares[][1] : xc
          ares[][1] : yc
          ares[][2] : radii
          ares[][3] : begin angle
          ares[][4] : end angle

          ares[][0] : "LINE"
          ares[][1] : x1
          ares[][1] : y1
          ares[][2] : 0    ' default z 
          ares[][3] : x2
          ares[][4] : y2
          ares[][5] : 0    ' default z
*/
      
        // 3 점과 R 값을 주면 더블라인으로 철근을 반환해줌
        //      dRbend : 굽한 반경
        //      Ls : Start Length, Le : End Length , 0으로 입력시 그냥 좌표값을 사용

        var ares = [];
        //  return value
        //      직선 : 시점 종점 xyz
        //      아크 : 원점 xy, 곡선반경, 시작각, 끝각
  
        var apt1 = [];
        var apt2 = [];
        var apt3 = [];

        var afillet;
        var dox, doy, dbang, deang, dradii, iccw; 
        var dtempl;
  
        var shtml;
	
	// 배열의 크기에 따라, 2개면 직선으로 끝내기
	if( apts.length == 2){

		var iposi = 0;
		
		ares[ iposi ] = [];
		
		ares[ iposi ][0] = "LINE";
		
		ares[ iposi ][1] = apts[0][0];
		ares[ iposi ][2] = apts[0][1];
		ares[ iposi ][3] = apts[0][2];
		
		ares[ iposi ][4] = apts[1][0];
		ares[ iposi ][5] = apts[1][1];
		ares[ iposi ][6] = apts[1][2];
				
	} else {
		
		for( var i = 0; i < apts.length - 2; i++){ // 3점씩 구간별로
	    
      //-----------------------------------------------
      // 3점을 이용한 아크 계산
			if( i == 0 ){
			
				apt1[0] = apts[i][0];   
				apt1[1] = apts[i][1];   
				apt1[2] = apts[i][2];  
				
			} else {
				// 직전 아크 세그먼트의 종점 좌표..
				dox     = ares[ ares.length - 1 ][1];
				doy     = ares[ ares.length - 1 ][2];
				dradii  = ares[ ares.length - 1 ][3];
				dbang   = ares[ ares.length - 1 ][4];
				deang   = ares[ ares.length - 1 ][5];
				iccw    = ares[ ares.length - 1 ][6];
        
        // CW / CCW 구분해야함
        if( iccw == 1){      // 시계방향

          apt1[0] = dox + dradii * Math.cos( dbang * Math.PI / 180 );   
          apt1[1] = doy + dradii * Math.sin( dbang * Math.PI / 180 );   
          apt1[2] = 0;  

        }else if( iccw == -1){ // 반시계방향
          
          apt1[0] = dox + dradii * Math.cos( deang * Math.PI / 180 );   
          apt1[1] = doy + dradii * Math.sin( deang * Math.PI / 180 );   
          apt1[2] = 0;  
	
        }
        
			}
			
			apt2[0] = apts[i + 1][0];   
			apt2[1] = apts[i + 1][1];   
			apt2[2] = apts[i + 1][2];   
			
			apt3[0] = apts[i + 2][0];   
			apt3[1] = apts[i + 2][1];   
			apt3[2] = apts[i + 2][2];   
			
			// calculate circle of 3pts
      //    3점이 시계방향이면, 
      //    dxf 의 문법상..
      //    시점각 종점각 위치는 반시계방향으로 나온다..
			var afillet = geo_fillet( apt1, apt2, apt3, dradii );
			
			dox     = afillet[0];
			doy     = afillet[1];
			dradii  = afillet[2];
			dbang   = afillet[3];
			deang   = afillet[4];
      iccw    = afillet[5];
      //-----------------------------------------------
      
			//alert( dox + " " + doy + " " + dradii + " " + dbang + " " + deang)
			// 데이터 교체
      //-----------------------------------------------
			// 시점부 직선 구간
			var iposi = ares.length;
			
			ares[ iposi ] = [];
			
			ares[ iposi ][0] = "LINE";
			
			ares[ iposi ][1] = apt1[0];
			ares[ iposi ][2] = apt1[1];
			ares[ iposi ][3] = apt1[2];
			
      // 시계방향 반시계방향에 따라서 각 위치를 고려해줘야함
      if( iccw == 1){      // 시계방향

        ares[ iposi ][4] = dox + dradii * Math.cos( deang * Math.PI / 180 );
		  	ares[ iposi ][5] = doy + dradii * Math.sin( deang * Math.PI / 180 );
	  		ares[ iposi ][6] = 0;

      }else if( iccw == -1){ // 반시계방향
        
  			ares[ iposi ][4] = dox + dradii * Math.cos( dbang * Math.PI / 180 );
		  	ares[ iposi ][5] = doy + dradii * Math.sin( dbang * Math.PI / 180 );
	  		ares[ iposi ][6] = 0;
        
      }        
      //-----------------------------------------------
			
      //-----------------------------------------------
			// 현재 계산된 중앙부 arc
			iposi = ares.length;
			
			ares[ iposi ] = [];
			
			ares[ iposi ][0] = "ARC";
			
			ares[ iposi ][1] = dox;     // Ox
			ares[ iposi ][2] = doy;     // Oy
			ares[ iposi ][3] = dradii;  // Radii
			ares[ iposi ][4] = dbang;   // bang
			ares[ iposi ][5] = deang;   // eang
			ares[ iposi ][6] = iccw;    // CCW / CW
			
      //-----------------------------------------------
			//alert( i + "  seg " + ares.length )          
			    
      //-----------------------------------------------
			//  종점부 직선 구간 데이터
			if( i == apts.length - 3 ){
			
				iposi = ares.length;
				
				ares[ iposi ] = [];
				
				ares[ iposi ][0] = "LINE";

        if( iccw == 1){      // 시계방향
          
          ares[ iposi ][1] = dox + dradii * Math.cos( dbang * Math.PI / 180 );
          ares[ iposi ][2] = doy + dradii * Math.sin( dbang * Math.PI / 180 );;
          ares[ iposi ][3] = 0;
          
        }else if( iccw == -1){ // 반시계방향
          
          ares[ iposi ][1] = dox + dradii * Math.cos( deang * Math.PI / 180 );
          ares[ iposi ][2] = doy + dradii * Math.sin( deang * Math.PI / 180 );;
          ares[ iposi ][3] = 0;
          
        }      
				
				ares[ iposi ][4] = apts[ apts.length - 1 ][0];
				ares[ iposi ][5] = apts[ apts.length - 1 ][1];
				ares[ iposi ][6] = apts[ apts.length - 1 ][2];
      //-----------------------------------------------
			
			}
	    
		}
		
	}
        // 시점부, 종점부 길이를 보정한다.
        if( dlb != 0 ){
          
		apt1[0] = ares[0][1];   
		apt1[1] = ares[0][2];   
		apt1[2] = ares[0][3];  
		
		apt2[0] = ares[0][4];   
		apt2[1] = ares[0][5];   
		apt2[2] = ares[0][6];  
		
		var dtempl = geo_length( apt1, apt2 );
		
		// 시점좌표 보정
		ares[0][1] = apt2[0] + (apt1[0] - apt2[0]) * dlb / dtempl;
		ares[0][2] = apt2[1] + (apt1[1] - apt2[1]) * dlb / dtempl;
		ares[0][3] = apt2[2] + (apt1[2] - apt2[2]) * dlb / dtempl;

        }
  
        if( dle != 0 ){
          
		var iposi = ares.length - 1;
		
		apt1[0] = ares[iposi][1];   
		apt1[1] = ares[iposi][2];   
		apt1[2] = ares[iposi][3];  
		
		apt2[0] = ares[iposi][4];   
		apt2[1] = ares[iposi][5];   
		apt2[2] = ares[iposi][6];  
		
		var dtempl = geo_length( apt1, apt2 );
		
		// 종점좌표 보정
		ares[iposi][4] = apt1[0] + (apt2[0] - apt1[0]) * dlb / dtempl;
		ares[iposi][5] = apt1[1] + (apt2[1] - apt1[1]) * dlb / dtempl;
		ares[iposi][6] = apt1[2] + (apt2[2] - apt1[2]) * dlb / dtempl;
          
        }
  
    return ares;
   
}

function geo_rotation( apt1, apt2, apt3) {
  
  // 벡터 외적을 계산하여 방향을 판단
  var x1 = apt1[0];
  var x2 = apt2[0];
  var x3 = apt3[0];

  var y1 = apt1[1];
  var y2 = apt2[1];
  var y3 = apt3[1];
  
  var crossProduct = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);

  if (crossProduct > 0) {
	  
	return -1; //"반시계방향 (Counter-Clockwise)";
	
  } else if (crossProduct < 0) {
	  
	return  1; //"시계방향 (Clockwise)";
	
  } else {
	  
	return  0; //"일직선상 (Collinear)";
	
  }
  
}	

    function vector_norm( avec){
        //$vzero[0]	=	0;
        //$vzero[1]	=	0;
        //$vzero[2]	=	0;
        
        //$dleng	=	geo_length($vec, $vzero);
        var dleng	=	Math.sqrt( vector_inner( avec, avec) );
    
        var ares = [];
    
        ares[0]	=	avec[0]	/	dleng;
        ares[1]	=	avec[1]	/	dleng;
        ares[2]	=	avec[2]	/	dleng;
        
        return	ares;
        
    }
    
    function vector_plus( avec1, avec2){
    
        var ares = [];
    
        ares[0]	=	avec1[0] + avec2[0];
        ares[1]	=	avec1[1] + avec2[1];
        ares[2]	=	avec1[2] + avec2[2];
        
        return ares;
    }
    
    function vector_minus( avec1, avec2){
    
        var ares = [];
        ares[0]	=	avec1[0] - avec2[0];
        ares[1]	=	avec1[1] - avec2[1];
        ares[2]	=	avec1[2] - avec2[2];
        
        return ares;
    }
    
    function vector_inner( avec1, avec2){
        
        var ares = [];
    
        ares	=	avec1[0] * avec2[0] + avec1[1] * avec2[1] + avec1[2] * avec2[2] ;
        
        return ares;
    }
    
    function vector_inner_angle( apt1, apt2, apt3 ) {
	
        var dL1	=	geo_length( apt1, apt2);
        var dL2	=	geo_length( apt2, apt3);

        var a = [];
        var b = [];

        a[0] = apt1[0] - apt2[0];
        a[1] = apt1[1] - apt2[1];
        a[2] = apt1[2] - apt2[2];

        b[0] = apt3[0] - apt2[0];
        b[1] = apt3[1] - apt2[1];
        b[2] = apt3[2] - apt2[2];

        var d = Math.acos( (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]  ) / dL1 / dL2 ) * 180 / Math.PI ;
        
        return d;
        
    }
    
    function vertex_inner(a, b)
    {  
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] ;
    }
    
    function vertex_cross(a, b)
    {  
        var d = [];
            
        d[0] = a[1] * b[2] - a[2] * b[1] ;   
        d[1] = a[2] * b[0] - a[0] * b[2] ;   
        d[2] = a[0] * b[1] - a[1] * b[0];   
        
        return d;
    }
    
    function vector_rotate_x(a, degree) {
    
        var d = [];
        var radian = degree * Math.PI / 180;
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        d[0] =	a[0];
        d[1] = 	c * a[1] - s * a[2];
        d[2] = 	s * a[1] + c * a[2];
    
        return d;      
    }
    
    function vector_rotate_y(a, degree) {
        var d = [];
        var radian = degree * Math.PI / 180;
        var s = Math.sin(radian);
        var c = Math.cos(radian);
    
        d[0] =  c * a[0] - s * a[2];
        d[1] =  a[1]
        d[2] =  s * a[0] + c * a[2];
    
        return d;      
    }
    
    function vector_rotate_z(a, degree) {
        var d = [];
        var radian = degree * Math.PI / 180;
        var s = Math.sin(radian);
        var c = Math.cos(radian);
    
        d[0] =  c * a[0] - s * a[1];
        d[1] =  s * a[0] + c * a[1];
        d[2] =  a[2];
    
        return d;      
    }
    
    function vertex_translation(a, dx, dy, dz)
    {  
        var d = [];
            
        d[0] = a[0] + dx;   
        d[1] = a[1] + dy;   
        d[2] = a[2] + dz;   
        
        return d;
    }
    
    function vertex_scale(a, ds)
    {  
        var d = [];
            
        d[0] = a[0] * ds;   
        d[1] = a[1] * ds;   
        d[2] = a[2] * ds;   
        
        return d;
    }    

    function bezierarc(ang1, dang, radius, xc, yc, zc) {
        // ang1	: Arc의 중심위치 각도
            var node		=	[];

            node[3]		= [];
            node[3][0]	= radius * Math.cos( dang / 2 * Math.PI / 180 );
            node[3][1]	= radius * Math.sin( dang / 2 * Math.PI / 180 );
            node[3][2]	=	0;
    
            var	kappa	= 4 / 3 * ( radius - node[3][0] ) / radius / Math.sin( dang / 2 * Math.PI / 180 ) ;
    
            node[0]		= [];
            node[0][0]	= node[3][0] ;
            node[0][1]	= node[3][1] * -1;
            node[0][2]	=	0;
    
            node[2]		= [];
            node[2][0]	= node[3][0] + kappa * radius * Math.sin( dang / 2 * Math.PI / 180 ) ;
            node[2][1]	= node[3][1] - kappa * radius * Math.cos( dang / 2 * Math.PI / 180 ) ;
            node[2][2]	=	0;
    
            node[1]		= [];
            node[1][0]	= node[0][0] + kappa * radius * Math.sin( dang / 2 * Math.PI / 180 ) ;
            node[1][1]	= node[0][1] + kappa * radius * Math.cos( dang / 2 * Math.PI / 180 ) ;
            node[1][2]	=	0;

            for(var i = 0; i <= 3; i++){

                node[i]	= 	vector_rotate_z(node[i], ang1) ;
                node[i] = 	vertex_translation(node[i], xc, yc, zc);

            }	
            
            return node;
        
    }
    
    function vector_quaternion( va , vp, degree){
        /*
            va : rotation axis vector
            vp : target vector 
            r : rotation angle
            q = [ cos( r / 2 ) , sin( r / 2 )* |v| ] : normalized vector of rotation axis
        */
        
        ra	=	Math.cos( degree / 2 * Math.PI / 180 );
        rb	=	Math.sin( degree / 2 * Math.PI / 180 );
        
        var va_norm	=	vertex_normal( va );
        a	=	ra ;
        b	=	rb * va_norm[0];
        c	=	rb * va_norm[1];
        d	=	rb * va_norm[2];
        //alert("qater" + va_norm[1] + " , "  + va_norm[2] + " , "  + va_norm[3] + " , ");
        //alert("qater" + b + " , "  + c + " , "  + d + " , ");
        
        var	rk	=	[];
        rk[0]	=	[];
        rk[0][0]	=	Math.pow( a, 2) + Math.pow( b, 2) - Math.pow( c, 2) - Math.pow( d, 2);
        rk[0][1]	=	2	*	b * c - 2 * a * d;
        rk[0][2]	=	2	*	b * d + 2 * a * c;
        rk[1]	=	[];
        rk[1][0]	=	2	*	b * c + 2 * a * d;
        rk[1][1]	=	Math.pow( a, 2) - Math.pow( b, 2) + Math.pow( c, 2) - Math.pow( d, 2);
        rk[1][2]	=	2	*	c * d - 2 * a * b;
        rk[2]	=	[];
        rk[2][0]	=	2	*	b * d - 2 * a * c;
        rk[2][1]	=	2	*	c * d + 2 * a * b;
        rk[2][2]	=	Math.pow( a, 2) - Math.pow( b, 2) - Math.pow( c, 2) + Math.pow( d, 2);
        
        var	res	=	[];
        res[0]	=	rk[0][0] * vp[0] + rk[0][1] * vp[1] + rk[0][2] * vp[2] ;
        res[1]	=	rk[1][0] * vp[0] + rk[1][1] * vp[1] + rk[1][2] * vp[2] ;
        res[2]	=	rk[2][0] * vp[0] + rk[2][1] * vp[1] + rk[2][2] * vp[2] ;
        
        return res;
    }    
	
	
