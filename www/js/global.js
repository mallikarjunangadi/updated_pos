angular.module('starter.globalcontroller', []).controller('global', function($q, $state, $rootScope, $scope, $cordovaSQLite, $state, $cordovaToast, $scope, $ionicSlideBoxDelegate, $ionicHistory, $ionicLoading, $timeout, $ionicPopup, settingService) {
    console.log('Hello hai');

    $rootScope.closeView = function() {

        $ionicHistory.goBack(-1);
    }

    $rootScope.nextSlide = function() {
        console.log("changing to next slide");
        $ionicSlideBoxDelegate.next();
    }
    ;

    $rootScope.runningTables = [];

    $rootScope.SingleTable = {
        TableId: 0,
        TableStatus: "Running",
        // Billed
        TotalBillAmount: 0,
        productArr: []

    }

    $rootScope.Mode = false;
    $rootScope.tableEditMode = false;
    $rootScope.SelCat = '0';
    $rootScope.SelSection = '0';
    $rootScope.CreateMode = 0;
    $rootScope.PrevSelCat = '0';
    $rootScope.CurrentProduct = {};
    $rootScope.totalAmountDiscount = 0;
    $rootScope.discType = 'Rs';
    $rootScope.disableEnableAdmin = false;
    $rootScope.disableEnableTableAdmin = false;
    //$rootScope.selShopDB = "newPayUPos1.db";

    $rootScope.password = "password123";
    $rootScope.masterPassword = "payupad123";
    $rootScope.printerName = "";
    $rootScope.PrinterStatus = false;
    $rootScope.selTable = {};
    

    //$rootScope.currentTable = [];

    $rootScope.reprintBillButtonEnable = 0;

    $rootScope.holdItemArr = [];

    $rootScope.PrintElement = {
        type: "",
        data: ""
    }

    $rootScope.PrintQueue = [];
    $rootScope.IsPrinting = false;

    $rootScope.VolatileData = {
        CurrentBillNo: 1,
        CurrentTokenNo: 1
    };

    $rootScope.printFormatSettings = {
        addressLine1: "",
        addressLine2: "",
        billCopies: 1,
        greeting: "",
        phNumber: null,
        shopName: "",
        strtBillNmbr: 1,
        tin: "",
        tokNum: "Disable",
        tokResetAftr: 999,
        tokStartNmbr: 1,
        wifiSsid: ""
    };

    $rootScope.BluetoothSettings = {
        PrinterName: ""
    }

    $rootScope.TaxSettings = [{
        id: 0,
        name: 'sampleTax',
        taxRate: 0.0
    }];

    $rootScope.Reports = {
        storeCloud: false,
        sendEmail: false,
        emailAddress: '',
        sendSMS: false,
        smsLowStock: false,
        smsDailyCollection: false,
        smsPhoneNo: ''
    };

    $rootScope.PaymentSettings = {
        CurrencyOptions: {
            id: 0,
            name: "Rupee",
            symbol: "₹",
        },
        PaymentMode: [{
            id: 1,
            name: "Cash",
            desc: "Cash Payment Mode"
        }]

    }

    $rootScope.getTableIndex = function(TableId) {

        var index = -1;
        //find table in table array;;
        for (var i = 0; i < $rootScope.runningTables.length; i++) {
            if (TableId == $rootScope.runningTables[i].TableId) {
                index = i;
                break;
            }
        }

        return ( index) ;
    }

    $rootScope.getTableStatus = function(Table) {
        if ($rootScope.getTableIndex(Table.tableId) > -1)
            return ( true) ;

        return ( false) ;

    }

    $rootScope.RemoveTable = function(table) {
        var index = -1;
        index = $rootScope.getTableIndex(table.tableId);
        console.log("found id: ", table.tableId);
        console.log("index is : ", index);
        if (index > -1) //table exists;;
        {
            table.seatedTime = 0;
            console.log("Table exists in Remove Table");
            $rootScope.runningTables.splice(index, 1);
        }

        $rootScope.selTable = {};
    }

    $rootScope.loadItemsToTable = function(table) {
        var index = $rootScope.getTableIndex(table.tableId);

        if (index == -1) //table doesnot exist;;
        {
            return ( []) ;
        }
        //else
        //{
        return ( $rootScope.runningTables[index].productArr) ;
        //}

        //return($rootScope.currentTable);

    }

    $rootScope.saveItemsToTable = function(table, items, billAmount) {
        var index = $rootScope.getTableIndex(table.tableId);

        if (index == -1) {
            //new table;;
            console.log("Table not found");
            var SingleTable = {
                TableId: table.tableId,
                TableStatus: "Running",
                // Billed
                TotalBillAmount: billAmount,
                productArr: items

            }

            $rootScope.runningTables.push(SingleTable);
            //console.log("Seated Time: ", table.seatedTime);

            table.seatedTime = new Date().getTime();
            console.log("Seated Time: ", table.seatedTime);
            //save to localStorage here;;

        } else {
            console.log("Table Exists");
            $rootScope.runningTables[index].productArr = items.slice();
            //save to localStorage here;;
        }

    }

    $rootScope.ShowPopUpPassword = function() {
        $rootScope.disableEnableAdmin = true;
        console.log("now mode is");
        console.log($rootScope.Mode);

        //$rootScope.Testing();
        //return;

        if ($rootScope.Mode == false) //already in admin mode;;
        {
            console.log('entered false ');
            $rootScope.disableEnableAdmin = false;
            $rootScope.OnModeChangeClick();
            return;
        }
        $scope.result = {};
        $scope.result.done = false;
        $scope.result.text = "";
        $ionicPopup.prompt({
            template: '<input type="password" ng-model="result.text">',
            title: 'Password Check',
            subTitle: 'Enter admin password',
            inputType: 'password',
            inputPlaceholder: 'Your password',
            scope: $scope,

            buttons: [{
                text: 'Cancel',
                onTap: function(e) {
                    $rootScope.disableEnableAdmin = false;
                    return $scope.result;
                }
            }, {
                text: '<b>OK</b>',
                type: 'button-positive',
                onTap: function(e) {
                    $rootScope.disableEnableAdmin = false;
                    $scope.result.done = true;
                    return $scope.result;
                }
            }]
        }).then(function(res) {
            console.log('Your password is', res);
            if (res.done == true) {
                if(res.text=='payupad123' || res.text==$rootScope.password) {
                    $rootScope.OnModeChangeClick();
                     $rootScope.Mode = true;
                }
                else
                 {
                 console.log("Wrong Password");
                 $rootScope.ShowToast("Wrong Password",false);
                 $rootScope.Mode = false;
                 }
            } else {
                $rootScope.Mode = false;
            }

        });

    }

    $rootScope.OnModeChangeClick = function() {
        console.log("Toggle Clicked");
        //$rootScope.$broadcast('ModeChangeEvent',$rootScope.Mode);
        /* if($rootScope.Mode == 0)
       $rootScope.Mode =1;
     else
     $rootScope.Mode =0;
     console.log($rootScope.Mode);

     if($rootScope.Mode == 1)//edit Mode;;
     {
       

     }*/

    }

    $rootScope.ShowTablePopUpPassword = function() {
        console.log("now table mode is");
        console.log($rootScope.tableEditMode);
        $rootScope.disableEnableTableAdmin = true;

        //$rootScope.Testing();
        //return;

        if ($rootScope.tableEditMode == false) //already in table edit mode;
        {
            $rootScope.disableEnableTableAdmin = false;
            //  $rootScope.OnTableModeChangeClick();
            return;

        }
        $scope.tableResult = {};
        $scope.tableResult.done = false;
        $scope.tableResult.text = "";
        $ionicPopup.prompt({
            template: '<input type="password" ng-model="tableResult.text">',
            title: 'Password Check',
            subTitle: 'Enter admin password',
            inputType: 'password',
            inputPlaceholder: 'Your password',
            scope: $scope,

            buttons: [{
                text: 'Cancel',
                onTap: function(e) {
                    $rootScope.disableEnableTableAdmin = false;
                    return $scope.tableResult;
                }
            }, {
                text: '<b>OK</b>',
                type: 'button-positive',
                onTap: function(e) {
                    $rootScope.disableEnableTableAdmin = false;
                    $scope.tableResult.done = true;
                    return $scope.tableResult;
                }
            }]
        }).then(function(res) {
            console.log('Your password is', res);
            if (res.done == true) {// if (res.text == 'payupad123' || res.text == $rootScope.password) {
            //   $rootScope.OnTableModeChangeClick();
            /* } else {
                    console.log("Wrong Password");
                    $rootScope.ShowToast("Wrong Password", false);
                    $rootScope.tableEditMode = false;
                }*/

            } else {
                $rootScope.tableEditMode = false;
            }

        });
    }
    /*
    $rootScope.OnTableModeChangeClick = function() {
        console.log("Table Toggle Clicked");

        //$rootScope.$broadcast('ModeChangeEvent',$rootScope.tableEditMode);
        if ($rootScope.tableEditMode == 0) {
            $rootScope.tableEditMode = 1;
        } else {
            $rootScope.tableEditMode = 0;
            console.log($rootScope.tableEditMode);
        }

        if ($rootScope.tableEditMode == 1) //edit Mode;;
        {}
        
    }
*/
    $rootScope.OnEditCategory = function(catId) {
        console.log("On Edit Category");
        $rootScope.CreateMode = 0;

        $rootScope.SelCat = catId;

        if ($rootScope.SelCat != 'favourite')
            $state.go('category');

    }

    $rootScope.OnEditSection = function(sectionId) {
        console.log("On Edit Section");
        $rootScope.CreateMode = 0;

        $rootScope.SelSection = sectionId;

        $state.go('addEditTableSection');

    }

    $rootScope.AddNewCat = function() {
        console.log("On Add Category");
        $rootScope.CreateMode = 1;
        $state.go('category');

    }

    $rootScope.AddNewTableSection = function() {
        console.log("On Add Section");
        $rootScope.CreateMode = 1;
        $state.go('addEditTableSection');

    }

    $rootScope.AddNewPro = function() {
        console.log("On Add Product");
        $rootScope.CreateMode = 1;
        $state.go('product');

    }

    $rootScope.AddNewTable = function() {
        console.log("On Add Product");
        $rootScope.CreateMode = 1;
        $state.go('addEditTableInfo');

    }

    $rootScope.EditPro = function() {
        console.log("On Edit Product");
        $rootScope.CreateMode = 0;
        $state.go('product');

    }

    $rootScope.showDbLoading = function() {
        console.log("ShowDBloading");
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><p>LOADING...</p>',
            duration: 3000,
            showDelay: 0
        }).then(function() {
            console.log("The loading indicator is now displayed");
        });
    }
    ;

    $rootScope.hideDbLoading = function() {
        $ionicLoading.hide().then(function() {
            console.log("The loading indicator is now hidden");
        });
    }
    ;

    $rootScope.ShowToast = function(message, longx) {
        if (window.cordova) {
            if (longx == true) {

                $cordovaToast.showLongCenter(message).then(function(success) {
                    // success
                    console.log("Toast Success");
                }, function(error) {
                    // error
                    console.log("Toast Failed");
                });
            } else {
                $cordovaToast.showShortCenter(message).then(function(success) {
                    // success
                    console.log("Toast Success");
                }, function(error) {
                    // error
                    console.log("Toast Failed");
                });

            }
        }

    }

    //print functions;;

    $rootScope.InitPrinter = function() {

        BTPrinter.BTStateDisconnect(function(data) {
            console.log("printer Disconnection Notification");
            $rootScope.ShowToast("printer Disconnection Notification", false);
            $rootScope.PrinterStatus = false;
        }, function(err) {
            console.log("error Disconnection");
        })

    }

    $rootScope.printerDisconnect = function(PrinterName, callbackFunc) {

        function loadNext() {
            BTPrinter.disconnect(function(data) {
                console.log("Success");
                console.log(data);
                $rootScope.hideDbLoading();
                callbackFunc(true);
            }, function(err) {
                console.log("Error");
                console.log(err);
                $rootScope.hideDbLoading();
                callbackFunc(false);
            }, PrinterName)
        }

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><p>LOADING...</p>'// duration: 15000
        }).then(function() {
            console.log("The loading indicator is now displayed 123");
            setTimeout(loadNext, 1000);

        });

    }

    /*
$rootScope.connectCallBack= function(status,PrinterName)
{
    if(status == true)
    {
        console.log("Connected to Printer: ", PrinterName);
        $rootScope.ShowToast("Connected to Printer: " + PrinterName,false);
        $rootScope.PrinterStatus = true;
    }
    else
    {
        console.log("Failed to Connect Printer: ", PrinterName);
        $rootScope.ShowToast("Failed to Connect Printer: " + PrinterName,false);
        $rootScope.PrinterStatus = false;

    }
}*/

    $rootScope.printerConnect = function(name, callbackFunc) {
        console.log("Printer Connect");
        // $rootScope.showDbLoading();

        function loadNext() {
            console.log("timeout");
            BTPrinter.connect(function(data) {
                console.log("Success");
                console.log(data);
                $rootScope.hideDbLoading();
                callbackFunc(true, name);
            }, function(err) {
                console.log("Error");
                $rootScope.hideDbLoading();
                //$rootScope.ShowToast("Failed to Connect");
                console.log(err);
                callbackFunc(false, name);
            }, name)
        }

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><p>LOADING...</p>'// duration: 15000
        }).then(function() {
            console.log("The loading indicator is now displayed 123");
            setTimeout(loadNext, 1000);

        });

    }

    $rootScope.getPairedList = function(callbackFunc) {
        function loadNext() {

            BTPrinter.list(function(data) {
                console.log("Success");
                console.log(data);
                //list of printer in data array
                $rootScope.hideDbLoading();
                callbackFunc(data, true);

            }, function(err) {
                console.log("Error");
                console.log(err);
                $rootScope.hideDbLoading();
                callbackFuncdata({}, false);
            })

        }

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><p>LOADING...</p>'// duration: 15000
        }).then(function() {
            console.log("The loading indicator is now displayed 123");
            setTimeout(loadNext, 1000);

        });
    }

    $rootScope.Testing = function() {
        $rootScope.PrintInit();
        $rootScope.PrintEnableUnderline(true);
        $rootScope.PrintEnableBold(true);
        $rootScope.PrintAlign("center");
        $rootScope.PrintChangeBigFont("both");
        $rootScope.PrintText("Super Shop\n\n");
        $rootScope.PrintEnableUnderline(false);
        $rootScope.PrintChangeBigFont("normal");
        $rootScope.PrintAlign("left");
        $rootScope.PrintText("sample without Underline\n");
        $rootScope.PrintEnableBold(false);
        $rootScope.PrintText("sample without bold\n");
        $rootScope.EndPrint($rootScope.testSuccess, $rootScope.testError);
    }

    $rootScope.testSuccess = function() {
        console.log("Success Success");
    }

    $rootScope.testError = function() {
        console.log("Error Error called back");
    }

    $rootScope.PrintInit = function() {
        $rootScope.PrintQueue = [];
        $rootScope.IsPrinting = false;
    }

    $rootScope.EndPrint = function(SuccessCallBack, ErrorCallBack) {
        var Element = {
            type: "PRINTEND",
            successfunc: SuccessCallBack,
            errorfunc: ErrorCallBack
        }
        $rootScope.PrintQueue.push(Element);
    }

    $rootScope.PrintText = function(data) {
        $rootScope.PushToQueue("TEXT", data);
        $rootScope.StartPrintQueue();
    }

    $rootScope.PrintEnableBold = function(bold) {
        //allow : 1B 45 01
        //ban :   1B 45 00
        var data = "";
        if (bold == true)
            data = "1B 45 01";
        else
            data = "1B 45 00";
        $rootScope.PushToQueue("POS", data);

    }

    $rootScope.PrintChangeFont = function(large) {
        //allow : 1B 45 01
        //ban :   1B 45 00
        var data = "";
        if (large == true)
            data = "1B 4D 00";
        else
            data = "1B 4D 01";
        $rootScope.PushToQueue("POS", data);

    }

    $rootScope.PushToQueue = function(type, data) {
        var Element = {
            type: type,
            data: data

        }

        $rootScope.PrintQueue.push(Element);
        console.log($rootScope.PrintQueue);
        //initiate print if queue was empty;;

    }

    $rootScope.GetFromQueue = function() {
        var item = [];
        if ($rootScope.PrintQueue.length > 0)
            item = $rootScope.PrintQueue.splice(0, 1);

        console.log("spliced item: ", item[0]);
        return ( item[0]) ;
    }

    $rootScope.PrintEnableUnderline = function(underline) {
        //allow : 1C 2D 01
        //ban :   1C 2D 00

        var data = "";
        if (underline == true)
            data = "1C 2D 01";
        else
            data = "1C 2D 00";
        $rootScope.PushToQueue("POS", data);

    }

    $rootScope.PrintChangeBigFont = function(fontSize) {
        //potrait zoom: 1D 21 01
        //hori zoom: 1D 21 10
        //overall zoom: 1D 21 11
        //Remove Zoom : 1D 21 00
        var data = "";
        if (fontSize == "vertical")
            data = "1D 21 01";
        else if (fontSize == "horizontal")
            data = "1D 21 10";
        else if (fontSize == "both")
            data = "1D 21 11";
        else
            data = "1D 21 00";
        //normal;;

        $rootScope.PushToQueue("POS", data);

    }

    $rootScope.PrintTab = function() {
        var data = "09";
        $rootScope.PushToQueue("POS", data);
    }

    $rootScope.PrintAlign = function(side) {
        //left, right, center;;

        //left: 1B 61 00
        //center: 1B 61 01
        //right: 1B 61 02

        //page feed: OC

        //Init: 1B 40
        //newline: 0A
        //horizon tab : 09
        //detect model : 1B 2B

        var data = "";
        if (side == "right")
            data = "1B 61 02";
        else if (side == "center")
            data = "1B 61 01";
        else
            data = "1B 61 00";
        //left

        $rootScope.PushToQueue("POS", data);

    }

    $rootScope.ConnectStatusFunc = function(status, name) {
        if (status == false) {
            console.log("Connection Failed to Printer: ", name);
            $rootScope.ShowToast("Connection Failed to Printer: " + name, false);
            $rootScope.PrinterStatus = false;
            $rootScope.OnPrintError("Connect Failed");
        } else {
            $rootScope.ShowToast("Connected to Printer: " + name, false);
            console.log("Connected to Printer: ", name);
            $rootScope.IsPrinting = false;
            $rootScope.PrinterStatus = true;
            //if($scope.OnSuccessPairedList != undefined)
            //$rootScope.getPairedList($scope.OnSuccessPairedList);
            $rootScope.StartPrintQueue();

        }

    }

    $rootScope.OnPrintError = function(err) {
        console.log("Error Occured while printing");
        console.log(err);

        $rootScope.PrinterStatus = false;

        //try to reconnect to printer, by using alert box;;
        //if user presses cancel, go back to user's errorfunction;;

        if ($rootScope.printerName == "") //printer not configured;;
        {
            console.log("please Configure Printer");
            $rootScope.ShowToast("Please Configure Printer", true);
            //call callback here;;
            var CallbackFc = $rootScope.GetCallBackFuncs();
            if (CallbackFc != undefined)
                CallbackFc();
            return;
        }

        $ionicPopup.show({
            title: 'Printer Communication Failed',
            subTitle: 'Make Sure Printer is On and Press Reconnect Button when ready',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                onTap: function(e) {
                    return "cancel";
                }
            }, {
                text: '<b>Reconnect</b>',
                type: 'button-positive',
                onTap: function(e) {
                    return "Reconnect";
                }
            }]

        }).then(function(res) {
            if (res == "Reconnect") {
                console.log("printer Name is: ", $rootScope.printerName);
                $rootScope.printerConnect($rootScope.printerName, $rootScope.ConnectStatusFunc);
                return;

            } else {
                //callback;;
                var CallbackFc = $rootScope.GetCallBackFuncs();
                $rootScope.PrintInit();
                console.log("Will Call Callback Here");
                if (CallbackFc != undefined)
                    CallbackFc();
                else
                    console.log("callback is null");
                //$rootScope.ShowToast("Call back calling",false);
            }

        });

    }

    $rootScope.GetCallBackFuncs = function() {
        if ($rootScope.PrintQueue.length <= 0)
            return ( undefined) ;

        for (var i = 0; i < $rootScope.PrintQueue.length; i++) {
            var item = $rootScope.PrintQueue[i];
            if (item.type == "PRINTEND") {
                if (item.errorfunc != undefined)
                    return ( item.errorfunc) ;
                else
                    return ( undefined)
            }

        }

        return ( undefined) ;
    }

    $rootScope.StartPrintQueue = function() {

        console.log("print Queue: ", $rootScope.PrintQueue);

        if ($rootScope.IsPrinting == true)
            return;

        var item = $rootScope.GetFromQueue();
        console.log("item: ", item);
        if (item != undefined) {
            $rootScope.IsPrinting = true;

            if (item.type == "POS") {
                console.log("Printing POS Command");
                console.log(item);
                $rootScope.SendPosCommand(item.data, $rootScope.StartPrintQueue, $rootScope.OnPrintError);
            } else if (item.type == "PRINTEND") //end of print;;
            {
                //$rootScope.StartPrintQueue();
                $rootScope.SendPosCommand("0A", $rootScope.StartPrintQueue, $rootScope.OnPrintError);
                item.successfunc();
            } else {
                console.log("Printing Text");
                console.log(item);
                $rootScope.SendPrintCommand(item.data, $rootScope.StartPrintQueue, $rootScope.OnPrintError);
            }
        } else {
            $rootScope.IsPrinting = false;
            console.log("finished printing");
        }

    }

    $rootScope.SendPosCommand = function(cmd, callbackFunc, callbackError) {

        BTPrinter.printPOSCommand(function(data) {
            console.log("Success");
            console.log(data);
            $rootScope.IsPrinting = false;
            callbackFunc();
        }, function(err) {
            console.log("Error");
            console.log(err);
            //socket closed
            callbackError(err);
        }, cmd)

    }

    $rootScope.SendPrintCommand = function(text, callbackFunc, callbackError) {

        BTPrinter.printText(function(data) {
            console.log("Success");
            $rootScope.ShowToast("Print Success");
            console.log(data);
            $rootScope.IsPrinting = false;
            callbackFunc();
        }, function(err) {
            console.log("Error");
            $rootScope.ShowToast("Failed to Test Print");
            console.log(err)
            callbackError(err);
        }, text);

    }

    $rootScope.printKitchenReceipt = function(billdetails, tableNo, callbackfcSuccess, callbackfcFailure) {
        var d = new Date();
        var date = d.toString().substring(4, 15);
        var time = d.toString().substring(15, 25);
        $rootScope.PrintInit();
        console.log("In Kitchen Print");
        $rootScope.PrintChangeFont(true);
        //large font;;
        $rootScope.PrintAlign("center");

        var printerSettings = $rootScope.printFormatSettings;

        if (printerSettings.shopName != undefined && printerSettings.shopName != "") {
            console.log('I am in shop')
            $rootScope.PrintEnableUnderline(true);
            $rootScope.PrintEnableBold(true);
            $rootScope.PrintChangeBigFont("vertical");

            $rootScope.PrintText(printerSettings.shopName + "\n");
        }

        $rootScope.PrintEnableUnderline(false);
        $rootScope.PrintEnableBold(false);
        $rootScope.PrintChangeBigFont("normal");
        $rootScope.PrintAlign("left");
        $rootScope.PrintText(date);
        $rootScope.PrintText("          " + time + "\n");

        $rootScope.PrintAlign("center");
        $rootScope.PrintText("Table No: " + tableNo.toString() + "\n");

        // padding left
        function padRight(s, paddingChar, length) {

            //var s = new String(this);
            var ln = s.length;

            if ((s.length < length) && (paddingChar.toString().length > 0)) {
                for (var i = 0; i < (length - ln); i++)
                    s = s.concat(paddingChar.toString().charAt(0));
            }

            return s;
        }
        ;function padLeft(s, paddingChar, length) {

            //var s = new String(this);
            var ln = s.length;

            if ((s.length < length) && (paddingChar.toString().length > 0)) {
                for (var i = 0; i < (length - ln); i++)
                    s = paddingChar.toString().charAt(0).concat(s);
            }

            return s;
        }
        ;$rootScope.PrintAlign("left");
        $rootScope.PrintChangeFont(false);
        //small font;;
        $rootScope.PrintEnableBold(true);

        $rootScope.PrintText("-----------------------------------------\n");

        $rootScope.PrintAlign("left");

        $rootScope.PrintChangeBigFont("vertical");

        var itemHeader = "item";

        itemHeader = padRight(itemHeader, " ", 25);

        console.log("itemHeader:", itemHeader.length);

        var qtyHeader = "Qty";
        qtyHeader = padLeft(qtyHeader, " ", 8);

        $rootScope.PrintText(itemHeader + "  " + qtyHeader + "\n");

        $rootScope.PrintText("-----------------------------------------\n");

        $rootScope.PrintEnableBold(false);

        for (var i = 0; i < billdetails.length; i++) {
            var proName = billdetails[i].name;
            if (proName.length > 24)
                proName = proName.substring(0, 24);
            proName = padRight(proName, " ", 25);

            console.log("Name:", proName.length);

            var Qty = billdetails[i].quantity.toString();

            Qty = padLeft(Qty, " ", 8);

            console.log("Qty:", Qty.length);

            $rootScope.PrintText(proName + "  " + Qty + "\n");
        }

        // $rootScope.PrintText("\n");

        $rootScope.PrintText("-----------------------------------------\n\n");

        $rootScope.EndPrint(callbackfcSuccess, callbackfcFailure);
    }

    $rootScope.print = function(billSummary, billdetails, callbackfcSuccess, callbackfcFailure, tokenNo, billNo) {
        var d = new Date();

        var date = billSummary.DateTime.toString().substring(4, 15);
        var time = billSummary.DateTime.toString().substring(15, 25);

        console.log(date);
        console.log(time);

        console.log($rootScope.printFormatSettings);
        var printerSettings = $rootScope.printFormatSettings;
        $rootScope.PrintInit();

        $rootScope.PrintChangeFont(true);
        //large font;;
        $rootScope.PrintAlign("center");

        console.log(printerSettings.shopName + printerSettings.addressLine1)
        if (printerSettings.shopName != undefined && printerSettings.shopName != "") {
            console.log('I am in shop')
            $rootScope.PrintEnableUnderline(true);
            $rootScope.PrintEnableBold(true);
            $rootScope.PrintChangeBigFont("vertical");

            $rootScope.PrintText(printerSettings.shopName + "\n");
        }

        $rootScope.PrintEnableUnderline(false);
        $rootScope.PrintEnableBold(false);
        $rootScope.PrintChangeBigFont("normal");

        if (printerSettings.addressLine1 != undefined && printerSettings.addressLine1 != "") {
            console.log('I am in addressline')

            $rootScope.PrintText(printerSettings.addressLine1 + "\n");

        }

        if (printerSettings.addressLine2 != undefined && printerSettings.addressLine2 != "") {

            $rootScope.PrintText(printerSettings.addressLine2 + "\n");

        }

        if (printerSettings.phNumber != undefined && printerSettings.phNumber != "") {
            console.log('I am in PhNumber');
            $rootScope.PrintText("ph: " + printerSettings.phNumber + "\n");
        }

        $rootScope.PrintText("\n");

        $rootScope.PrintAlign("right");

        if (billNo != undefined) {
            $rootScope.PrintText("BillNo:" + billNo + "\n");
        }

        $rootScope.PrintAlign("left");

        if (printerSettings.tin != undefined && printerSettings.tin != "") {
            $rootScope.PrintText("Tin:" + printerSettings.tin + "\n");

        }

        //$rootScope.PrintAlign("left");
        $rootScope.PrintText(date);

        // padding left
        function padRight(s, paddingChar, length) {

            //var s = new String(this);
            var ln = s.length;

            if ((s.length < length) && (paddingChar.toString().length > 0)) {
                for (var i = 0; i < (length - ln); i++)
                    s = s.concat(paddingChar.toString().charAt(0));
            }

            return s;
        }
        ;function padLeft(s, paddingChar, length) {

            //var s = new String(this);
            var ln = s.length;

            if ((s.length < length) && (paddingChar.toString().length > 0)) {
                for (var i = 0; i < (length - ln); i++)
                    s = paddingChar.toString().charAt(0).concat(s);
            }

            return s;
        }
        ;//$rootScope.PrintAlign("right");

        $rootScope.PrintText("          " + time + "\n");

        $rootScope.PrintChangeFont(false);
        //small font;;
        $rootScope.PrintEnableBold(true);

        $rootScope.PrintText("-----------------------------------------\n");

        $rootScope.PrintAlign("left");

        $rootScope.PrintChangeBigFont("vertical");

        var itemHeader = "item";

        itemHeader = padRight(itemHeader, " ", 13);

        console.log("itemHeader:", itemHeader.length);

        var qtyHeader = "Qty";
        qtyHeader = padLeft(qtyHeader, " ", 8);

        var priceHeader = "Price";
        priceHeader = padLeft(priceHeader, " ", 7);

        var AmountHeader = "Amt";
        AmountHeader = padLeft(AmountHeader, " ", 8);

        $rootScope.PrintText(itemHeader + "  " + qtyHeader + "  " + priceHeader + "  " + AmountHeader + "\n");

        $rootScope.PrintText("-----------------------------------------\n");

        $rootScope.PrintEnableBold(false);

        //$rootScope.PrintAlign("left");

        for (var i = 0; i < billdetails.length; i++) {
            var proName = billdetails[i].name;
            if (proName.length > 13)
                proName = proName.substring(0, 13);
            proName = padRight(proName, " ", 13);

            console.log("Name:", proName.length);

            var Qty = billdetails[i].quantity.toString();

            Qty = padLeft(Qty, " ", 8);

            console.log("Qty:", Qty.length);

            var price1 = parseFloat(billdetails[i].productPrice).toFixed(2);
            var Price = price1.toString();

            Price = padLeft(Price, " ", 7);

            console.log("Price:", Price.length);

            var Amount1 = parseFloat(billdetails[i].productTotalPrice).toFixed(2);
            var Amount = Amount1.toString();

            Amount = padLeft(Amount, " ", 8);
            console.log("Amount:", Amount.length);

            //$rootScope.PrintText($scope.productArr[i].name + "\t");
            //$rootScope.PrintAlign("center");
            //$rootScope.PrintText($scope.productArr[i].quantity + "\t");
            //$rootScope.PrintAlign("right");
            //var test = proName + Qty + Price;
            //console.log("value is: ",test);
            $rootScope.PrintText(proName + "  " + Qty + "  " + Price + "  " + Amount + "\n");
        }

        // $rootScope.PrintText("\n");

        $rootScope.PrintText("-----------------------------------------\n");

        $rootScope.PrintAlign("right");

        $rootScope.PrintChangeFont(true);
        //large font;;
        $rootScope.PrintChangeBigFont("none");

        $rootScope.PrintEnableBold(true);
        $rootScope.PrintText("Total:");
        $rootScope.PrintEnableBold(false);
        $rootScope.PrintText(billSummary.totalPrice + "\n");
        $rootScope.PrintEnableBold(true);
        $rootScope.PrintText("Total Tax:");
        $rootScope.PrintEnableBold(false);
        $rootScope.PrintText(billSummary.totalTaxAmount + "\n");

        if (billSummary.discountAmount != undefined && billSummary.discountAmount > 0) {
            $rootScope.PrintEnableBold(true);
            $rootScope.PrintText("Discount:");
            $rootScope.PrintEnableBold(false);
            $rootScope.PrintText(billSummary.discountAmount + "\n");
        }

        $rootScope.PrintEnableBold(true);
        $rootScope.PrintText("Total Amount:");
        $rootScope.PrintEnableBold(false);
        $rootScope.PrintText(billSummary.totalChargeAmount + "\n");
        $rootScope.PrintChangeFont(false);
        $rootScope.PrintEnableBold(true);
        $rootScope.PrintText("-----------------------------------------\n");
        $rootScope.PrintChangeFont(true);
        $rootScope.PrintEnableBold(false);
        $rootScope.PrintAlign("center");
        if (printerSettings.greeting != undefined && printerSettings.greeting != "")
            $rootScope.PrintText(printerSettings.greeting);

        if (tokenNo != undefined && tokenNo > 0) {
            $rootScope.PrintText("Token No: " + tokenNo + "\n");
        }

        $rootScope.PrintText("\n\n");

        $rootScope.EndPrint(callbackfcSuccess, callbackfcFailure);
    }

    $rootScope.PrintCollectionReport = function(collectionObj, frmDate, toDate) {

        var d = new Date();

        var date = d.toString().substring(4, 15);
        var time = d.toString().substring(15, 25);

        console.log(date);
        console.log(time);

        var printerSettings = $rootScope.printFormatSettings;
        $rootScope.PrintInit();

        $rootScope.PrintChangeFont(true);
        //large font;;
        $rootScope.PrintAlign("center");

        if (printerSettings.shopName != undefined && printerSettings.shopName != "") {
            console.log('I am in shop')
            $rootScope.PrintEnableUnderline(true);
            $rootScope.PrintEnableBold(true);
            $rootScope.PrintChangeBigFont("vertical");
            $rootScope.PrintText(printerSettings.shopName + "\n");
        }

        $rootScope.PrintText("Sales Report" + "\n\n");
        $rootScope.PrintChangeBigFont("normal");
        $rootScope.PrintAlign("left");
        $rootScope.PrintEnableUnderline(false);
        $rootScope.PrintEnableBold(true);

        $rootScope.PrintText("Date: " + date + "\n");

        $rootScope.PrintText("Time: " + time + "\n");

        $rootScope.PrintText("------------------------------\n");

        $rootScope.PrintText("FromDate: " + frmDate.toString().substring(4, 15) + "\n");
        $rootScope.PrintText("ToDate: " + toDate.toString().substring(4, 15) + "\n");

        $rootScope.PrintText("------------------------------\n");

        $rootScope.PrintText("Total Bills: " + collectionObj.totalBills + "\n");

        $rootScope.PrintText("Total Amount: " + collectionObj.totalPrice + "\n");

        $rootScope.PrintText("Tax Amount: " + collectionObj.taxAmount + "\n");

        $rootScope.PrintText("Total Amount inc Tax: " + collectionObj.totalAmount + "\n");

        $rootScope.PrintText("------------------------------\n\n");

        $rootScope.EndPrint(OnReportPrintSuccess, OnReportPrintFailure);

    }

    $rootScope.OnReportPrintSuccess = function() {
        console.log("Report Print Success");
        $rootScope.ShowToast("Report Print Done", false);

    }

    $rootScope.OnReportPrintFailure = function() {
        console.log("Report Print Failed");
        $rootScope.ShowToast("Report Print Failed", false);
    }

    //----------- timer logic --------------------

    /* $rootScope.counter = 0;
    var stopped = true;

    //$scope.buttonText='Stop';
    var onTimeout = function() {
        $rootScope.counter++;
        mytimeout = $timeout(onTimeout, 1000);
    }

    var mytimeout; 

    $rootScope.startTimer = function() {
        mytimeout = $timeout(onTimeout, 1000);
        console.log('start timer');
    }

    $rootScope.stopTimer = function() {
        $timeout.cancel(mytimeout);
        console.log('stop timer');
    }*/

    //---------------------------------------------------


    $rootScope.openDb = function(dbName, tempName) {

        if (window.cordova) {
            $rootScope.db = $cordovaSQLite.openDB({
                name: dbName,
                location: 'default'
            });
            //device
            console.log("Android");
        } else {
            $rootScope.db = window.openDatabase(dbName, '1', tempName, 1024 * 1024 * 100);
            // browser 
            console.log("browser");
        }


        // $cordovaSQLite.execute($rootScope.db, "DROP TABLE TransactionDetails ").then(console.log('Transaction table droped Successfully')); 
        // $cordovaSQLite.execute($rootScope.db, "DROP TABLE BillDetails").then(console.log('TableInfo table droped Successfully')); 

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Category (CategoryId integer primary key AUTOINCREMENT, CategoryName text, CategoryDesc text)").then(console.log('Category table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS Product (ProductId integer primary key AUTOINCREMENT, ProductName text, ProductUnit text, ProductPrice real, TaxId integer, BuyingPrice real, TaxRate real, ItemsinStock real, Discount real, CategoryId integer, CategoryName text, Image text, Favourite text)").then(console.log('Product table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS TransactionDetails (BillNo integer, DateTime text,DiscountAmount real, ProductId integer, ProductName text, Quantity real, ProductPrice real, TotalPrice real, TaxAmount real, TotalAmount real, Discount real, TaxRate real, TaxId integer, CategoryId integer, CategoryName text)").then(console.log('TransactionDetails table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS BillDetails (BillNo integer, TotalPrice real, DiscountAmount real, TaxAmount real, TotalAmount real, PaymentMethod text, DateTime text, TotalItems integer, BillStatus text)").then(console.log('BillDetails table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Settings (SettingsName text PRIMARY KEY ,SettingsValue TEXT)').then(console.log('Settings table created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS TableInfo (id integer primary key AUTOINCREMENT, TableNumber text, TableDescription text, TableSectionId integer, TableSectionName text, TableCharges real, TableCapacity integer)").then(console.log('TableInfo table edited and created Successfully'));
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS TableInfoSection (SectionId integer primary key AUTOINCREMENT, SectionName text, SectionDescription text)").then(console.log('TableInfoSection table created Successfully'));

        var promise = settingService.get("PrinterFormatSettings");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.printFormatSettings = JSON.parse(data.rows.item(0).SettingsValue);
                console.log(data.rows.item(0).SettingsValue);
            } else {
                console.log('No PrinterFormatSettings Record Found')
            }
        })
        var promise = settingService.get("TaxSettings");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.TaxSettings = JSON.parse(data.rows.item(0).SettingsValue);
            } else {
                console.log('No TaxSettings Record Found')
            }
        })

        var promise5 = settingService.get("bluetoothSettings");
        promise5.then(function(data) {
            console.log("bluetooth: ", data)
            if (data.rows.length >= 1) {
                //console.log("Bluetooth Settings: ",  data.rows.item(0));
                $rootScope.BluetoothSettings = JSON.parse(data.rows.item(0).SettingsValue);
                $rootScope.printerName = $rootScope.BluetoothSettings.PrinterName;
                $rootScope.InitPrinter();

                if ($rootScope.printerName != "") {
                    if ($rootScope.PrinterStatus == false)
                        $rootScope.printerConnect($rootScope.printerName, $rootScope.ConnectStatusFunc);
                } else {
                    $rootScope.ShowToast("Please Configure Printer");
                }

            } else {
                console.log('No bluetoothsettings Record Found');
                $rootScope.ShowToast("Please Configure Printer");
            }
        })

        var promise = settingService.get("PaymentSettings");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.PaymentSettings = JSON.parse(data.rows.item(0).SettingsValue);

            } else {
                console.log('No PayMent Setting Record Found')
            }
        })

        var promise = settingService.get("PasswordSettings");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.password = data.rows.item(0).SettingsValue;

            } else {
                console.log('No Password Setting Record Found');
            }
        })

        var promise = settingService.get("VolatileData");
        promise.then(function(data) {
            console.log(data)
            if (data.rows.length >= 1) {
                $rootScope.VolatileData = JSON.parse(data.rows.item(0).SettingsValue);
                console.log("volatile data is: ", $rootScope.VolatileData);
            } else {
                console.log('No Data Setting Record Found');
                $rootScope.VolatileData.CurrentBillNo = 1;
                $rootScope.VolatileData.CurrentTokenNo = $rootScope.printFormatSettings.tokStartNmbr;
            }
        })

        $state.go('home');
    }

})
