<?php
  header("Content-Type:application/json,charset=utf-8");
  @$id = $_REQUEST['id'];

  if(empty($id))
    {
      echo '[]';
      return;
   }
  $conn = mysqli_connect('127.0.0.1','root','','haokelai');
  mysqli_query($conn,"SET NAMES UTF8");
  $sql  = "SELECT did,name,price,img_lg,material FROM kf_dish WHERE did =$id";
  $result = mysqli_query($conn,$sql);
  $output = [];
  $row = mysqli_fetch_assoc($result);
  $output[] = $row;
  echo json_encode($output);
?>