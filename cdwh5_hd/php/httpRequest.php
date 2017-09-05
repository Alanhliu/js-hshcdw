<?php 
	function post_server_data($url,$data){  
        $ch = curl_init($url);  
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");  
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);  
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);   
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(  
                'Content-Type: application/json',  
                'Content-Length: ' . strlen($data))  
        );  

        $result=curl_exec($ch);  
          
        if ($result === FALSE) {  
            echo "cURL Error: " . curl_error($ch);  
            curl_close($ch);  
            //die();  
        }   

        $data=json_decode($result,true);  

        if (!is_array($data)){  
            vendor('json.class#json'); //采用第三方JSON  
            $json = new Services_JSON();  
            return $this->object_to_array($json->decode($result));  
        }else{  
            return $data;  
        }  
    }  
?>