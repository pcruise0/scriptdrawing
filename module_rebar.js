var module_rebar = new function(){

    this.add = function( apts, dRbend, dDia, dLs, dLe, atips, atipe ){

      var atempdata = [];
      var ares = [];
      var apt1 = [];
      var apt2 = [];
      
      dDia = dDia / 2 ; // 반지름으로 치환
      
      // 1) 중심선 생성
      var atempres = geo_pts_fillet( apts, dRbend, dLs, dLe);
      //alert( "aa " + atempres.length )      
      
      // 시점 마무리
      apt1[0] = atempres[0][1] * 1; // x1
      apt1[1] = atempres[0][2] * 1; // y1
      apt2[0] = atempres[0][4] * 1; // x2
      apt2[1] = atempres[0][5] * 1; // y2
      
      var adouble = double_tip( apt1, apt2, dDia, atips);

      ares[ ares.length ] = [];
      add_geo( ares[ ares.length - 1 ], adouble[0] );
      
      // 종점 마무리
      apt1[0] = atempres[ atempres.length - 1 ][1] * 1; // x1
      apt1[1] = atempres[ atempres.length - 1 ][2] * 1; // y1
      apt2[0] = atempres[ atempres.length - 1 ][4] * 1; // x2
      apt2[1] = atempres[ atempres.length - 1 ][5] * 1; // y2
      
      adouble = double_tip( apt2, apt1, dDia, atipe);
      
      ares[ ares.length ] = [];
      add_geo( ares[ ares.length - 1 ], adouble[0] );      
      
      // 2) 더블라인 처리
      for( var i = 0; i < atempres.length ; i++){
                
        atempdata[0] = atempres[i][0];  // line / arc
        
        if( atempdata[0] == "LINE"){
          
          atempdata[1] = atempres[i][1] * 1;  // x1
          atempdata[2] = atempres[i][2] * 1;  // y1
          atempdata[3] = atempres[i][4] * 1;  // x2
          atempdata[4] = atempres[i][5] * 1;  // y2
          
          // 중심선
          ares[ ares.length ] = [];
          add_geo( ares[ ares.length - 1 ] , atempdata );          
          
          apt1[0] = atempdata[1] * 1;
          apt1[1] = atempdata[2] * 1;
          apt2[0] = atempdata[3] * 1;
          apt2[1] = atempdata[4] * 1;
          
          var adouble = double_line( apt1, apt2, dDia  * 1);
          
          // 외곽선
          ares[ ares.length ] = [];
          
          atempdata[0] = "LINE"
          atempdata[1] = adouble[0][1] * 1;  // x1
          atempdata[2] = adouble[0][2] * 1;  // y1
          atempdata[3] = adouble[0][3] * 1;  // x2
          atempdata[4] = adouble[0][4] * 1;  // y2
          
          add_geo( ares[ ares.length - 1 ], atempdata );
          
          ares[ ares.length ] = [];
          
          atempdata[0] = "LINE"
          atempdata[1] = adouble[1][1] * 1;  // x1
          atempdata[2] = adouble[1][2] * 1;  // y1
          atempdata[3] = adouble[1][3] * 1;  // x2
          atempdata[4] = adouble[1][4] * 1;  // y2
          
          add_geo( ares[ ares.length - 1 ], atempdata );
          
        }else if( atempdata[0] == "ARC"){

          atempdata[1] = atempres[i][1] * 1;  // xc
          atempdata[2] = atempres[i][2] * 1;  // yc
          atempdata[3] = atempres[i][3] * 1;  // radii
          atempdata[4] = atempres[i][4] * 1;  // bang
          atempdata[5] = atempres[i][5] * 1;  // eng
          
          // 중심선
          ares[ ares.length ] = [];
          add_geo( ares[ ares.length - 1 ] , atempdata );          

          apt1[0] = atempdata[1] * 1; // xc
          apt1[1] = atempdata[2] * 1; // yc
          apt2[0] = atempdata[4] * 1; // bang
          apt2[1] = atempdata[5] * 1; // eang
          
          var adouble = double_arc( apt1, atempdata[3], apt2, dDia  * 1);
          
          // 외곽선
          ares[ ares.length ] = [];
          add_geo( ares[ ares.length - 1 ], adouble[0] );
          ares[ ares.length ] = [];
          add_geo( ares[ ares.length - 1 ], adouble[1] );
          
        }
        
        //alert( " seg " + i + " " + atempdata[0] + " " + ares.length)
        
      }
      
      // 3) 데이터 반환
      return ares;
      
    }

    // 배열에 객체저장
    function add_geo( aar_target, aar_data ){

        if( aar_data[0] == "LINE"){

            aar_target[0] = "LINE";
            aar_target[1] = "LAY_REBAR";
            aar_target[2] = aar_data[1];  // x1
            aar_target[3] = aar_data[2];  // y1
            aar_target[4] = aar_data[3];  // x2
            aar_target[5] = aar_data[4];  // y2
    
        }else if( aar_data[0] == "ARC"){
 
            aar_target[0] = "ARC";
            aar_target[1] = "LAY_REBAR";
            aar_target[2] = aar_data[1];  // xc
            aar_target[3] = aar_data[2];  // yc
            aar_target[4] = aar_data[3];  // radii
            aar_target[5] = aar_data[4];  // bang
            aar_target[6] = aar_data[5];  // eang

        }
    }

    // 끝점 처리 ... 직선 / arc
    //  pt1이 끝점...이 된다. pt2는 방향 벡터를 위한 점
    function double_tip( apt1, apt2, doffset, option){

        var ares = [];
         
        var dang = geo_angle( apt1, apt2);
        //alert( "tips " + dang ) 
        // 직선 반환 Cut
        if( option.toUpperCase() == "C" ){
            
            // 진행방향의 각도에 +90을 하고, 180도를 더한 좌표를 구해서 직선을 그린다.

            ares[0] = [];
            ares[0][0] = "LINE";
            ares[0][1] = apt1[0] + Math.abs( doffset ) * Math.cos( (dang + 90) * Math.PI / 180 );
            ares[0][2] = apt1[1] + Math.abs( doffset ) * Math.sin( (dang + 90) * Math.PI / 180 );
            ares[0][3] = apt1[0] + Math.abs( doffset ) * Math.cos( (dang + 270) * Math.PI / 180 );
            ares[0][4] = apt1[1] + Math.abs( doffset ) * Math.sin( (dang + 270) * Math.PI / 180 );

        // 반원 반환 Bend 
        } else if( option.toUpperCase() == "B" ){
            // arc 작도시..
            // 진행방향의 각도에 +90을 하고, 180도를 더하면 된다.
 
            ares[0] = [];
            ares[0][0] = "ARC";
            ares[0][1] = apt1[0];
            ares[0][2] = apt1[1];
            ares[0][3] = Math.abs(doffset);     // 반지름
            ares[0][4] = dang + 90;
            ares[0][5] = dang + 270;

        }

        return ares;

    }

    // 더블라인 geometry 생성
    function double_line( apt1, apt2, doffset ){

//alert("double : " + doffset + " " + apt1[0] + " " + apt1[1]  + "  line 2nd " + apt2[0] + " " + apt2[1]   )
      
        var ares1 = geo_offset( apt1, apt2, doffset );

        var ares2 = geo_offset( apt1, apt2, -1 * doffset );
//alert("double : " + doffset + " " + ares1[0] + " " + ares1[1]  + ares1[2] + " " + ares1[3] + "  line 2nd " + ares2[0] + " " + ares2[1]  + " " + ares2[2] + " " + ares2[3] )
        var ares = [];

        // 바깥선1
        ares[0] = [];
        ares[0][0] = "LINE";
        ares[0][1] = ares1[0];
        ares[0][2] = ares1[1];
        ares[0][3] = ares1[2];
        ares[0][4] = ares1[3];
//alert(" double " + ares[0][4] ) 
        // 바깥선2
        ares[1] = [];
        ares[1][0] = "LINE";
        ares[1][1] = ares2[0];
        ares[1][2] = ares2[1];
        ares[1][3] = ares2[2];
        ares[1][4] = ares2[3];

        return ares;

    }

    // 더블라인 ARC geometry 생성
    function double_arc( aori, dradii, aang, doffset ){

        var ageo = [];

        // 바깥선1
        ageo[0] = [];
        ageo[0][0] = "ARC";
        ageo[0][1] = aori[0];
        ageo[0][2] = aori[1];
        ageo[0][3] = dradii + doffset;
        ageo[0][4] = aang[0];
        ageo[0][5] = aang[1];

        // 바깥선2
        ageo[1] = [];
        ageo[1][0] = "ARC";
        ageo[1][1] = aori[0];
        ageo[1][2] = aori[1];
        ageo[1][3] = dradii - doffset;
        ageo[1][4] = aang[0];
        ageo[1][5] = aang[1];

        return ageo;

    }
  
}
