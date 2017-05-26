angular.module('starter.settingscontroller', [])


.controller('taxSetting', ['$scope', '$rootScope', '$state', '$cordovaSQLite', '$ionicPlatform', 'settingService','$ionicLoading', function($scope, $rootScope, $state, $cordovaSQLite, $ionicPlatform, settingService,$ionicLoading) {    
    console.log('I am in tax  settings');

    $scope.taxSettings = [];
    $scope.txSetting = {};
    $scope.tax={}
    $scope.addView=true;
    console.log($rootScope.TaxSettings.length);
    for( var i=0;i<$rootScope.TaxSettings.length;i++){
    $scope.taxSettings[i] = {
        id: $rootScope.TaxSettings[i].id,
        name: $rootScope.TaxSettings[i].name,
        taxRate: $rootScope.TaxSettings[i].taxRate
    };
    }
    //$scope.taxSettings=[]
    console.log($scope.taxSettings);
    
    var taxSettings = []
    console.log($rootScope.TaxSettings)

    $scope.add=function(tax){
       $scope.tax=tax
        for(var i=0;i<$rootScope.TaxSettings.length;i++){
            if(tax.id==$rootScope.TaxSettings[i].id){
                 $scope.tax=tax;
                console.log($rootScope.TaxSettings[i].taxRate);
            }
        }
    }
    

    $scope.saveTaxSetting = function(taxid) {
        console.log($scope.taxSettings);
          var taxNme=$scope.txSetting.name;
    if(taxNme==undefined ||taxNme.length<1){
        console.log('Enter tax Setting')
        return false
    }


    var taxRate=$scope.txSetting.taxRate;
    var pattern=new RegExp('^[0-9]+([,.][0-9]+)?$');
    if(taxRate==undefined ||taxRate.length<1){
        console.log('Enter tax Rate')
    }else if(!pattern.test(taxRate)){
        console.log('Invalid tax Rate')
        return false
    }else if(taxRate>100){
        console.log('Invalid Tax Rate')
         $rootScope.ShowToast("Invalid Tax Rate", false);
         return false
    }

        var d = new Date();
        $scope.taxSettings.push({
             id:d,
           name: $scope.txSetting.name,
           taxRate:$scope.txSetting.taxRate
        })

        
         $scope.SaveTaxSettingsToDB($scope.taxSettings);
    }


    $scope.SaveTaxSettingsToDB= function(taxsettings1)
    {

     var taxSettings = JSON.stringify(taxsettings1);

        var promise = settingService.set("TaxSettings", taxSettings);
        promise.then(function(data) {
            console.log(data);
            if (data.rowsAffected >= 1) {
                console.log("Data inserted");
                 $scope.txSetting = {};
                 $scope.addView = true;
                 $rootScope.TaxSettings = taxsettings1;

            } else { 
                console.log('Unable to Save TaxSettings');
            }
        })

    }


$scope.GetTaxIndex = function(taxId)
{
  for(var i=0;i<$scope.TaxSettings.length;i++){

            if(taxId==$rootScope.TaxSettings[i].id)
            {
               return(i);
           
            }
  
  }

  return(-1);

}

$scope.deleteTaxSettings=function(taxId)
{
 var ind = $scope.GetTaxIndex(taxId);

        if(ind >-1)//found index;;
        {
             //delete taxSettings
             $scope.TaxSettings.splice(ind,1);
             $scope.SaveTaxSettingsToDB($scope.TaxSettings);
             console.log("Deleted");
        }

}

    $scope.editTaxSetting=function(taxId){

        var taxNme=$scope.txSetting.name;
    if(taxNme==undefined ||taxNme.length<1){
        console.log('Enter tax Setting')
        return false
    }


    var taxRate=$scope.txSetting.taxRate;
    var pattern=new RegExp('^[0-9]+([,.][0-9]+)?$');
    if(taxRate==undefined ||taxRate.length<1){
        console.log('Enter tax Rate')
    }else if(!pattern.test(taxRate)){
        console.log('Invalid tax Rate')
        return false
    }

     var ind = $scope.GetTaxIndex(taxId);

        if(ind >-1)//found index;;
        {
            $scope.taxSettings[ind].name = $scope.txSetting.name;
            $scope.taxSettings[ind].taxRate = $scope.txSetting.taxRate;
            //$scope.taxSettings[ind].id = ind;
            $scope.SaveTaxSettingsToDB($scope.taxSettings);

        }
        else
        {
          console.log("Tax Settings Not Found");
          $rootScope.ShowToast("Tax Settings Not Found",false);

        }

     
    }

$scope.view=function(tax){
$scope.addView=false;
$scope.txSetting.id=tax.id;
$scope.txSetting.name=tax.name;
$scope.txSetting.taxRate=tax.taxRate;
   }


    
}])



.controller('printerSettings', function($scope, settingService, $rootScope) {
    $scope.printFormatSettings = {};
    $scope.printFormatSettings['addressLine1'] = $rootScope.printFormatSettings.addressLine1;
    $scope.printFormatSettings.addressLine2 = $rootScope.printFormatSettings.addressLine2;
        $scope.printFormatSettings.billCopies = $rootScope.printFormatSettings.billCopies;
        $scope.printFormatSettings.greeting = $rootScope.printFormatSettings.greeting;
        $scope.printFormatSettings.phNumber = $rootScope.printFormatSettings.phNumber;
        $scope.printFormatSettings.shopName = $rootScope.printFormatSettings.shopName;
        $scope.printFormatSettings.strtBillNmbr = $rootScope.printFormatSettings.strtBillNmbr;
        $scope.printFormatSettings.tin = $rootScope.printFormatSettings.tin;
        $scope.printFormatSettings.tokNum = $rootScope.printFormatSettings.tokNum;
        $scope.printFormatSettings.tokResetAftr = $rootScope.printFormatSettings.tokResetAftr;
        $scope.printFormatSettings.tokStartNmbr = $rootScope.printFormatSettings.tokStartNmbr;
        $scope.printFormatSettings.wifiSsid = $rootScope.printFormatSettings.wifiSsid;
    

    $scope.savePrinterSettings = function() {
        var shopName=$scope.printFormatSettings.shopName;
        var pattern= new RegExp('^[a-z0-9]+$');
        if(shopName==undefined||shopName.length<2){
            $rootScope.ShowToast("Enter Shop Name", false);
                console.log('Enter Shop Name')
                return false
            }
        var number1=$scope.printFormatSettings.phNumber;
        var pattern= new RegExp('^[0-9\+\]+$');
        if(number1 == undefined || number1 == "")
           {
               console.log("Phone Number not entered");
               $scope.printFormatSettings.phNumber == "";
           }
        else if(!pattern.test(number1)){
            $rootScope.ShowToast("Invalid Number", false);
            console.log('Invalid Number')
            return false;
        }


        var tinNum=$scope.printFormatSettings.tin;
        var pattern= new RegExp('^[0-9]+$');
        if(tinNum == undefined || tinNum == "")
           {
               console.log("Tin Number not entered");
               $scope.printFormatSettings.tin == "";
           }
        else if(!pattern.test(tinNum)){
            $rootScope.ShowToast("Invalid TIN Number", false);
            return(false);
        }
       
        var billNumber=$scope.printFormatSettings.strtBillNmbr;
        var pattern= new RegExp('^[0-9]+$');
        if(billNumber==undefined||billNumber.length<1){
            $scope.printFormatSettings.strtBillNmbr=document.getElementById('billNumber').value=1;
        }else if(!pattern.test(billNumber)){
            console.log('Invalid bill Number')
            return false
        }


         var trtTokenNum = 0;
         var restTokenNum =0;

        if($scope.printFormatSettings.tokNum == "Auto")

     {
        trtTokenNum=$scope.printFormatSettings.tokStartNmbr;
        restTokenNum=$scope.printFormatSettings.tokResetAftr;


         var pattern= new RegExp('^[0-9]+$');
        console.log(trtTokenNum)
        if(trtTokenNum==undefined||trtTokenNum == ""){
            $scope.printFormatSettings.tokStartNmbr=1;
        }else if(!pattern.test(trtTokenNum)){
            console.log('Invalid Token Number')
            return false
        }
        
      
           var pattern= new RegExp('^[0-9]+$');
        if(restTokenNum==undefined||restTokenNum == ""){
            $scope.printFormatSettings.tokResetAftr=999;
        }else if(!pattern.test(restTokenNum)||restTokenNum<trtTokenNum){
            console.log('Invalid Input or reset should be greater then start token number')
            return false
        }

    }
    else
    {
        $scope.printFormatSettings.tokStartNmbr = 1;
        $scope.printFormatSettings.tokResetAftr=999;
    }


       var billCopies=$scope.printFormatSettings.billCopies;
       var pattern= new RegExp('^[0-9\+\]+$');

       if(billCopies==undefined||billCopies.length<1 || billCopies < 1){
            $scope.printFormatSettings.billCopies=1;
        }
        else if(billCopies > 3)
        {

            $rootScope.ShowToast("Max Bill Copies allowed is 3",false);
            console.log("Bill copies greater than 3");
            return(false);
        }
        else if(!pattern.test(billCopies))
        {
             $rootScope.ShowToast("Invalid Max Bill Copies",false);
            console.log("Invalid Max Bill Copies");
            return(false);
        }

       
        console.log($scope.printFormatSettings)
        var printFormatSettings = JSON.stringify($scope.printFormatSettings);
        var promise = settingService.set("PrinterFormatSettings", printFormatSettings);
        promise.then(function(data) {
            console.log(data)
            if (data.rowsAffected >= 1) {
                $rootScope.printFormatSettings = $scope.printFormatSettings;
                $rootScope.ShowToast("Settings Saved",false);
                //close here;;
            } else {
                console.log("Failed to Save Settings");
                $rootScope.ShowToast("Failed to Save Settings",false);
            }
        },function(err){

            console.log("Failed to Save Settings");
            $rootScope.ShowToast("Failed to Save Settings",false);
        })
    }
})




.controller('BlueToothCtrl', function($scope, settingService, $rootScope,$ionicLoading) {

$scope.CurrentDevice = "";

//$rootScope.InitPrinter();


$scope.SaveBluetoothSettings = function(btsettings)
{

var promise = settingService.set("bluetoothSettings", JSON.stringify(btsettings));
            promise.then(function(data) {
            //console.log(data.rows.length);
            console.log(data)
            if (data.rowsAffected >= 1)
            {
                console.log("Settings Saved");
                $rootScope.ShowToast("BT Settings Saved",false);
                $rootScope.BluetoothSettings = btsettings;
            }
        })
}

function OnSuccessPairedList(data,status)
{
 if(status ==false)
  {
      console.log("Unable to Get Paired List");
      $rootScope.ShowToast("Unable to Get Paired List");
     
  }
  else
  {
      console.log("Success getting Paired List");
       $scope.pairedDevices = [];
       for(var i=0;i<data.length;i++)
       {
           $scope.pairedDevices[i] = {};
           $scope.pairedDevices[i].name = data[i];
           if(data[i] == $rootScope.printerName && $rootScope.PrinterStatus == true)
           {
            $scope.pairedDevices[i].status = "connected";
           }
           else
           {
            $scope.pairedDevices[i].status = "not connected";
           }
       }
      //$rootScope.ShowToast("Unable to Get Paired List");
  }

}

//$scope.getPairedList = function()
//{
    //$scope.CurrentDevice = "";
    $rootScope.getPairedList(OnSuccessPairedList);
//}

$scope.selectDevice = function(device)
{
$scope.CurrentDevice = device;
console.log("sel Device is: ", device);
$rootScope.ShowToast("Sel Device: " + device, false);
}



function OnsuccessConnect(status,name)
{
   if(status == true)
   {
       console.log("Sucessfully Connected to Printer: ", $scope.CurrentDevice);
       $rootScope.ShowToast("Sucessfully Connected to Printer: " + $scope.CurrentDevice, false);
       $rootScope.printerName = name;
       $rootScope.PrinterStatus = true;
       var btsettings = {};
       btsettings.PrinterName = name;
       $scope.SaveBluetoothSettings(btsettings);
       $rootScope.getPairedList(OnSuccessPairedList);

   }
   else
   {
       console.log("Failed to Connect to Printer: ", $scope.CurrentDevice);
       $rootScope.ShowToast("Failed to Connect to Printer: "+ $scope.CurrentDevice,false);
       $rootScope.printerName = "";
       $rootScope.getPairedList(OnSuccessPairedList);
   }



}

function OnDisconnectSuccess(ret)
{
   if(ret == true)
   {
       console.log($rootScope.printerName, " Printer Disconnected");
       $rootScope.ShowToast($rootScope.printerName + " Printer Disconnected", false);
       $rootScope.PrinterStatus = false;
       $rootScope.getPairedList(OnSuccessPairedList);
   }
   else
   {
       console.log($rootScope.printerName, " Unable to Disconnect");
       $rootScope.ShowToast($rootScope.printerName + ": Unable to Disconnect",false);
       $rootScope.PrinterStatus = false;
       $rootScope.getPairedList(OnSuccessPairedList);
   }

}

$scope.disconnect = function()
{
    if($rootScope.printerName == "" || $rootScope.PrinterStatus == false)
     {
         console.log("Nothing to Disconnect");
         $rootScope.ShowToast("Not Connected to Printer");
         $rootScope.PrinterStatus = false;
         return;
     }

    $rootScope.printerDisconnect($rootScope.printerName,OnDisconnectSuccess);
}

$scope.connect = function()
{
    if($scope.CurrentDevice == "")
    {
        console.log("No Device to Connect");
        $rootScope.ShowToast("No device to Connect",false);
        //toast;;
        return;
    }

    if($rootScope.PrinterStatus == true)
    {
      console.log("printer Already Connected");
      $rootScope.ShowToast("Please Disconnect before Reconnecting",false);
      return;
    }


    console.log("connecting to device: ", $scope.CurrentDevice);

    //$rootScope.ShowToast("connecting to device: " + $scope.CurrentDevice ,false);

    
         $rootScope.printerConnect($scope.CurrentDevice,OnsuccessConnect);
       
}

$scope.testPrint = function()
{

$rootScope.Testing();
     return;
/*
BTPrinter.printText(function(data){
    console.log("Success");
    $rootScope.ShowToast("Test Print Success");
    console.log("data received:" ,data);
},function(err){
    console.log("Error");
     $rootScope.ShowToast("Failed to Test Print");
    console.log(err)
}, "PayUPad Test Print\n")*/

}


})

.controller('paymentSettings', function($scope, settingService, $rootScope) {
    $scope.Options ={};
    $scope.Options.SelCurrency = {};
    $scope.Options.SelPaymentMode=[];
    //$scope.paymentSetting = {};
    jQuery.getJSON('json/CurrencyOptions.json', function(data) {
         $scope.paymentSetting = {};
         $scope.paymentSetting.currency = data.CurrencyOptions;
         $scope.paymentSetting.paymentOptions = data.PaymentMode;
         console.log($rootScope.PaymentSettings);
         $scope.Options.SelCurrency =   $rootScope.PaymentSettings.CurrencyOptions.id;

         console.log($scope.Options.SelCurrency);
         console.log($scope.paymentSetting.currency);

         console.log("$rootscope.paymentsettings : ",$rootScope.PaymentSettings);
         //$scope.paymentSetting.paymentOptions[0].sel = true;

         for(var i=0;i<$scope.paymentSetting.paymentOptions.length;i++)
         {
             for(var k=0;k<$rootScope.PaymentSettings.PaymentMode.length;k++)
             {
                 if($scope.paymentSetting.paymentOptions[i].id == $rootScope.PaymentSettings.PaymentMode[k].id)
                  {
                      $scope.paymentSetting.paymentOptions[i].sel = true;
                      break;
                  }
             }
           
           
         }

         //$scope.Options.SelPaymentMode = $rootScope.PaymentSettings.PaymentMode;
        });

    
    $scope.savePaymentSettings = function() {
        console.log("Chosen Currency: ", $scope.Options.SelCurrency);
        var tempPaymentSettings = {};

        for(var j=0;j<$scope.paymentSetting.currency.length;j++)
        {
          if($scope.paymentSetting.currency[j].id == $scope.Options.SelCurrency)
          {
              tempPaymentSettings.CurrencyOptions = $scope.paymentSetting.currency[j];
              break;
          }

        }

        tempPaymentSettings.PaymentMode = [];
        for(var i=0;i<$scope.paymentSetting.paymentOptions.length;i++)
        {
          if($scope.paymentSetting.paymentOptions[i].sel!=undefined && $scope.paymentSetting.paymentOptions[i].sel == true)
          {
            tempPaymentSettings.PaymentMode.push($scope.paymentSetting.paymentOptions[i]);

          }

        }
         
        if(tempPaymentSettings.PaymentMode.length<=0) //load defaults;;
           {
              tempPaymentSettings.PaymentMode.push($scope.paymentSetting.paymentOptions[0]);
               
           }

           console.log("Sel Pay Method: ", tempPaymentSettings);
           var paymentSetting = JSON.stringify(tempPaymentSettings);

            var promise = settingService.set("PaymentSettings", paymentSetting);
            promise.then(function(data) {
            console.log(data.rows.length);
            console.log(data)
            if (data.rowsAffected >= 1) {
                var promise = settingService.get("PaymentSettings", paymentSetting);
                promise.then(function(data) {
                    $rootScope.PaymentSettings = JSON.parse(data.rows.item(0).SettingsValue);
                    $rootScope.ShowToast("Payment Settings Updated",false);  
                    console.log("Payment Settings Updated");
                })
            } else {
                console.log('No PayMent Setting Record Found')
                $rootScope.ShowToast("Unable to update Payment Settings",false); 
            }
        })
         //handle error in promise;;

       // console.log("chosen Options:")
        /*console.log($scope.paymentSetting);

        
       */
    }

})

.controller('BillDetails', function($scope,$rootScope,settingService,dbService) {

    $scope.BillDetails = {};
    $scope.BillDetails.BillNo = 0;
    $scope.showTran = false;
    $scope.showBill=false;

    $scope.ShowBills= function(BillNo)
    {

    $scope.showTran = false;
    $scope.showBill=false;

        if(BillNo == 0 || BillNo == "")
        {
        $rootScope.ShowToast("Please Enter Bill No",false);    
        console.log("Bill Number Empty");
        return;
        }
      console.log("Entered Bill No is: ", BillNo);

      $scope.productArr = [];
      /*var product = {};
      product.name = "new Item";
      product.quantity = "45";
      product.productTotalPrice = "555";
      var product2 ={};
      product2.name = "new Item";
      product2.quantity = "45";
      product2.productTotalPrice = "555";
      $scope.productArr.push(product);
      $scope.productArr.push(product2);

      getBillDetails(billNo);
      getTransactionDetails(billNo);*/

      var promise = dbService.getTransactionDetails(BillNo);
                promise.then(function(data) {
                    if(data.length<=0)
                    return;

                    $scope.showTran = true;
    
                     console.log(data);
                     for(var i=0;i<data.length;i++)
                     {
                    var product = {};
                    product.name= data[i].ProductName;
                    product.quantity= data[i].Quantity; 
                    product.productPrice = data[i].ProductPrice;
                    product.productTotalPrice= data[i].TotalPrice;
                    $scope.productArr.push(product);
                     }
                })


                 var promise = dbService.getBillDetails(BillNo);
                    promise.then(function(data) {
                     console.log(data);

                    if(data.length <=0)
                    {
                        console.log("No data found");
                    return;
                    }

                    $scope.showBill=true;
                    $scope.totalPrice= data[0].TotalPrice;
                    $scope.discountAmount=  data[0].DiscountAmount;
                    $scope.totalTaxAmount= data[0].TaxAmount;
                    $scope.totalChargeAmount=  data[0].TotalAmount;
                    $scope.BillStatus=  data[0].BillStatus;
                    $scope.DateTime = data[0].DateTime;
                    console.log("Date Time is : ",data[0].DateTime);
                    //PaymentMethod:  data[0].PaymentMethod,
                    //TotalItems:  data[0].TotalItems,
                    //BillStatus:  data[0].BillStatus
                })
     
    }


$scope.ReprintBill = function(BillNo)
{
    console.log("Reprint Bill");

    if($scope.BillStatus == "Cancelled")
    {
        console.log("Reprinting cancelled bill not permitted");
        $rootScope.ShowToast("Cannot print Cancelled Bill",false);
        return;
    }

    var billSummary={};
    // var d = new Date();

      //var transactionDate = (new Date()).getTime();

      //console.log("Trans date: ", transactionDate);

     console.log("scope: ", $scope.DateTime);
     //console.log(d);
     billSummary.totalPrice= $scope.totalPrice;
     billSummary.discountAmount=  $scope.discountAmount;
     billSummary.totalTaxAmount= $scope.totalTaxAmount;
     billSummary.totalChargeAmount=  $scope.totalChargeAmount;
     billSummary.BillStatus=  $scope.BillStatus;
     billSummary.DateTime = new Date(parseInt($scope.DateTime));

     console.log(billSummary);

     var billdetails = $scope.productArr;

     console.log(billdetails);

     $rootScope.print(billSummary,billdetails,$scope.ReprintComplete,$scope.ReprintError,0,BillNo);

}

$scope.ReprintComplete = function()
{
console.log("Reprint Complete");

}

$scope.ReprintError = function()
{
console.log("Reprint Error");
}


$scope.CancelBill=function(BillNo)
{
    if($scope.BillStatus == "Cancelled")
    {
        console.log("Bill already cancelled");
        $rootScope.ShowToast("Bill Already Cancelled",false);
        return;
    }
    console.log("Cancel Bill");
    //(billNo,BillDateTime,status)
    var promise = dbService.SetBillStatus(BillNo,$scope.DateTime,"Cancelled");

       promise.then(function(data) {
                     console.log(data);

                    if (data.rowsAffected >= 1) {
                    console.log("Cancel Bill Success: ");
                    $rootScope.ShowToast("Bill Cancelled");
                    return;
                    }

                    
                },function(err)
                {
                    console.log("Unable to Cancel Bill: ", err);
                    $rootScope.ShowToast("Unable to Cancel Bill");


                })

}

  
})

.controller('passwordSettings', function($scope,$rootScope,settingService) {

    
    console.log("Change Password");
    $scope.password = {};

     $scope.password.oldPassw="";
     $scope.password.newPassw="";
     $scope.password.repeatNewPassw="";

$scope.ChangePassword = function(oldpassword,newpassword,repeatpassword)
{


if(oldpassword==undefined||oldpassword=="")
{
  console.log('Enter Old Password');
  $rootScope.ShowToast("Please Enter Old Password",false);
  return;
}

if(newpassword==undefined||newpassword==""){
  console.log('Enter New Password');
  $rootScope.ShowToast("Please Enter New Password",false);
  return;
}
else if(newpassword.length<3)
{
  console.log("New Password Length should be greater then 3 char");
  $rootScope.ShowToast("New Password Length should be greater then 3 char",false);
  return;
}

if(repeatpassword==undefined||repeatpassword=="")
{
   console.log('Enter Repeat New  Password');
   $rootScope.ShowToast("Please Confirm New  Password",false);
  return;

}else if(repeatpassword.length<3){
     $rootScope.ShowToast("Confirm Password Length should be greater then 3 char",false);
    return;
}


  if(newpassword !=repeatpassword)
    {
        console.log("new and repeat password different");
         $rootScope.ShowToast("New Password and Confirm Password doesnt match",false);
         return;
    }



   if(oldpassword != $rootScope.password)// && ))
    {
        if(oldpassword != $rootScope.masterPassword)
         {
      console.log("Invalid Old Password");
      $rootScope.ShowToast("Wrong Old Password",false);
      return;
         }
    }

  

    var promise = settingService.set("PasswordSettings", newpassword);
        promise.then(function(data) {
            if (data.rowsAffected >= 1) {
                console.log("Password Change Success");
                $rootScope.ShowToast("Password Updated",false);
                $rootScope.password = newpassword;
            } else {
                
                console.log("Password Change Failed");
                $rootScope.ShowToast("Unable to Password",false);
            }
        },function(err)
        {
            console.log("Password Change Failed: ", err);
            $rootScope.ShowToast("Unable to Password",false);
        })



}
     

})


.controller('reportSettings', function($scope,$rootScope,settingService) {
    $scope.reportObj = {}
    $scope.reportObj.storeCloud=$rootScope.Reports.storeCloud;
    $scope.reportObj.sendEmail=$rootScope.Reports.sendEmail;
    $scope.reportObj.emailAddress=$rootScope.Reports.emailAddress;
    $scope.reportObj.sendSMS=$rootScope.Reports.sendSMS;
    $scope.reportObj.smsLowStock=$rootScope.Reports.smsLowStock;
    $scope.reportObj.smsDailyCollection=$rootScope.Reports.smsDailyCollection;
    $scope.reportObj.smsPhoneNo=$rootScope.Reports.smsPhoneNo;
    
    console.log($scope.reportObj)
    $scope.saveReports = function() {
        var sendEmailReport=$scope.reportObj.sendEmail;
        var sendEmail=$scope.reportObj.emailAddress;
        if(sendEmailReport==true){
         if(sendEmail==undefined || sendEmail.length<=2){
             $rootScope.ShowToast("Enter Email ID", false);
             console.log('Enter Email ID')
             return false
         }
        }
        var sendSMSAlert= $scope.reportObj.sendSMS;
        var phNo=$scope.reportObj.smsPhoneNo;
        if(sendSMSAlert==true){
         if(phNo==undefined || phNo<7){
           $rootScope.ShowToast("Enter Phone Number or Valid Phone Number", false);
             console.log('Enter Phone Number or Valid Phone Number');
             return false  
         }else if(!phNo.match('^[0-9\+\]+$')){
            $rootScope.ShowToast("Enter Valid Phone Number", false);
             console.log('Enter Valid Phone Number')
             return false   
         }
        }
         var reportsObj = JSON.stringify($scope.reportObj);
        var promise = settingService.set("Reports", reportsObj);
        promise.then(function(data) {
            console.log(data.rows.length);
            console.log(data)
            if (data.rowsAffected >= 1) {
                var promise = settingService.get("Reports", reportsObj);
                promise.then(function(data) {
                    $rootScope.Reports = JSON.parse(data.rows[0].item(0).SettingsValue);
                    console.log($rootScope.Reports)
                })
            } else {
                console.log('No PayMent Setting Record Found');
                var currency = $rootScope.PaymentSettings.currency.split(' ');
                var currencyName = currency[0];
                var currencySymbol = currency[1];
                $rootScope.currencySymbol = currencySymbol;
            }
        })
        console.log($scope.reportObj)
    }
});