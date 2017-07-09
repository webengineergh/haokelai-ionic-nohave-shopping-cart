<?php
  header("Content-Type:application/json,charset=utf-8");
  @$start = $_REQUEST['start'];
  if(empty($start)){
    $start = 0;
  }

  $conn = mysqli_connect('127.0.0.1','root','','haokelai');
  mysqli_query($conn,"SET NAMES UTF8");
  $sql  = "SELECT did,name,img_sm,material,price FROM kf_dish LIMIT $start,5";
  $result = mysqli_query($conn,$sql);
  $output = [];

  while(true){
    $row = mysqli_fetch_assoc($result);
    if(!$row){
      break;
    }
    $output[] = $row;
  }
  echo json_encode($output);
?>