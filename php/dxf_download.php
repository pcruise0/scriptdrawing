<?
include_once("https://rawcdn.githack.com/pcruise0/pacod/e974bcb7f890c59f2a077b26ecd1e3c15b0cfe14/php/clspuredxf.php");

//echo "<script>alert( ' asfer download dxf  ' );</script>";       

define("work_dir", "../output/"); // 절대경로
define("tolerance",1e-6);

# Get Dxf data from Parent form	
	//$sfile = "test.dat";

	$caddata      =  $_POST['caddata'];     // dxf data 받아오기
    $outfile    =  "excelcad.dxf";

//echo "<script>alert( ' $caddata  ' );</script>";        

#------------------------------------
#	print geometry
#------------------------------------
	$fdxf 		= new clspuredxf();
#	echo $data;
	$fdxf->prtdxf(work_dir, $outfile, $caddata);


/*
	파일 다운로드... 기본 경로가 다운로드 폴더이므로, 파일선택창이 필요 없음..
*/
	
    download(work_dir,$outfile);


// CAD DATA를 이용하여, dxf code 를 생성..

/*
	// Print DXF
	$afile = work_dir.$sfile;
	$fdxf = fopen($afile,"w");

	# entity end
	fwrite($fdxf, $data."\r\n");

	fclose($fdxf); 
*/
    

//	
// test 를 위해 echo를 사용할경우
// 파일 다운로드시.. Header 가 이미 sent 되었다는 경고가 뜨면서 오류발생할 수 잇음.
//

//		if ( file_exists( $afile) ) {
//			echo "<script> alert('created'); </script>";
//		}
//		
//echo "<script> alert('".$data."'); </script>";
		
#--------------

//
// 
//	# dxf file
//	include_once("/php/clsdxf_pure.php");	
//	$fdxf 		= new clsdxf();
//	//$outfile 	= "test.dxf";
//	//$outfile	= $_SESSION['id'].date("H").date("i").date("d").date("s") . ".dxf";
//	//$outfile	= date("m").date("H").date("w").date("i").date("d").date("s") . ".dxf";
//	$outfile	=	date("m").date("d").date("H").date("i").date("s") . ".dxf";
//
//# Get Dxf data from Parent form	
//	$data = $_POST['caddata'];
//	
//#------------------------------------
//#	print geometry
//#------------------------------------
//#	echo $data;
//	$fdxf->prtdxf(work_dir, $outfile, $data);

#	echo	"download finished";
#	      echo "<script>alert(\"이렇게 띄우면 되자나\");</script>";




/*
	저장할 위치는 아래 코드에서 선택창으로 선택 가능
*/
function download($dir, $file){

		// Download Module
		//$file= $dir.$file;    // 화일이 실제로 있는 위치를.. 
		$savefile = $file;
		$realfile =	$dir . $file;
		//$file_size=filesize($realfile); 

    if( file_exists($realfile)){

//        Header("Content-type: file/unknown"); 
        
		header("Content-Type:application/octet-stream");
		header("Content-Disposition:attachment;filename=$file");
		header("Content-Transfer-Encoding:binary");
		header("Content-Length:".filesize($realfile));
//        header("Cache-Control: no-cache");
//        header("Pragma: no-cache"); 
//        header("Expires: -1"); 
      
        header("Cache-Control:cache,must-revalidate");
        //header("Cache-Control:private");
		header("Pragma:no-cache");
		header("Expires:0");
		
        $fp = fopen($realfile,"r");
        while(!feof($fp)){
          $buf = fread($fp,filesize($realfile));
          $read = strlen($buf);
          print($buf);
          flush();
        }
        fclose($fp);
		
    }
		
	// delete temporary file
	while( file_exists($realfile) ){
	 unlink( $realfile );
	}
		
		
}
?>

