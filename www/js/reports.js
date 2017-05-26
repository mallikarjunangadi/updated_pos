angular.module('starter.reportscontroller', [])

.controller('billwiseReportCtrl', function($scope, salesService, $rootScope,$cordovaFile) {

    /*
BTPrinter.list(function(data){
        console.log("Success");
        console.log(data); //list of printer in data array
    },function(err){
        console.log("Error");
        console.log(err);
    })
*/

    $scope.Dte = {}
    $scope.salesReport = []
    $scope.totalAmount = {
        avgBillAmount: 0,
        taxAmount: 0,
        billAmt: 0,
        amountAftertax: 0
    };

    $scope.save = function() {

        var stDate;
        var edDate;
        var startDate = $scope.Dte.start;
        //console.log(startDate);
        var endDate = $scope.Dte.end;

        if (endDate < startDate) {
            console.log("Invalid Date Selected");
            $rootScope.ShowToast("Please select valid Date", false);
            return;
        }

        if (startDate == undefined && endDate == undefined) //no date entered;;
        {
            console.log("start and End Date undefined");
            startDate = new Date();
            $scope.Dte.start = startDate;
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate = new Date();
            $scope.Dte.end = endDate;
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            //return;

        } else if (startDate == undefined || endDate == undefined) {
            console.log('Select Start and End Date');
            $rootScope.ShowToast("Select Start and End Date", false);
            return false
        }
        else {
            startDate = $scope.Dte.start;
            endDate = $scope.Dte.end;

            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            // return;

        }

        var promise = salesService.getBillWiseReport(stDate, edDate);
        promise.then(function(data) {
            $scope.totalAmount.taxAmount = 0;
             $scope.totalAmount.billAmt=0;
              $scope.totalAmount.amountAftertax=0;
              $scope.totalAmount.avgBillAmount=0;
            console.log("Got Data");
             if(data.length >0)
              $scope.showreport = true;

            console.log(data)
            $scope.salesReport = data;
            for (var i = 0; i < $scope.salesReport.length; i++) {
                // $scope.totalAmount.avgBillAmount=($scope.salesReport[i].billAmt+$scope.totalAmount.avgBillAmount)/$scope.salesReport.length 
                $scope.totalAmount.taxAmount = $scope.salesReport[i].taxAmount + $scope.totalAmount.taxAmount
                $scope.totalAmount.billAmt = $scope.salesReport[i].billAmt + $scope.totalAmount.billAmt
                $scope.totalAmount.amountAftertax = $scope.salesReport[i].amountAftertax + $scope.totalAmount.amountAftertax
                
            }
            if($scope.salesReport.length > 0)
            $scope.totalAmount.avgBillAmount = $scope.totalAmount.billAmt / $scope.salesReport.length
        })
    }

    $scope.saveReport = function()
    {
        $scope.saveBillWiseReport($scope.Dte.start,$scope.Dte.end);
    }

$scope.saveBillWiseReport=function(frmDate,toDate){
 
// print the PDF
// download the PDF
var d=new Date();
var date=d.toString().substring(4, 15);
var time=d.toString().substring(15, 25);   

frmDate = frmDate.toString().substring(4, 15);
toDate = toDate.toString().substring(4, 15);

var body=[]
var text=[]
body[0]=['Date','Time','Bill Status','Bill Number','Bill Amount','Tax Amount','Total Amount'];

//$scope.totalAmount.taxAmount = 0;
//$scope.totalAmount.billAmt=0;
//$scope.totalAmount.amountAftertax=0;
//$scope.totalAmount.avgBillAmount=0;

for (var i=0;i<$scope.salesReport.length;i++){
  console.log($scope.salesReport[i].billAmt);

// $scope.totalAmount.taxAmount=$scope.salesReport[i].taxAmount+$scope.totalAmount.taxAmount
//  $scope.totalAmount.billAmt=$scope.salesReport[i].billAmt+$scope.totalAmount.billAmt
// $scope.totalAmount.amountAftertax=$scope.salesReport[i].amountAftertax+$scope.totalAmount.amountAftertax
 

 body[i+1]=[$scope.salesReport[i].date,$scope.salesReport[i].time,$scope.salesReport[i].billStatus,$scope.salesReport[i].billNo,$scope.salesReport[i].billAmt,$scope.salesReport[i].taxAmount,$scope.salesReport[i].amountAftertax]
  //body[i+1]=[$scope.sales[i].date,$scope.sales[i].time,$scope.sales[i].billNo,$scope.sales[i].totalBills]
}
 //$scope.totalAmount.avgBillAmount=$scope.totalAmount.billAmt/$scope.salesReport.length
console.log(body[0])
console.log(body);
console.log($scope.totalAmount.billAmt);

var docDefinition = {
    
  content: [
  { text:'Bill Wise Report \n'+$rootScope.printFormatSettings.shopName+'\n\n',style: 'header' },
    { text:'Date:'+date +'\nTime:'+time+'\nFrom Date:'+frmDate+'\nTo Date:'+toDate+'\n\n\n',style: 'dateAlignment' },

    {
      layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '*', '*', '*', '*','*','*' ,'*'],

        body:body
       /* [
          [ 'First', 'Second', 'Third', 'The last one' ],
           [,$scope.sales.time,$scope.sales.billNo,$scope.sales.totalBills],
         [ $scope.sales[i].date, $scope.sales[i].time, $scope.sales[i].billNo, $scope.sales[i].totalBills ]
          [ 'First', 'Second', 'Third', 'The last one' ],
           [ 'First', 'Second', 'Third', 'The last one' ]        

        ]*/
        }
        },
        {
      text: 
        '\n\n Average Bill Amount:'+$scope.totalAmount.avgBillAmount+'\n'+
        'Total Tax Amount:'+$scope.totalAmount.taxAmount+'\n'+
        'Total Bill Amount:'+$scope.totalAmount.billAmt+'\n'+
        'Total Amount After Tax:'+$scope.totalAmount.amountAftertax
     
    }
      
    
  ],styles: {
    header: {
      fontSize: 17,
      bold: true,
      alignment: 'center'
    },
    dateAlignment:{
      fontSize:12,
      alignment: 'left'
    }
    
  }
    }
   

//pdfMake.createPdf(docDefinition).open();
//pdfMake.createPdf(docDefinition).download();

var fileName = "BillWiseReport-" + d.getTime() + ".pdf"; 

console.log("fileName : ", fileName);

var Path =cordova.file.externalRootDirectory;

console.log("path : ", Path);

const pdfDocGenerator = pdfMake.createPdf(docDefinition);

pdfDocGenerator.getBlob((buffer) => {
    console.log(buffer);
  $cordovaFile.writeFile(Path, fileName, buffer, true).then(function(result) {
      // Success! 
      console.log("File Success: ", result);
  }, function(err) {
      // An error occured. Show a message to the user
      console.log("File Write Failed: ", err);
  });
});


console.log("Download Done");
 
}
})


.controller('SalesReportCtrl', function($scope, salesService, $rootScope) {

    $scope.Dte = {}
    $scope.salesReport = []
    $scope.totalAmount = {
        avgBillAmount: 0,
        taxAmount: 0,
        billAmt: 0,
        amountAftertax: 0
    };

    $scope.save = function() {

        var stDate;
        var edDate;
        var startDate = $scope.Dte.start;
        //console.log(startDate);
        var endDate = $scope.Dte.end;

        if (endDate < startDate) {
            console.log("Invalid Date Selected");
            $rootScope.ShowToast("Please select valid Date", false);
            return;
        }

        if (startDate == undefined && endDate == undefined) //no date entered;;
        {
            console.log("start and End Date undefined");
            startDate = new Date();
            $scope.Dte.start = startDate;
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate = new Date();
            $scope.Dte.end = endDate;
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            //return;

        } else if (startDate == undefined || endDate == undefined) {
            console.log('Select Start and End Date');
            $rootScope.ShowToast("Select Start and End Date", false);
            return false
        }
        else {
            startDate = $scope.Dte.start;
            endDate = $scope.Dte.end;

            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            // return;

        }

        var promise = salesService.getSalesReport(stDate, edDate);
        promise.then(function(data) {
            
            console.log("Got Data");
             if(data.length >0)
              $scope.showreport = true;

              //totalPrice: result.rows.item(i).TotalPrice,
              //taxAmount: result.rows.item(i).TaxAmount,
              //totalAmount: result.rows.item(i).TotalAmount,

            console.log(data)
            $scope.salesReport = data[0];

           // if(data.length >0)
            // $scope.salesReport.totalBills = 10;

            //
     
        })
    }

    $scope.onPrintSalesReport = function()
    {

    $rootScope.PrintCollectionReport($scope.salesReport,$scope.Dte.start, $scope.Dte.end);

    }


   })


.controller('productReportCtrl', function($scope, salesService, $rootScope,$cordovaFile) {
   $scope.Dte = {}
    $scope.productReport = []
   

    $scope.save = function() {

        var stDate;
        var edDate;
        var startDate = $scope.Dte.start;
        //console.log(startDate);
        var endDate = $scope.Dte.end;

        if (endDate < startDate) {
            console.log("Invalid Date Selected");
            $rootScope.ShowToast("Please select valid Date", false);
            return;
        }

        if (startDate == undefined && endDate == undefined) //no date entered;;
        {
            console.log("start and End Date undefined");
            startDate = new Date();
            $scope.Dte.start = startDate;
             
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate = new Date();
            $scope.Dte.end = endDate;
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            //return;

        } else if (startDate == undefined || endDate == undefined) {
            console.log('Select Start and End Date');
            $rootScope.ShowToast("Select Start and End Date", false);
            return false
        } else {
            startDate = $scope.Dte.start;
            endDate = $scope.Dte.end;

            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            console.log(startDate);
            console.log(endDate);

            stDate = startDate.getTime();
            edDate = endDate.getTime();

            console.log(stDate);
            console.log(edDate);

            // return;

        }

        var promise = salesService.getItemWiseReport(stDate, edDate);
        promise.then(function(data) {
            //console.log(data.rows)
            $scope.productReport = data;

             if(data.length >0)
              $scope.showreport = true;
        })
    }

    $scope.saveReport = function()
    {
       $scope.saveItemWiseReport($scope.Dte.start, $scope.Dte.end);
    }

$scope.saveItemWiseReport=function(frmDate,toDate)
{
// print the PDF
// download the PDF
var d=new Date();
var date=d.toString().substring(4, 15);
var time=d.toString().substring(15, 25);  

frmDate = frmDate.toString().substring(4, 15);
toDate = toDate.toString().substring(4, 15);
 
var body=[]
var text=[]
body[0]=['Item Name','Quantity','Total Amount']
for (var i=0;i<$scope.productReport.length;i++){
  console.log($scope.productReport[i]);
 body[i+1]=[$scope.productReport[i].itemName,$scope.productReport[i].qtySold,$scope.productReport[i].totalAmount]
  //body[i+1]=[$scope.sales[i].date,$scope.sales[i].time,$scope.sales[i].billNo,$scope.sales[i].totalBills]
}
console.log(body[0])
console.log(body);
  var docDefinition = {
    
  content: [
  { text:'Item Wise Report \n'+$rootScope.printFormatSettings.shopName+'\n\n',style: 'header' },
    { text:'Date:'+date +'\nTime:'+time+'\nFrom Date:'+frmDate+'\nTo Date:'+toDate+'\n\n\n',style: 'dateAlignment' },

    {
      layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '*', '*', '*'],

        body:body
       /* [
          [ 'First', 'Second', 'Third', 'The last one' ],
           [,$scope.sales.time,$scope.sales.billNo,$scope.sales.totalBills],
         [ $scope.sales[i].date, $scope.sales[i].time, $scope.sales[i].billNo, $scope.sales[i].totalBills ]
          [ 'First', 'Second', 'Third', 'The last one' ],
           [ 'First', 'Second', 'Third', 'The last one' ]        

        ]*/
        }
        }
      
    
  ],styles: {
    header: {
      fontSize: 17,
      bold: true,
      alignment: 'center'
    },
    dateAlignment:{
      fontSize:12,
      alignment: 'left'
    }
    
  }
    }
   


var fileName = "ProductReport-" + d.getTime() + ".pdf"; 

console.log("fileName : ", fileName);

var Path =cordova.file.externalRootDirectory;

console.log("path : ", Path);

const pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.getBlob((buffer) => {
    console.log(buffer);
  $cordovaFile.writeFile(Path, fileName, buffer, true).then(function(result) {
      // Success! 
      console.log("File Success: ", result);
  }, function(err) {
      // An error occured. Show a message to the user
      console.log("File Write Failed: ", err);
  });
});


console.log("Download Done");
 
}
})