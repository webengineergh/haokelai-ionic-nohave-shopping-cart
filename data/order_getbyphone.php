<?php
  header("Content-Type:application/json,charset=utf-8");
  @$phone = $_REQUEST['phone'];

  if(empty($phone))
    {
      echo '[]';
      return;
   }
  $conn = mysqli_connect('127.0.0.1','root','','haokelai');
  mysqli_query($conn,"SET NAMES UTF8");
  $sql  = "SELECT kf_order.oid,kf_order.order_time,kf_order.user_name,kf_order.did ,kf_dish.img_sm FROM kf_dish,kf_order WHERE kf_order.phone=$phone AND kf_order.did=kf_dish.did";
  $result = mysqli_query($conn,$sql);
  $output = [];
  $row = mysqli_fetch_assoc($result);
  $output[] = $row;
  echo json_encode($output);
?>