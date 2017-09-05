<?php 

    require_once("httpRequest.php");

	function getNearbyStationList(){  
	  	
		// $data=array();  
		// $data['userId']=session('ID');            
		// $data['id']=$_POST['id'];   
		// $data['name']=$_POST['kfname'];           
		// $data['phone']=$_POST['kfphone'];                                                  
		$data_json=json_encode($data);  

        $longitude = $_GET['longitude'];//经度
        $latitude = $_GET['latitude'];//纬度
        

		//这个C是什么意思?
		//$_httpurl=C("SERVER_URL")."manage/updatePrestoreUser";  

		// $_httpurl = "http://221.180.145.86/bus/station/nearby?_en=1&mc=123.464413,41.716465&range=1000";
        $_httpurl = "http://221.180.145.86/bus/station/nearby?_en=1&mc=".$longitude.",".$latitude."&range=1000";

		$result=post_server_data($_httpurl,$data_json);

		if($result) {  
		  if($result['status']==200) {  
		    	echo json_encode($result,true);  
		  } else{  
		    	echo 'error';
		  }             
		} else {  
			echo "网络连接服务器出现异常！";  
		}    
	} 

	this.getNearbyStationList();
?>