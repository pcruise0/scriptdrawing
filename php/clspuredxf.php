<?

class clspuredxf {

/*
	pure dxf 
*/	
	var $layer = array();
		
	function prtdxf( $sdir, $sfile, $data ){

 //echo "<script>alert( \" " . " start dxf  " . " \");</script>";        

	// Loading Data
		$data = split("<br>", $data);
		
		for( $i=0 ; $i < count($data) ; $i = $i + 1 ){
			
			$object[$i]	=	 explode(",", $data[$i]);

			if	( strtoupper( $object[$i][0] )  == "LAYER"){

                $iposi = count($this->layer);

				$this->layer[ $iposi  ][0] = $object[$i][1];    // name
				
				$this->layer[ $iposi  ][1] = $object[$i][2];       // color		

				//$this->layer[ count($this->layer)  ][2] = $object[$i][3];       // line type  : update 됨		

                //echo "<script>alert( '" . $iposi . " " . $object[$i][1] . " " . $object[$i][2] . "')</script>";        
                
			}
		}
		//
	
		// Print DXF
		$sfile = $sdir.$sfile;
		$fdxf = fopen($sfile,"w");

/*
		Print Header
*/		
		$this->dxf_bof($fdxf);		//
/*
		Print Entity
		
		0		/	1	/ 2		/ 3		/ 4		/	5  /  6  / 7 	/	8		/  9		/ 10
        
		Layer 	/ ID 	/ color / Linetype
		LINE 	/ ID 	/ GROUP / LAYER / PEN 	/  X1 / Y1 	/ Z1 /  X2 / Y2 / Z2 
		POINT 	/ ID 	/ GROUP / LAYER / PEN 	/  X1 / Y1 	/ Z1 		
		CIRCLE	/ ID 	/ GROUP / LAYER / PEN 	/  X1 / Y1 	/ Z1 / RADIUS
		ARC 	/ ID 	/ GROUP / LAYER / PEN 	/  X1 / Y1 	/ Z1 / RADIUS / BANG / EANG / Normal x / normal y / normal z / ocx /ocy /ocz / ocbang /oc eang

        TEXT 	/ ID 	/ GROUP / LAYER / PEN 	/  X1 / Y1 	/ text	/ textsize	/ textrot	/ textposition
		SPLINE 	/ ID 	/ GROUP / LAYER / PEN 	/  Xi / Yi ~
		PLINE 	/ ID 	/ GROUP / LAYER / PEN 	/  Xi / Yi ~

*/		
		
		for($i=0;	$i<=	count($object);	$i=$i+1){
			
			$ent_type	=	 strtoupper(	$object[$i][0]	);

			$slayer	=	$object[$i][3];

//   echo "<script>alert( \" " . $slayer . "  " . strlen( $slayer ) . " \");</script>";
			
			if( $slayer == '' ){
				$slayer = "0";
			}

//   echo "<script>alert( \" " . $slayer . "  " . strlen( $slayer ) . " \");</script>";
			
			if	($ent_type	== "LINE"){
 
				//$slayer	=	$object[$i][3];
				$dx1	=	(float) $object[$i][5];
				$dy1	=	(float) $object[$i][6];
				$dz1	=	(float) $object[$i][7];
				$dx2	=	(float) $object[$i][8];
				$dy2	=	(float) $object[$i][9];
				$dz2	=	(float) $object[$i][10];
				$this->ent_line($fdxf,$slayer,$dx1,$dy1,$dz1,$dx2,$dy2,$dz2);
/*
			}else if($ent_type	== "PLINE"){
				
				$itsize;
				$dtx = [];
				$dty = [];
				
				// calc data pairs ..
				$ipair = (int)( ( count( $object[$i] ) - 5 ) / 2 );
				
				for( $iia = 0; $iia < $ipair; $iia++){
					$itsize = count( $dtx );
					$dtx[ $itsize ] =	(float) $object[$i][ 5 + 2 * $iia];
					$dty[ $itsize ]	=	(float) $object[$i][ 6 + 2 * $iia];
				}
				
				$this->ent_pline($fdxf,$slayer,$dtx,$dty);
*/				
			}else if($ent_type	== "ARC"){
 
				//$slayer	=	$object[$i][3];
				$do[0]			=	(float) $object[$i][5];
				$do[1]			=	(float) $object[$i][6];
				$do[2]			=	(float) $object[$i][7];
				$dradii			=	(float) $object[$i][8];
				$dangb			=	(float) $object[$i][9];
				$dange			=	(float) $object[$i][10];
				
				$this->ent_arc($fdxf,$slayer,$do[0],$do[1],$do[2],$dradii,$dangb,$dange);
				
			}else if($ent_type	== "CIRCLE"){
 
				//$slayer	=	$object[$i][3];
				$dx			=	(float) $object[$i][5];
				$dy			=	(float) $object[$i][6];
				$dz			=	(float) $object[$i][7];
				$dradii		=	(float) $object[$i][8];
				$this->ent_circle($fdxf,$slayer,$dx,$dy,$dz,$dradii);
/*
			}else if($ent_type	== "TEXT"){
 
				//$slayer		=	$object[$i][3];
				$dx			=	(float) $object[$i][5];
				$dy			=	(float) $object[$i][6];
				$stext		=	$object[$i][7];
				$textsize	=	(float)	$object[$i][8];
				if( $object[$i][8]  == '' ){
					$textsize			= 0.25;
				}
				$textangrad	=	(float)	$object[$i][9];
				if( $object[$i][9]  == '' ){
					$textangrad			= 0.0;
				}
				$iattach	=	(float)	$object[$i][10];
				if( $object[$i][10]  == '' ){
					$iattach		= 1; // default
				}
				$this->ent_mtext($fdxf, $slayer, $dx, $dy, $stext, $textsize, $textangrad, $iattach) ;
*/				
			}else if($ent_type	== "POINT"){
 
				//$slayer		=	$object[$i][3];
				$dx			=	(float) $object[$i][5];
				$dy			=	(float) $object[$i][6];
				$dz				=	(float) $object[$i][7];
				$this->ent_point($fdxf,$slayer,$dx,$dy,$dz);
/*			
			}else if($ent_type	== "SPLINE"){
  
				//$slayer		=	$object[$i][3];
				
				$iasize		= count( $object[$i] );
				
				$iposi = 0;
				
				for($j = 5; $j< count( $object[$i] );$j+=3){
					$dx[ $iposi ]	=	(float) $object[$i][ $j + 0 ];
					$dy[ $iposi ]	=	(float) $object[$i][ $j + 1 ];
					$dz[ $iposi ]	=	(float) $object[$i][ $j + 2 ];
					$iposi++;
				}
				$this->ent_spline($fdxf,$slayer,$dx,$dy,$dz);
*/				
			}
		}					

		# entity end
		//fwrite($fdxf, "0"."\r\n");
        //fwrite($fdxf, "ENDSEC"."\r\n");		

		$this->dxf_eof($fdxf);		//
				
		fclose($fdxf);
				
	}

	function dxf_bof($fdxf){

		fwrite($fdxf, "999"."\r\n");
		fwrite($fdxf, "Colour"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "SECTION"."\r\n");
		fwrite($fdxf, "2"."\r\n");
		fwrite($fdxf, "HEADER"."\r\n");
		fwrite($fdxf, "9"."\r\n");
		fwrite($fdxf, "\$ACADVER"."\r\n");
		fwrite($fdxf, "1"."\r\n");
		fwrite($fdxf, "AC1006"."\r\n");
		fwrite($fdxf, "9"."\r\n");
		fwrite($fdxf, "\$INSBASE"."\r\n");
		fwrite($fdxf, "10"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "20"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "30"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "9"."\r\n");
		fwrite($fdxf, "\$EXTMIN"."\r\n");
		fwrite($fdxf, "10"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "20"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "9"."\r\n");
		fwrite($fdxf, "\$EXTMAX"."\r\n");
		fwrite($fdxf, "10"."\r\n");
		fwrite($fdxf, "1000000000"."\r\n");
		fwrite($fdxf, "20"."\r\n");
		fwrite($fdxf, "1000000000"."\r\n");
		fwrite($fdxf, "9"."\r\n");
		fwrite($fdxf, "\$LIMMIN"."\r\n");
		fwrite($fdxf, "10"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "20"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "9"."\r\n");
		fwrite($fdxf, "\$LIMMAX"."\r\n");
		fwrite($fdxf, "10"."\r\n");
		fwrite($fdxf, "1000000000"."\r\n");
		fwrite($fdxf, "20"."\r\n");
		fwrite($fdxf, "1000000000"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "ENDSEC"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "SECTION"."\r\n");
		fwrite($fdxf, "2"."\r\n");
		fwrite($fdxf, "TABLES"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "TABLE"."\r\n");
		fwrite($fdxf, "2"."\r\n");
		fwrite($fdxf, "LTYPE"."\r\n");
		fwrite($fdxf, "70"."\r\n");
		fwrite($fdxf, "1"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "LTYPE"."\r\n");
		fwrite($fdxf, "2"."\r\n");
		fwrite($fdxf, "CONTINUOUS"."\r\n");
		fwrite($fdxf, "70"."\r\n");
		fwrite($fdxf, "64"."\r\n");
		fwrite($fdxf, "3"."\r\n");
		fwrite($fdxf, "Solid line"."\r\n");
		fwrite($fdxf, "72"."\r\n");
		fwrite($fdxf, "65"."\r\n");
		fwrite($fdxf, "73"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "40"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "ENDTAB"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "TABLE"."\r\n");

		fwrite($fdxf, "2"."\r\n");      //  Layer Start
		fwrite($fdxf, "LAYER"."\r\n");
		fwrite($fdxf, "70"."\r\n");
		fwrite($fdxf, "6"."\r\n");

		for ( $i = 0; $i <	count( $this->layer ) ;	$i++) {

            fwrite($fdxf, "0"."\r\n");
            fwrite($fdxf, "LAYER"."\r\n");
            fwrite($fdxf, "2"."\r\n");  // Layer Name   $this->layer[ count($this->layer)  ][2]
            fwrite($fdxf, $this->layer[ $i ][0]."\r\n");
            fwrite($fdxf, "70"."\r\n"); // standard flag
            fwrite($fdxf, "64"."\r\n");
            fwrite($fdxf, "62"."\r\n"); // Color Number
            fwrite($fdxf, $this->layer[ $i ][1]."\r\n");
            fwrite($fdxf, "6"."\r\n");  // Linetype Name
            fwrite($fdxf, "CONTINUOUS"."\r\n"); // default
            //fwrite($fdxf, $this->layer[ $i ][2]."\r\n");

        }

		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "ENDTAB"."\r\n");     // Layer End

		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "TABLE"."\r\n");
		fwrite($fdxf, "2"."\r\n");
		fwrite($fdxf, "STYLE"."\r\n");
		fwrite($fdxf, "70"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "ENDTAB"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "ENDSEC"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "SECTION"."\r\n");
		fwrite($fdxf, "2"."\r\n");
		fwrite($fdxf, "BLOCKS"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "ENDSEC"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "SECTION"."\r\n");
		fwrite($fdxf, "2"."\r\n");
		fwrite($fdxf, "ENTITIES"."\r\n");

	}

	function dxf_eof($fdxf){

		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "ENDSEC"."\r\n");
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "EOF"."\r\n");

	}

	function ent_line($fdxf,$slayer,$dx1,$dy1,$dz1,$dx2,$dy2,$dz2){
        fwrite($fdxf,  "0"."\r\n");
        fwrite($fdxf,  "LINE"."\r\n");
        fwrite($fdxf,  "8"."\r\n");    		// layer name
        fwrite($fdxf,  $slayer."\r\n");
        //fwrite($fdxf,  "   6"            	// LINETYPE
        //fwrite($fdxf,  oLayer(ilayer).sName
        //fwrite($fdxf,  "  62"            	// COLOR NUMBER
        //fwrite($fdxf,  "1"
        //fwrite($fdxf,  "100"."\r\n");
        //fwrite($fdxf,  "AcDbLine"."\r\n");
        fwrite($fdxf,  "10"."\r\n");
        fwrite($fdxf,  $dx1."\r\n");
        fwrite($fdxf,  "20"."\r\n");
        fwrite($fdxf,  $dy1."\r\n");
        fwrite($fdxf,  "30"."\r\n");
        fwrite($fdxf,  $dz1."\r\n");
        fwrite($fdxf,  "11"."\r\n");
        fwrite($fdxf,  $dx2."\r\n");
        fwrite($fdxf,  "21"."\r\n");
        fwrite($fdxf,  $dy2."\r\n");
        fwrite($fdxf,  "31"."\r\n");
        fwrite($fdxf,  $dz2."\r\n");
	}
	
	function ent_arc($fdxf,$slayer,$dx,$dy,$dz,$dradii,$dangb,$dange){
		// 
        // 각도 기준은 반시계방향임..
        //
		fwrite($fdxf,  "0"."\r\n");
        fwrite($fdxf,  "ARC"."\r\n");
		//# update 2015.04.08
		//$this->ihandle	=	$this->ihandle	+	1;
		//fwrite($fdxf, "  5"."\r\n");
		//fwrite($fdxf, $this->ihandle."\r\n");
		//#
        //fwrite($fdxf,  "100"."\r\n");
        //fwrite($fdxf,  "AcDbEntity"."\r\n");
        fwrite($fdxf,  "8"."\r\n");
        fwrite($fdxf,  $slayer."\r\n");
        //'## linetype scale �߰�
        //fwrite($fdxf,  " 48"
        //fwrite($fdxf,  Format(0.5 * FSCALE, "0.000")
        //' ##
        //fwrite($fdxf,  "100"."\r\n");
        //fwrite($fdxf,  "AcDbCircle"."\r\n");
        fwrite($fdxf,  "10"."\r\n");
        fwrite($fdxf,  $dx."\r\n");
        fwrite($fdxf,  "20"."\r\n");
        fwrite($fdxf,  $dy."\r\n");
        fwrite($fdxf,  "30"."\r\n");
        fwrite($fdxf,  $dz."\r\n");
        fwrite($fdxf,  "40"."\r\n");
        fwrite($fdxf,  $dradii."\r\n");
        fwrite($fdxf,  "50"."\r\n");
        fwrite($fdxf,  $dangb."\r\n");
        fwrite($fdxf,  "51"."\r\n");
        fwrite($fdxf,  $dange."\r\n");
	}

	function ent_circle($fdxf,$slayer,$dx,$dy,$dz,$dradii){
        fwrite($fdxf,  "0"."\r\n");
        fwrite($fdxf,  "CIRCLE"."\r\n");
		//# update 2015.04.08
		//$this->ihandle	=	$this->ihandle	+	1;
		//fwrite($fdxf, "  5"."\r\n");
		//fwrite($fdxf, $this->ihandle."\r\n");
		//#
        //fwrite($fdxf,  "100"."\r\n");
        //fwrite($fdxf,  "AcDbEntity"."\r\n");
        fwrite($fdxf,  "8"."\r\n");            //' layer name
        fwrite($fdxf,  $slayer."\r\n");
        //fwrite($fdxf,  "100"."\r\n");
        //fwrite($fdxf,  "AcDbCircle"."\r\n");
        fwrite($fdxf,  "10"."\r\n");           //' center : x value
        fwrite($fdxf,  $dx."\r\n");
        fwrite($fdxf,  "20"."\r\n");            //' center : y value
        fwrite($fdxf,  $dy."\r\n");
        fwrite($fdxf,  "30"."\r\n");            //' center : z value
        fwrite($fdxf,  $dz."\r\n");
        fwrite($fdxf,  "40"."\r\n");
        fwrite($fdxf,  $dradii."\r\n");
        //fwrite($fdxf,  "210"."\r\n");            ' direction Vector
        //fwrite($fdxf,  "0"."\r\n");
        //fwrite($fdxf,  "220"."\r\n");            ' direction vector
        //fwrite($fdxf,  "0"."\r\n");
        //fwrite($fdxf,  "230"."\r\n");            ' direction vector
        //fwrite($fdxf,  "1.0"."\r\n");

	}

	function ent_point($fdxf,$slayer,$dx,$dy,$dz){
		fwrite($fdxf, "0"."\r\n");
		fwrite($fdxf, "POINT"."\r\n");
		//fwrite($fdxf, "5"."\r\n");
		//$this->ihandle	=	$this->ihandle	+	1;
		//fwrite($fdxf, $this->ihandle."\r\n");
		//fwrite($fdxf, "330
		//fwrite($fdxf, "1F
		//fwrite($fdxf, "100"."\r\n");
		//fwrite($fdxf, "AcDbEntity"."\r\n");
		fwrite($fdxf, "8"."\r\n");
		fwrite($fdxf, $slayer."\r\n");
		//fwrite($fdxf, "100"."\r\n");
		//fwrite($fdxf, "AcDbPoint"."\r\n");
		//fwrite($fdxf, "62"."\r\n");
		//fwrite($fdxf, $icolornumber."\r\n");
		fwrite($fdxf, "10"."\r\n");
		fwrite($fdxf, $dx."\r\n");
		fwrite($fdxf, "20"."\r\n");
		fwrite($fdxf, $dy."\r\n");
		fwrite($fdxf, "30"."\r\n");
		fwrite($fdxf, $dz."\r\n");
		//fwrite($fdxf, "39"."\r\n");
		//fwrite($fdxf, $dthickness."\r\n");
	}	

}
?>
