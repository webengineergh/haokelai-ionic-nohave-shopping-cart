//创建模块
var app = angular.module('kfl',['ionic']);

//自定义服务---每次每个页面加载的时候显示正在加载的信息
app.service('$kflHttp', ['$http','$ionicLoading',function ($http,$ionicLoading) {
  this.sendRequest = function (url, handleSucc) {
    //url：请求的地址和参数  handleSucc:成功之后的处理函数
    $ionicLoading.show({template:'loading...'});
    $http
      .get(url)
      .success(function(data){
        $ionicLoading.hide();
        handleSucc(data);
      });
  }
}]);

//配置状态机
app.config(function($stateProvider,$ionicConfigProvider,$urlRouterProvider){
  //调整tabs固定在底部,不论在什么设备中
  $ionicConfigProvider.tabs.position('buttom');

  //添加状态
  $stateProvider
    .state('kflStart',{
      url:'/kflStart',
      templateUrl:'tpl/start.html'
  })
    .state('kflMain',{
      url:'/kflMain',
      templateUrl:'tpl/main.html',
      controller:'mainCtrl'
    })
    .state('kflDetail',{
      url:'/kflDetail/:id',
      templateUrl:'tpl/detail.html',
      controller:'detailCtrl'
    })
    .state('kflOrder',{
      url:'/kflOrder/:id',
      templateUrl:'tpl/order.html',
      controller:'orderCtrl'
    })
    .state('kflMyOrder',{
      url:'/kflMyOrder',
      templateUrl:'tpl/myOrder.html',
      controller:'myOrderCtrl'
    });
   $urlRouterProvider.otherwise('/kflStart');
});

//创建一个body父控制器，给body使用---其他所有的对象都可以使用这个控制器继承他的方法，希望所有的代码片段都能够调用该控制器中封装的变量和方法
app.controller('parentCtrl',['$scope','$state',function($scope,$state){
  //通过$state跳转到设置页面
  //跳转到指定的路由地址对应的页面
  $scope.jump = function(desState,arg){
    $state.go(desState,arg);   //跳转到目标地址----调用的时候传参
  }
}]);

//main--产品主页面
app.controller('mainCtrl', ['$scope', '$kflHttp',
  function ($scope, $kflHttp) {
    $scope.hasMore = true;
    //加载首页数据
    $kflHttp.sendRequest(
      'data/dish_getbypage.php',
      function (data) {
        console.log(data);
        $scope.dishList = data;
      });
    //给按钮定义一个处理函数：加载更多数据
    $scope.loadMore = function () {
      $kflHttp.sendRequest(
        'data/dish_getbypage.php?start='+$scope.dishList.length,
        function (data) {
          if(data.length < 5){
            $scope.hasMore = false;
          }
          $scope.dishList = $scope.dishList.concat(data);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      )
    };
    //在ng的项目中 如果需要用到方向2的绑定，也就是ngModel，官方建议是要将模型数据存储一个对象中

    $scope.inputText = {kw:''};

    //监听用户输入 的关键词进行搜索
    $scope.$watch('inputText.kw', function () {

      $kflHttp.sendRequest(
        'data/dish_getbykw.php?kw='+$scope.inputText.kw,
        function (data) {
          if(data.length > 0){
            $scope.dishList = data;
          }
        })
    })
  }]);

//detail--产品详情页面
app.controller('detailCtrl',['$scope','$kflHttp','$stateParams',function($scope,$kflHttp,$stateParams){
  console.log($stateParams);
  $kflHttp.sendRequest(
    'data/dish_getbyid.php?id='+$stateParams.id,
    function (data) {
      if(data){
        $scope.dish = data[0];
      }
    })
}]);

//order--填写订单信息的页面
app.controller('orderCtrl',['$scope','$kflHttp','$stateParams','$httpParamSerializerJQLike',function($scope,$kflHttp,$stateParams,$httpParamSerializerJQLike){
  console.log($stateParams);

  $scope.order = {did:$stateParams.id};
  $scope.submitOrder = function () {

    var params = $httpParamSerializerJQLike($scope.order);

    console.log($scope.order);
    $kflHttp.sendRequest(
      'data/order_add.php?'+params,
      function (data) {
        if(data.length>0){
          if (data[0].msg == 'succ') {
            $scope.result = "下单成功，订单编号为" + data[0].oid;
            //存起来
            sessionStorage.setItem('phone', $scope.order.phone);
          }
          else {
            $scope.result = "下单失败！";
          }
        }
      })
  }
}]);

//myOrder--我的订单中心页面
app.controller('myOrderCtrl', ['$scope', '$kflHttp', function ($scope, $kflHttp) {
  //拿到手机号
  var phone = sessionStorage.getItem('phone');
  console.log(phone);
  //发起网络请求
  $kflHttp.sendRequest(
    'data/order_getbyphone.php?phone=' + phone,
    function (data) {
        $scope.orderList = data;
    })
}]);



