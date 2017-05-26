angular.module('starter.controller', []).controller('MyCtrl', function($scope, $rootScope, dbService) {
    $(function() {
        $('.click-to-jiggle').click(function(e) {
            $(this).toggleClass('jiggle');
            return false;
        });
    });
    $(function() {
        $('.click-to-jiggle').click(function(e) {
            $(this).toggleClass('jiggle');
            return false;
        });
    });

    $scope.tabs = {
        tab1: false,
        // initial state
        tab2: false,
        tab3: false,
        autocollapse: false
    };

    $scope.tabExpand = function(index) {
        console.log('Tab ' + index + ' expanded');
    }
    ;
    $scope.rest = function() {
        $rootScope.searchObj = {}
        $rootScope.searchedResults = [];
    }

    $scope.tabCollapse = function(index) {
        console.log('Tab ' + index + ' collapsed');

        // collapse all tabs
        if ($scope.tabs.autocollapse) {
            $scope.tabs.tab1 = false;
            $scope.tabs.tab2 = false;
            $scope.tabs.tab3 = false;
        }
    }
    ;

    $scope.toggleTab = function(tab) {
        console.log("togglingTab");
        $scope.tabs[tab] = !$scope.tabs[tab];
    }
    ;

}).controller('homeCtrl', ['$scope', '$rootScope', '$state', '$cordovaSQLite', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', 'dbService', '$ionicPlatform', '$ionicLoading', '$ionicPopup', 'settingService', function($scope, $rootScope, $state, $cordovaSQLite, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, dbService, $ionicPlatform, $ionicLoading, $ionicPopup, settingService) {

    /*
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        console.log('entered before enter view')
        loadProducts();
        loadCategory();
    });
*/

    $scope.tableNumberSelected = -1;

    //ionicParentView

    //load products list from DB

    $scope.OnCatClick = function(catId) {
        console.log(catId);
        $rootScope.SelCat = catId;

        //change background color;;
        // if($rootScope.PrevSelCat!='0')
        // document.getElementById($rootScope.PrevSelCat).style.backgroundColor='Black';

        //console.log("Setting Color.. Please Wait: ", catId);
        //document.getElementById(catId).style.backgroundColor='Red';
        //$rootScope.PrevSelCat = catId;
        //console.log("After Red");

        $scope.highlight = catId;

        $rootScope.showDbLoading();
        var promise = dbService.loadProductsForCategory(catId);
        promise.then(function(res) {
            $scope.Products = res;
            console.log(res);
            console.log('products loaded...');
            productSlideLogic();
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    $scope.placeOrder = function() {

        $ionicPopup.show({
            title: 'Print Receipt',
            subTitle: 'Print kitchen Receipt',
            scope: $scope,
            buttons: [{
                text: 'Close',
                onTap: function(e) {
                    return "cancel";
                }
            }, {
                text: '<b>Print</b>',
                type: 'button-positive',
                onTap: function(e) {
                    return "Print";
                }
            }, {
                text: '<b>Place</b>',
                type: 'button-positive',
                onTap: function(e) {
                    return "Save";
                }
            }]

        }).then(function(res) {

            if (res == 'cancel') {
                return;
            } else if (res == 'Print') {
                var proarry = [];

                for (var i = 0; i < $scope.productArr.length; i++) {
                    if ($scope.productArr[i].status == false) {
                        proarry.push($scope.productArr[i]);
                    }
                }

                if (proarry.length > 0)
                    //print receipt;;
                    $rootScope.printKitchenReceipt(proarry, $rootScope.selTable.tableId, onKitchenPrintSuccess, onKitchenPrintFailure);
                else
                    $rootScope.ShowToast("No Items to print", false);

            } else {
                $scope.saveItemsToTable($rootScope.selTable);
            }

        });

        //$scope.saveItemsToTable($rootScope.selTable);

        function onKitchenPrintSuccess() {
            $scope.saveItemsToTable($rootScope.selTable);

        }

        function onKitchenPrintFailure() {
            $rootScope.ShowToast("Failed to Print", false);
        }
    }

    $scope.saveItemsToTable = function(table) {
        //(table,items,billAmount)
        //print kitchen bill here;;

        for (var i = 0; i < $scope.productArr.length; i++) {
            $scope.productArr[i].status = true;
        }

        $rootScope.saveItemsToTable(table, $scope.productArr, $scope.totalChargeAmount);

        $scope.showPlaceButton = false;
        $scope.productArr = [];
        $rootScope.selTable = {};

        $scope.totalPrice = 0;
        $scope.totalTaxAmount = 0;
        $scope.discountAmount = 0;
        $scope.totalChargeAmount = 0;
        $scope.tableNumberSelected = -1;

    }

    $scope.$on("$ionicParentView.enter", function(event, data) {
        console.log('entered before enter parent view');
        // loadProducts();
        loadCategory();
        console.log($rootScope.selShopDB);
        //$scope.highlight = "1x";
        if ($rootScope.SelCat == '0') {
            $scope.OnCatClick("favourite")
            //$scope.highlight = "favourite";
        } else {
            $scope.OnCatClick($rootScope.SelCat)
            //$scope.highlight = $rootScope.SelCat;
        }

    });

    $scope.$on('tableSel', function(event, data) {
        console.log("Table Id ", $rootScope.selTable.tableId);

        if ($rootScope.selTable.tableId != undefined) {
            console.log("loading table items");
            $scope.productArr = $rootScope.loadItemsToTable($rootScope.selTable);
            calculateProductCost();
            $scope.tableNumberSelected = $rootScope.selTable.tableId;

            if ($scope.isPendingOrder() == true)
                $scope.showPlaceButton = true;
            else
                $scope.showPlaceButton = false;

        }

    });

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        loadTables();
        console.log("table loaded in tableinfocontrol +++++++++++++++++++++++++++++");

        loadSection();
        //$scope.highlight = "1x";
        //  if ($rootScope.SelSection != '0') {
        //       $scope.OnSectionClick($rootScope.SelSection)
        //$scope.highlight = $rootScope.SelCat;
        //  }
    });

    function loadSection() {

        $rootScope.showDbLoading();
        var promise = dbService.loadSectionFromDB('TableInfoSection');
        promise.then(function(res) {
            $scope.sectionArr = res;
            console.log($scope.sectionArr);
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    function loadTables() {
        $rootScope.showDbLoading();
        var promise = dbService.loadTablesFromDB('TableInfo');
        promise.then(function(res) {
            $scope.tables = res;
            //status and other details load here;;

            console.log('tables loaded...');
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    $ionicPlatform.ready(function() {//loadProducts();
    //loadCategory();

    //console.log("First Time");
    // $scope.OnCatClick('favourite');

    })

    $scope.Products = [];
    $scope.categoryArr = [];
    $scope.allSlideCatArr = [];
    $scope.allSlideProductArr = [];

    function loadProducts() {
        $rootScope.showDbLoading();
        var promise = dbService.loadProductFromDB('Product');
        promise.then(function(res) {
            $scope.Products = res;
            console.log('products loaded...');
            productSlideLogic();
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    function loadCategory(highlight) {
        $rootScope.showDbLoading();
        var promise = dbService.loadCategoryFromDB('Category');
        promise.then(function(res) {
            $scope.categoryArr = res;
            $rootScope.hideDbLoading();
            if (highlight != undefined)
                $scope.OnCatClick(highlight);
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    function productSlideLogic() {
        $scope.allSlideProductArr = [];
        var tempProductArr = [];
        console.log($scope.Products);
        for (var i = 0; i < $scope.Products.length; i++) {
            tempProductArr.push($scope.Products[i]);
            if (((i != 0) && (i % 11 == 0)) || (i == ($scope.Products.length - 1))) {
                $scope.allSlideProductArr.push(tempProductArr)
                tempProductArr = [];
            }
        }
        console.log($scope.allSlideProductArr);
    }
    $scope.deleteProduct = function(productId) {

        console.log("Product Id:", productId);
        $scope.ProductId = productId;
        var confirmPopup = $ionicPopup.confirm({
            title: 'The product will be permantly deleted',
            template: 'Are you sure you want to delete Product?'
        });

        confirmPopup.then(function(res) {
            if (res) {

                $rootScope.showDbLoading();
                console.log("ProductId 2:", productId);
                var promise = dbService.deleteProduct(productId);
                promise.then(function(result) {

                    $rootScope.hideDbLoading();
                    $scope.OnCatClick($rootScope.SelCat);
                    //$ionicHistory.goBack();

                }, function(result) {
                    console.log(result);
                    $rootScope.hideDbLoading();
                });

            } else
                return;

        });

    }

    $scope.deleteAllProductsAndCat = function(catId) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Will also delete all products in Category ',
            template: 'Are you sure you want to delete Category?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('Confirm Delete');
                $rootScope.showDbLoading();
                var promise1 = dbService.deleteAllProductsInCat(catId);
                promise1.then(function(res) {
                    console.log(res);
                    console.log("deleted Products");
                    $scope.deleteCategory(catId);

                }, function() {
                    console.log(res);
                    console.log("Failed to delete Products in Category");
                    $rootScope.ShowToast("Failed to delete Products in Category", false);
                    $rootScope.hideDbLoading();
                })

            } else
                return;

        });

    }

    $scope.deleteCategory = function(catId) {

        var promise = dbService.deleteCategory(catId);
        promise.then(function(res) {
            console.log(res);
            $rootScope.ShowToast("Delete Category Success", false);
            $rootScope.hideDbLoading();
            //$ionicHistory.goBack();
            $rootScope.SelCat = 'favourite';
            loadCategory();
            $scope.OnCatClick('favourite');

            $state.go('home');
        }, function() {
            console.log(res);
            $rootScope.ShowToast("Failed to Delete Category", false);
            $rootScope.hideDbLoading();
        })

    }

    /*
    function categorySlideLogic() {
        $scope.allSlideCatArr = [];
        var tempCatArr = [];
        //  console.log(tempCatArr)
        for (var i = 0; i < $scope.categoryArr.length; i++) {
            tempCatArr.push($scope.categoryArr[i]);
            if (((i != 0) && (i % 4 == 0)) || (i == ($scope.categoryArr.length - 1))) {
                $scope.allSlideCatArr.push(tempCatArr)
                tempCatArr = [];
            }
        }
        console.log($scope.allSlideCatArr);
    }
*/
    $scope.onPressHoldProduct = function() {

        $scope.jiggleProduct = true;

    }

    $scope.onPressHold = function(index, product) {
        console.log('entered on hold delete item');
        $scope.showDelete = true;
        $scope.holdIndex = index;
        $scope.holdProduct = product;
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Item ',
            template: 'Do you want to delete selected item?'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('Delete item');
                $scope.deleteItem($scope.holdIndex, $scope.holdProduct);
            } else {
                console.log('dont delete item');
                $scope.showDelete = false;
            }
        });

    }

    $scope.deleteItem = function(index, product) {

        $scope.itemsInStockObj[product.productId] = $scope.itemsInStockObj[product.productId] + product.quantity;
        console.log($scope.itemsInStockObj[product.productId])
        $scope.productArr.splice(index, 1);
        $scope.showDelete = false;
        //delete $scope.itemsInStockObj[product.productId];
        calculateProductCost();

        console.log("In delete Item");

        if ($rootScope.selTable.tableId != undefined) //table order;;
        {
            if ($scope.productArr.length <= 0) //no items for table;;
            {
                //gau;;
                //remove from running list;;
                $rootScope.RemoveTable($rootScope.selTable);
                $scope.showPlaceButton = false;
                $rootScope.selTable = {};
                $scope.tableNumberSelected = -1;
            } else {
                if ($scope.isPendingOrder() == true) {
                    $scope.showPlaceButton = true;
                    console.log("Show button");
                } else {
                    $scope.showPlaceButton = false;
                    console.log("Hide button");
                }
            }
        }

    }

    $scope.isPendingOrder = function() {
        for (var i = 0; i < $scope.productArr.length; i++) {
            if ($scope.productArr[i].status == false)
                return ( true) ;
        }

        return ( false) ;
        //gau;;
    }

    /*
    $scope.testDivBlurFunc = function() {
        $scope.showDelete = false;

        console.log('clicked outside');
    }
    ;

*/

    function calculateProductCost() {
        $scope.totalPrice = 0;
        $scope.totalTaxAmount = 0;
        $scope.discountAmount = 0;
        $scope.totalChargeAmount = 0;

        for (var i = 0; i < $scope.productArr.length; i++) {
            var tempObj = $scope.productArr[i];
            $scope.totalPrice = $scope.totalPrice + tempObj.productTotalPrice;
            $scope.totalTaxAmount = parseFloat(($scope.totalTaxAmount + tempObj.productTaxAmount).toFixed(2));
            $scope.discountAmount = parseFloat(($scope.discountAmount + tempObj.discountAmount).toFixed(2));
            $scope.totalChargeAmount = parseFloat(($scope.totalChargeAmount + tempObj.productTotalAmount).toFixed(2));
        }

        if ($rootScope.totalAmountDiscount > $scope.totalChargeAmount) {
            $rootScope.totalAmountDiscount = 0;
        }
        if ($rootScope.totalAmountDiscount != 0 && $rootScope.discType == 'Rs') {
            $scope.totalChargeAmount = parseFloat(($scope.totalChargeAmount - $rootScope.totalAmountDiscount).toFixed(2));
        }
        if ($rootScope.totalAmountDiscount != 0 && $rootScope.discType == '%') {
            $scope.totalChargeAmount = parseFloat(($scope.totalChargeAmount - ($scope.totalChargeAmount * $rootScope.totalAmountDiscount / 100)).toFixed(2));
        }
    }

    //$scope.OnCatClick("favourite");

    /*
    $scope.scrollTopBtn = false;
    $scope.scrollBottomBtn = false;
    $scope.onScroll = function() {
        var scrollTopCurrent = $ionicScrollDelegate.getScrollPosition().top;
        var scrollTopMax = $ionicScrollDelegate.getScrollView().__maxScrollTop;
        var scrollBottom = scrollTopMax - scrollTopCurrent;
        console.log(scrollTopCurrent + " " + scrollTopMax);
        if (scrollTopMax) {
            $scope.scrollBottomBtn = true;
            $scope.scrollTopBtn = true;
        } else {
            $scope.scrollBottomBtn = false;
            $scope.scrollTopBtn = false;
        }
    };
    $scope.scrollTop = function() {
        $ionicScrollDelegate.$getByHandle('scrollSmall').scrollTop(true);
        //$ionicScrollDelegate.scrollBy(0, -50, true);
    }
    $scope.scrollBottom = function() {
        $ionicScrollDelegate.scrollBy(0, 50, true);
        // $ionicScrollDelegate.$getByHandle('scrollSmall').scrollBottom(true);
    }*/

    $scope.itemsInStockObj = {};
    // $scope.numValue = 0;
    $scope.productArr = [];
    $scope.index = null;
    $scope.totalPrice = 0;
    $scope.totalTaxAmount = 0;
    $scope.discountAmount = 0;
    $scope.totalChargeAmount = 0;
    //  $scope.quantity=0;
    var productInstock = 0;
    $scope.save = function(product, typedCode) {
        productInstock = product.stock;
        console.log(product);
        console.log(product.productId);
        console.log(product.quantity)
        if ($scope.productArr != undefined && $scope.productArr.length < 1) {
            for (var i = 0; i < $scope.productArr.length; i++) {
                if (product.productId == $scope.productArr[i].productId) {
                    $scope.productArr[i].quantity = product.quantity + $scope.productArr[i].quantity;
                    $scope.productArr[i].productTotalPrice = product.productTotalPrice + $scope.productArr[i].productTotalPrice;

                }
            }
        }
        console.log(typedCode);
        if (typedCode == null) {
            console.log('Type Code Null')
            qty = typedCode = 1;
        } else {
            qty = typedCode;
        }

        console.log($scope.itemsInStockObj);
        console.log('quantity' + parseFloat(qty));
        console.log('In Stock' + parseFloat(product.inStock))
        console.log(parseFloat(qty) < parseFloat(product.inStock))
        console.log('item in stock' + $scope.itemsInStockObj[product.productId])
        console.log(parseFloat(product.inStock) - parseFloat(qty));
        if ($scope.itemsInStockObj[product.productId] == undefined && parseFloat(qty) <= parseFloat(product.inStock)) {
            $scope.itemsInStockObj[product.productId] = parseFloat(product.inStock) - parseFloat(qty);
            console.log('This is Item in stock obj' + $scope.itemsInStockObj[product.productId])
        } else if (parseFloat(qty) > parseFloat(product.inStock)) {
            $rootScope.ShowToast("Insufficient Stock", false);
            return false;
        } else if ($scope.itemsInStockObj[product.productId] == 0) {
            $rootScope.ShowToast("Out of Stock", false);
            return false;
        } else if (parseFloat(qty) > $scope.itemsInStockObj[product.productId]) {
            $rootScope.ShowToast("In sufficient stock", false);
            return false;
        } else {
            $scope.itemsInStockObj[product.productId] = $scope.itemsInStockObj[product.productId] - parseFloat(qty);
            console.log('This is Item in stock obj' + $scope.itemsInStockObj[product.productId])
        }

        console.log($scope.itemsInStockObj);
        //  var qty =document.getElementById('quantity').value;
        console.log('I am in Save Function');
        // console.log('Scope quanitity' + qty);
        console.log(product.name + ' ' + product.unitPrice + ' ' + qty);
        var productTotalPrice = parseFloat((product.unitPrice * qty).toFixed(2));
        console.log("productTotalPrice: " + productTotalPrice);
        var productTotalTax = parseFloat(((product.taxRate / 100) * productTotalPrice).toFixed(2));
        console.log("productTotalTax: " + productTotalTax);
        var discountAmount = parseFloat(((product.discount / 100) * productTotalPrice).toFixed(2));
        console.log("discountAmount: " + discountAmount);
        var productTotalAmount = parseFloat((productTotalPrice + productTotalTax - discountAmount).toFixed(2));
        console.log("productTotalAmount: " + productTotalAmount);
        console.log("productId " + product.productId);

        var status = true;

        if ($rootScope.selTable.tableId != undefined) //table order;;
        {
            status = false;
        }

        $scope.productArr.push({
            productId: product.productId,
            name: product.name,
            quantity: qty,
            productPrice: product.unitPrice,
            productTotalPrice: productTotalPrice,
            productTaxAmount: productTotalTax,
            discount: product.discount,
            discountAmount: discountAmount,
            productTotalAmount: productTotalAmount,
            taxRate: product.taxRate,
            taxId: product.taxId,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            selected: false,
            status: status
        })

        //$scope.numericModal.hide();
        //$scope.newProduct = {};
        //$scope.typedCode = null;
        $rootScope.totalAmountDiscount = 0;
        console.log($scope.productArr);
        $scope.totalPrice = $scope.totalPrice + productTotalPrice;
        $scope.totalTaxAmount = parseFloat(($scope.totalTaxAmount + productTotalTax).toFixed(2));
        $scope.discountAmount = parseFloat(($scope.discountAmount + discountAmount).toFixed(2));
        $scope.totalChargeAmount = parseFloat(($scope.totalChargeAmount + productTotalAmount).toFixed(2));
        console.log('This is Total Price' + $scope.totalPrice);

        if ($rootScope.selTable.tableId != undefined) {
            $scope.showPlaceButton = true;
            $rootScope.saveItemsToTable($rootScope.selTable, $scope.productArr, $scope.totalChargeAmount);
        }
    }

    //receipt function to store all transaction details in DB

    $scope.receipt = function(tokenNo) {
        //$scope.paymentModal.hide();
        console.log("Print Receipt");
        var billSummary = {};
        // $scope.NoCopies = $rootScope.printFormatSettings.billCopies;

        billSummary.totalPrice = $scope.totalPrice;
        billSummary.discountAmount = $scope.discountAmount;
        billSummary.totalTaxAmount = $scope.totalTaxAmount;
        billSummary.totalChargeAmount = $scope.totalChargeAmount;
        billSummary.BillStatus = "Active";

        if ($scope.BillDate == undefined) {
            $scope.BillDate = (new Date()).getTime();
        }

        billSummary.DateTime = new Date($scope.BillDate);

        //$scope.BillDate =  billSummary.DateTime;

        $scope.CurrentTokenNumber = tokenNo;

        $rootScope.print(billSummary, $scope.productArr, onPrintReceiptSuccess, PrintReceiptError, tokenNo, $rootScope.VolatileData.CurrentBillNo);
        return ( true) ;

    }

    function onPrintReceiptSuccess() {
        $scope.billCopies++;

        if ($scope.billCopies < $rootScope.printFormatSettings.billCopies) {

            $ionicPopup.show({
                title: 'Print another copy',
                subTitle: 'Click Print to get another bill copy',
                scope: $scope,
                buttons: [{
                    text: 'Cancel',
                    onTap: function(e) {
                        return "cancel";
                    }
                }, {
                    text: '<b>Print</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return "Print";
                    }
                }]

            }).then(function(res) {

                if (res == "Print") {
                    $scope.receipt($scope.CurrentTokenNumber);
                } else {
                    SaveTransactionDetailstoDB();
                    $scope.billCopies = $rootScope.printFormatSettings.billCopies;
                }

            });

        } else {
            SaveTransactionDetailstoDB();
            //UpdateVolatileDataToDB();
        }

    }

    function UpdateVolatileDataToDB() {
        var promise = settingService.set("VolatileData", JSON.stringify($rootScope.VolatileData));
        promise.then(function(data) {
            if (data.rowsAffected >= 1) {
                console.log("Data update Success");
                //$rootScope.ShowToast("Data update Success",false);
                // $rootScope.password = newpassword;
            } else {

                console.log("Data update Failed");
                //$rootScope.ShowToast("Unable to Password",false);
            }
        }, function(err) {
            console.log("Data update Failed: ", err);
            //$rootScope.ShowToast("Unable to Password",false);
        })
    }

    function PrintReceiptError() {
        console.log("Print Receipt Error");

        if ($scope.billCopies > 0) //atleast one copy printed;;
        {
            SaveTransactionDetailstoDB();
            //UpdateVolatileDataToDB();

        }

    }

    function SaveTransactionDetailstoDB() {
        //$scope.transactionDate = $scope.BillDate;
        //check

        //console.log("tran Date: ", $scope.transactionDate);
        var promise = dbService.storeToTransaction($scope.productArr, $scope.BillDate, $rootScope.VolatileData.CurrentBillNo);
        promise.then(function(result) {
            console.log(result);
            $scope.paymentMethod = "cash";
            $scope.totalItems = $scope.productArr.length;
            //update inStock in product
            var promise2 = dbService.updateItemsInStock($scope.itemsInStockObj);
            promise2.then(function(res) {
                $scope.OnCatClick($rootScope.SelCat);
            }, function() {})
            SaveBillDetails();
        }, function(result) {
            console.log(result);
        })

    }

    //function to save bill details to database
    function SaveBillDetails() {
        var totDiscAmnt;
        var totAmnt;
        if ($rootScope.totalAmountDiscount != 0 && $rootScope.discType == '%') {
            totAmnt = parseFloat(($scope.totalChargeAmount * 100 / $rootScope.totalAmountDiscount).toFixed(2));
            console.log(totAmnt);
            totDiscAmnt = parseFloat((totAmnt * $rootScope.totalAmountDiscount / 100).toFixed(2));
            console.log(totDiscAmnt);
        } else {
            totDiscAmnt = $rootScope.totalAmountDiscount;
        }
        //console.log("Save Bill date: ", $scope.transactionDate);
        var promise = dbService.storeToBillDetails($scope.totalPrice, $scope.discountAmount, $scope.totalTaxAmount, $scope.totalChargeAmount, $scope.paymentMethod, $scope.totalItems, $scope.BillDate, $rootScope.VolatileData.CurrentBillNo, totDiscAmnt);
        promise.then(function(result) {
            console.log(result);
            //clear all values
            $scope.productArr = [];
            $scope.typedAmount = null;
            $scope.Balance = null;
            $scope.totalPrice = 0;
            $scope.totalTaxAmount = 0;
            $scope.discountAmount = 0;
            $scope.totalChargeAmount = 0;
            $rootScope.totalAmountDiscount = 0;
            $rootScope.discType = 'Rs';

            if ($rootScope.selTable.tableId != undefined) {
                console.log("TableId Found");
                $rootScope.RemoveTable($rootScope.selTable);

            }

            $scope.showPlaceButton = false;
            $rootScope.selTable = {};
            $scope.tableNumberSelected = -1;

            console.log("updating volatile Data", result);

            $rootScope.VolatileData.CurrentBillNo = Number($rootScope.VolatileData.CurrentBillNo) + 1;
            if (Number($rootScope.VolatileData.CurrentBillNo) > 99999999)
                $rootScope.VolatileData.CurrentBillNo = 1;

            if ($rootScope.printFormatSettings.tokNum == "Auto") {
                $rootScope.VolatileData.CurrentTokenNo = Number($rootScope.VolatileData.CurrentTokenNo) + 1;
                if (Number($rootScope.VolatileData.CurrentTokenNo) > $rootScope.printFormatSettings.tokResetAftr) {
                    $rootScope.VolatileData.CurrentTokenNo = $rootScope.printFormatSettings.tokStartNmbr;
                }
            }

            UpdateVolatileDataToDB();
        }, function(result) {
            console.log("Error: ", result);
        })
    }
    //function to get bill details
    function getBillDetails() {
        var billDetail = [];
        var promise = dbService.getBillDetails(2);
        promise.then(function(res) {
            billDetail = res;
            console.log(billDetail);
        }, function(res) {
            console.log(res)
        })
    }
    //function to get transaction details
    function getTransactionDetails() {
        var transactionDetail = [];
        var promise = dbService.getTransactionDetails(3);
        promise.then(function(res) {
            transactionDetail = res;
            console.log(transactionDetail);
        }, function(res) {
            console.log(res);
        })
    }
    $scope.void = function() {
        $scope.itemsInStockObj = {}
        console.log($scope.productArr)
        $scope.productArr = [];
        $scope.typedAmount = null;
        $scope.Balance = null;
        $scope.totalPrice = 0;
        $scope.totalTaxAmount = 0;
        $scope.discountAmount = 0;
        $scope.totalChargeAmount = 0;
        $rootScope.totalAmountDiscount = 0;
        $rootScope.discType = 'Rs';
        //gau;;

        console.log('I am in  void' + productInstock);

        if ($rootScope.selTable.tableId != undefined) //table order;
        {
            $rootScope.RemoveTable($rootScope.selTable);
            $scope.showPlaceButton = false;
            $rootScope.selTable = {};
            $scope.tableNumberSelected = -1;
        }
    }

    $scope.onPaymentOk = function(value) {
        console.log("Payment Ok");
        console.log('I am in Paid Function');
        console.log(value);
        var typedAmount = parseFloat(value);

        if (typedAmount < $scope.totalChargeAmount) {
            $rootScope.ShowToast("Collected Amount is less than Bill Amount", false);
            console.log("Collected Amount less than Bill Amount");
            return ( false) ;
        }

        $scope.paidAmount1 = typedAmount;
        console.log(typedAmount);

        var balance = typedAmount - $scope.totalChargeAmount;
        $scope.Balance = parseFloat(balance).toFixed(2);
        $scope.typedAmount = typedAmount;

        $ionicPopup.show({
            title: 'Print Receipt',

            subTitle: 'Print Receipt to Complete Transaction <br/><br/><b>Paid Amount : ' + $scope.typedAmount + ' (' + $rootScope.PaymentSettings.CurrencyOptions.symbol + ')</b><br/><b> Balance Amount : ' + $scope.Balance + ' (' + $rootScope.PaymentSettings.CurrencyOptions.symbol + ')</b>',
            scope: $scope,
            buttons: [{
                text: 'Close',
                onTap: function(e) {
                    return "cancel";
                }
            }, {
                text: '<b>Print</b>',
                type: 'button-positive',
                onTap: function(e) {
                    return "Print";
                }
            }, {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    return "Save";
                }
            }]

        }).then(function(res) {
            if (res == "Print") {
                //console.log("printer Name is: ", $rootScope.printerName);
                //$rootScope.printerConnect($rootScope.printerName,$rootScope.ConnectStatusFunc);
                console.log("Print Receipt Invoked");
                $scope.billCopies = 0;
                if ($rootScope.printFormatSettings.tokNum == "Manual") {
                    $scope.keypadMessage = "Enter Token Number";
                    $scope.BillDate = undefined;
                    $rootScope.openNumericModal($scope, $scope.receipt, $scope.receipt);

                } else if ($rootScope.printFormatSettings.tokNum == "Auto") {
                    $scope.BillDate = (new Date()).getTime();
                    $scope.receipt($rootScope.VolatileData.CurrentTokenNo);
                    // $rootScope.VolatileData.CurrentTokenNo = $rootScope.VolatileData.CurrentTokenNo + 1;
                    // if($rootScope.VolatileData.CurrentTokenNo > $rootScope.printFormatSettings.tokResetAftr)
                    //{
                    //  $rootScope.VolatileData.CurrentTokenNo = $rootScope.printFormatSettings.tokStartNmbr;
                    //}
                } else //disable;;
                {
                    //$scope.BillDate = (new Date()).getItem();
                    $scope.BillDate = (new Date()).getTime();
                    $scope.receipt(undefined);
                }
                //();
                return;

            } else if (res == "Save") {
                $scope.BillDate = (new Date()).getTime();
                SaveTransactionDetailstoDB();
                //UpdateVolatileDataToDB();
            } else {
                return;
            }

        });

        return ( true) ;

    }

    $scope.onPaymentCancel = function() {

        console.log("Payment Cancel");
    }

    $scope.showPaymentMode = function() {
        console.log($scope.productArr);

        if ($scope.productArr.length <= 0) {
            return;
        }

        if ($rootScope.PaymentSettings.PaymentMode.length <= 0) {
            $scope.keypadMessage = "Enter Amount collected";
            $rootScope.openNumericModal($scope, $scope.onPaymentOk, $scope.onPaymentCancel);
            return;

        }

        if ($rootScope.PaymentSettings.PaymentMode.length == 1 && $rootScope.PaymentSettings.PaymentMode[0].name == "Cash") {
            $scope.keypadMessage = "Enter Amount collected";
            $rootScope.openNumericModal($scope, $scope.onPaymentOk, $scope.onPaymentCancel);
            return;
        }

        var AvailButtons = [];
        console.log($rootScope.PaymentSettings.PaymentMode);
        //$scope.returnvalues=[];
        for (var i = 0; i < $rootScope.PaymentSettings.PaymentMode.length; i++) {
            //$scope.returnvalues.push()
            var name = $rootScope.PaymentSettings.PaymentMode[i].name;
            var newbutton = {
                text: $rootScope.PaymentSettings.PaymentMode[i].name,
                onTap: function(e) {
                    console.log(e);
                    return e.currentTarget.childNodes[0].data;
                }
            }
            AvailButtons.push(newbutton);

        }

        $ionicPopup.show({
            title: 'Payment Mode',
            subTitle: 'Select Payment Mode',
            scope: $scope,
            buttons: AvailButtons

        }).then(function(res) {
            console.log('Sel Button is', res);

            //var st = res.toString();
            //console.log(typeof(res));

            if (res == "Cash") {
                //show keypad;;
                //showing Modal();
                console.log("In cash");
                $scope.keypadMessage = "Enter Amount collected";
                $rootScope.openNumericModal($scope, $scope.onPaymentOk, $scope.onPaymentCancel);
            }

        });

    }

    $scope.OnProductClick = function(Product) {
        console.log("on product click");
        if ($rootScope.Mode == 1) //edit or add mode;;
        {
            console.log("Mode Edit");
            $rootScope.CreateMode = 0;
            //edit mode;;
            $rootScope.CurrentProduct = Product;
            $state.go('product');

        } else {
            $rootScope.CurrentProduct = Product;
            $scope.keypadMessage = "Enter Quantity";
            $rootScope.openNumericModal($scope, $scope.onQuantityOk, $scope.onQuantityCancel);
        }

    }

    $scope.addTotalDiscount = function() {
        $rootScope.openNumericModal($scope, $scope.onDiscountOk, $scope.onQuantityCancel);
    }

    $scope.onDiscountOk = function(value) {
        console.log("Entered Discount value: " + value);
        console.log(typeof value);

        if (value.indexOf('.') == 0) {
            value = value.substr(1);
            $rootScope.discType = '%';
        } else {
            $rootScope.discType = 'Rs';
        }
        value = Number(value);
        console.log(typeof value);

        if (($rootScope.discType == '%') && (value > 100)) {
            console.log('Value cannot be greater than 100% discount');
            $rootScope.ShowToast('Value cannot be greater than 100% discount', false);
            return ( false) ;
        }

        if (($rootScope.discType == 'Rs') && (value > $scope.totalChargeAmount)) {
            $rootScope.ShowToast('Value cannot be greater than Total amount', false);
            return ( false) ;
        }

        $rootScope.totalAmountDiscount = value;
        calculateProductCost();

        return ( true) ;
    }

    $scope.onQuantityOk = function(value) {
        console.log("On Quantity Ok: ", value);
        console.log(typeof value);
        //checks here;;
        if (value <= 0) {
            console.log("Quantity cannot be zero");
            $rootScope.ShowToast("Quantity cannot be zero", false);
            return ( false) ;
        }

        console.log("value is: ", value);
        value = Number(value);

        if (isNaN(value)) {
            console.log("please Enter Valid Qty");
            $rootScope.ShowToast("please Enter Valid Qty", false);
            return ( false) ;
        }

        if ((value * $rootScope.CurrentProduct.unitPrice) > 99999.99) {
            console.log("Total Amount too large, Please split Quantity");
            $rootScope.ShowToast("Total Amount too large, Please split Quantity", false);
            return ( false) ;
        }

        if (value > 9999.99) {
            console.log("Quantity greater than 9999.99");
            $rootScope.ShowToast("Quantity cannot be greater than 9999.99", false);
            return ( false) ;
        }

        if ($rootScope.CurrentProduct.unit == "pieces") {
            var n = Math.abs(value);
            // Change to positive
            var decimal = n - Math.floor(n);
            if (decimal > 0) {
                console.log("Quantity cannot be decimal for peices type product");
                $rootScope.ShowToast("Quantity cannot be decimal for this product", false);
                return ( false) ;
            }

        }

        $scope.save($rootScope.CurrentProduct, value);
        return ( true) ;
    }

    $scope.onQuantityCancel = function() {
        console.log("On Quantity Cancel");
    }

    $ionicModal.fromTemplateUrl('templates/recallModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.recallModal = modal;
    });
    $scope.openRecallModal = function(product) {
        $scope.recallModal.show();
    }
    $scope.closeRecallModal = function() {
        $scope.recallModal.hide();
    }
    ;

    $scope.holdItems = function() {

        if ($rootScope.selTable.tableId != undefined) //table order;;
        {
            $rootScope.ShowToast("Functionality not Available for Table Order", false);
            console.log("Functionality not Available for Table Order");
            return;
        }

        if ($rootScope.holdItemArr.length == 0 && $scope.productArr.length != 0) //hold;;
        {
            $rootScope.holdItemArr = $scope.productArr;
            //deepcopy;;
            $scope.totalPrice = 0;
            $scope.productArr = [];
            $scope.totalPrice = 0;
            $scope.totalTaxAmount = 0;
            $scope.discountAmount = 0;
            $scope.totalChargeAmount = 0;
            $scope.Balance = undefined;
            $scope.typedAmount = undefined;
            console.log("Current Bill put on hold");
            $rootScope.ShowToast("Current Bill put on hold", false);
            return;
        } else if ($rootScope.holdItemArr.length != 0 && $scope.productArr.length == 0) //recall;;
        {

            $scope.productArr = $rootScope.holdItemArr;
            //deepcopy;;
            $rootScope.holdItemArr = [];
            calculateProductCost();
            console.log("Saved Bill Recalled");
            $rootScope.ShowToast("Saved Bill Recalled", false);
            return;
        } else {
            console.log("Else case");
            $rootScope.ShowToast("Current Bill Not Empty or Hold Item already Exists", false);
        }

        /*
        if ($scope.productArr.length != 0) {
            var itemsDetails = {};
            var d = new Date();
            console.log("--" + d.toString().substring(4, 24) + "--");
            var id = d.getTime();
            console.log(id);
            var itemsJsonObj = window.localStorage.getItem('holdEvents');
            //     console.log(itemsJsonObj);
            if (itemsJsonObj != "") {
                itemsJsonObj = JSON.parse(itemsJsonObj);
            } else {
                itemsJsonObj = {};
            }
            itemsDetails.date = d.toString().substring(4, 24);
            itemsDetails.products = $scope.productArr;
            itemsDetails.totalPrice = $scope.totalPrice;
            itemsJsonObj[id] = itemsDetails;
            console.log(itemsJsonObj);
            window.localStorage.setItem('holdEvents', JSON.stringify(itemsJsonObj));
            $scope.productArr = [];
            $scope.totalPrice = null;
        }
   */

    }

    $rootScope.recallItems = function() {
        var itemsJsonObj = window.localStorage.getItem('holdEvents');
        console.log(itemsJsonObj);
        if (itemsJsonObj != "") {
            itemsJsonObj = JSON.parse(itemsJsonObj);
        } else {
            itemsJsonObj = {};
        }
        $scope.holdItemObj = itemsJsonObj;
        var transactionJsonObj = window.localStorage.getItem('transactionEvents');
        console.log(transactionJsonObj);
        if (transactionJsonObj != "") {
            transactionJsonObj = JSON.parse(transactionJsonObj);
        } else {
            transactionJsonObj = {};
        }
        $scope.transactionObj = transactionJsonObj;
        $scope.openRecallModal();
    }
    $scope.unHold = function(holdKey, holdValue) {
        $scope.recallModal.hide();
        $scope.productArr = holdValue.products;
        $scope.totalPrice = holdValue.totalPrice;
        var itemsJsonObj = window.localStorage.getItem('holdEvents');
        console.log(itemsJsonObj);
        if (itemsJsonObj != "") {
            itemsJsonObj = JSON.parse(itemsJsonObj);
            delete itemsJsonObj[holdKey];
            window.localStorage.setItem('holdEvents', JSON.stringify(itemsJsonObj));
        }
    }
    $scope.nextCategorySlide = function() {
        console.log('I am in next')
        //  $ionicScrollDelegate.scrollBy(0, 68, true);
        $ionicSlideBoxDelegate.$getByHandle('categorySlideHandle').next();
    }
    ;
    $scope.previousCategorySlide = function() {
        // $ionicScrollDelegate.scrollBy(0, -68, true);
        $ionicSlideBoxDelegate.$getByHandle('categorySlideHandle').previous();
    }
    ;
    //Slide Ends

    $rootScope.$on('OnClickSearchItem', function(event, data) {
        console.log("On click search item broadcast reciever");
        $scope.OnProductClick(data.prod);
    });

    $rootScope.$on('DbChange', function(event, data) {
        $rootScope.holdItemArr = [];
        console.log("On click DB change...");
        $scope.void();
    });

}
])//END OF HOMECTRL;;

.controller("productCtrl", function($scope, $state, $rootScope, $ionicPopover, $ionicHistory, $ionicPopup, $cordovaSQLite, $cordovaCamera, $timeout, $cordovaFile, $ionicModal, dbService) {

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        console.log('working before enter..')

        if ($rootScope.CreateMode == 0) {
            //editing;;
            $scope.ProductButtonText = "Edit Product";
            console.log("Edit Product: ");
            console.log($rootScope.CurrentProduct);
            $scope.newProduct = $rootScope.CurrentProduct;
            $scope.newProduct.favourite == "true" ? $scope.newProduct.favourite = true : $scope.newProduct.favourite = false;
            console.log("fav: ", $scope.newProduct.favourite);
            $rootScope.editingProduct = {};
            $scope.pIdDisable = true;
        } else {
            $scope.ProductButtonText = "Add Product";
            $scope.pIdDisable = false;
            $scope.newProduct = {
                unit: 'pieces',
                favourite: false
            };
        }
        loadCategory();
    });

    $scope.addEditProduct = function() {

        console.log($scope.newProduct.productId)
        var productName = $scope.newProduct.name;

        if (productName == undefined || productName.length < 2) {
            $rootScope.ShowToast("Enter productName", false);
            console.log('Enter Product Name')
            return false
        }
        if (productName.indexOf("'") > -1) {
            $rootScope.ShowToast("Product name should not contain quatations", false);
            console.log("Product name should not contain quatations");
            return false;
        }

        var productSellingPrice = $scope.newProduct.unitPrice;
        var pattern = new RegExp('^[0-9]+([,.][0-9]+)?$');
        var pattern1 = new RegExp('^[0-9]+$');
        if (productSellingPrice == undefined || productSellingPrice.length < 1) {
            $rootScope.ShowToast("Enter Selling Price ", false);
            console.log("Enter Selling Price");
            return false
        } else if (!pattern.test(productSellingPrice)) {
            $rootScope.ShowToast("Invalid Selling Price", false);
            console.log('Invalid product Selling')
            return false;
        }

        if (productSellingPrice > 9999.99) {
            $rootScope.ShowToast("Invalid Selling Price", false);
            console.log('Invalid product Selling')
            return false;
        }

        var taxRate = $scope.newProduct.taxRate;
        console.log(taxRate);
        if (taxRate == undefined) {
            $rootScope.ShowToast("Select taxRate", false);
            console.log('Select taxRate')
            return false
        }

        var buyingPrice = $scope.newProduct.actualPrice;
        if (buyingPrice == undefined || buyingPrice.length < 1) {
            $scope.newProduct.actualPrice = document.getElementById('buyingPrice').value = 0;
        } else if (!pattern.test(buyingPrice)) {
            $rootScope.ShowToast("Invalid buyingPrice", false);
            console.log('Invalid buyingPrice');
            return false
        }
        console.log(buyingPrice)
        if (buyingPrice > 9999.99) {
            $rootScope.ShowToast("Invalid Buying Price", false);
            console.log('Invalid buying price');
            return false;
        }

        console.log(productSellingPrice);
        console.log(buyingPrice);

        if (parseFloat(productSellingPrice) < parseFloat(buyingPrice)) {
            $rootScope.ShowToast("Invalid Buying Price", false);
            console.log('Invalid buying price');
            return false;

        }

        var itemInStock = $scope.newProduct.inStock;
        if (itemInStock == undefined || itemInStock < 0) {
            $scope.newProduct.inStock = document.getElementById('itemsStock').value = 1000000;

        } else if (!pattern1.test(itemInStock) && $scope.newProduct.unit == 'pieces') {
            $rootScope.ShowToast("Invalid  itemInStock", false);
            console.log('Invalid  itemInStock');
            return false
        } else if (!pattern.test(itemInStock) && $scope.newProduct.unit == 'litres') {
            $rootScope.ShowToast("Invalid  itemInStock", false);
            console.log('Invalid  itemInStock');
            return false
        } else if (!pattern.test(itemInStock) && $scope.newProduct.unit == 'kgs') {
            $rootScope.ShowToast("Invalid  itemInStock", false);
            console.log('Invalid  itemInStock');
            return false
        }

        console.log("Item in Stock is : ", itemInStock);

        var discount = $scope.newProduct.discount;

        if (discount == undefined || discount.length < 1) {
            $scope.newProduct.discount = document.getElementById('discount').value = 0;

        } else if (!pattern.test(discount)) {
            $rootScope.ShowToast("Invalid discount", false);
            console.log('Invalid discount')
            return false
        } else if (discount > 100) {
            $rootScope.ShowToast("Invalid discount", false);
            console.log('Invalid discount')
            return false
        }

        var Categary = $scope.newProduct.categoryName;
        if (Categary == undefined) {
            $rootScope.ShowToast("Select Categary", false);
            console.log('Select Categary');
            return false
        }

        console.log("fav value: ", $scope.newProduct.favourite);
        //validate here;;
        //min length;;
        //min value;;
        //valid number;;
        //valid selection;; ex: category , tax rate.
        //discount less than 100%
        //if discount not entered set discout =0 
        //if item in stock not entered set to 0;
        //if image not selected, set default image;;

        //$rootScope.ShowToast("Invalid Selling Price",false); 

        //console.log("Invalid Selling Price");

        if ($rootScope.CreateMode == 0) {
            console.log("Edit Product");
            editProduct();
        } else {
            console.log("Add Product");
            addNewProduct();
        }

    }

    function loadCategory() {
        //$rootScope.showDbLoading();
        var promise = dbService.loadCategoryFromDB('Category');
        promise.then(function(res) {
            $scope.categoryArr = res;
            //$rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            //$rootScope.hideDbLoading();
        })
    }

    //gautham;;
    $scope.TaxSettings1 = $rootScope.TaxSettings;

    /*[{
        Id: '1',
        Name: 'tax1',
        TaxRate: '5'
    }, {
        Id: '2',
        Name: 'tax2',
        TaxRate: '10'
    }, {
        Id: '3',
        Name: 'tax3',
        TaxRate: '15'
    }, {
        Id: '4',
        Name: 'tax4',
        TaxRate: '20'
    }]*/

    $scope.onTaxRateSelect = function(tax) {
        $scope.newProduct.taxRate = tax.taxRate;
        $scope.newProduct.taxId = tax.id;
        $scope.taxRatePopover.hide();
    }

    $ionicPopover.fromTemplateUrl('templates/taxRatePopover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.taxRatePopover = popover;
    });

    $scope.openTaxRatePopover = function($event) {
        $scope.taxRatePopover.show($event);
    }
    ;

    $scope.newProduct = {
        unit: 'pieces',
        favourite: false
    };

    console.log($scope.newProduct);

    /*$scope.$watch('newProduct.inStock', function(newValue, oldValue) {
        console.log($scope.newProduct);
        if (newValue) {
            if ($scope.newProduct.unit == 'pieces') {
                $scope.newProduct.inStock = Math.round(newValue);
            }
        }
    });*/

    function addNewProduct() {
        console.log($scope.selectedTax);
        console.log('entered addNewProduct()..');

        if ($scope.newProduct.image == undefined || $scope.newProduct.image == "")
            $scope.newProduct.image = "img/longImage.jpg";

        console.log($scope.newProduct);

        /* 
          if (!(angular.isDefined($scope.newProduct.discount))) {
                    $scope.newProduct.discount = 0;
                }
                 if (!(angular.isDefined($scope.newProduct.inStock))) {
                    $scope.newProduct.inStock = 1000000;
                }
         */

        console.log("Cat ID: ", $scope.newProduct.categoryId);
        console.log('validation success and entered if');
        console.log($scope.newProduct);
        $rootScope.showDbLoading();
        var promise = dbService.addNewProduct($scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image, $scope.newProduct.favourite, $scope.newProduct.productId);
        promise.then(function(result) {
            console.log(result);
            console.log("Product Added Sucessfully");
            $rootScope.ShowToast("Product Added Sucessfully", false);
            //  $rootScope.Products.push($scope.newProduct);
            $scope.newProduct = {
                unit: 'pieces',
                image: "img/sc1.jpg",
                favourite: false
            };
            $rootScope.hideDbLoading();
            $scope.productSuccessMessage = true;
            //confirmation popup
            var confirmPopup = $ionicPopup.confirm({
                title: 'Add More Products ',
                template: 'Do you want to add more products?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    console.log('add more products');
                } else {
                    console.log('No');
                    $ionicHistory.goBack();
                }
            });
        }, function(result) {
            console.log(result);
            console.log("Unable to add product");
            $rootScope.ShowToast("Unable to add product", false);
            $rootScope.hideDbLoading();
        })

    }

    function editProduct() {
        $rootScope.showDbLoading();
        console.log("Edit fav : ", $scope.newProduct.favourite);
        var promise = dbService.editProduct($scope.newProduct.productId, $scope.newProduct.name, $scope.newProduct.unit, $scope.newProduct.unitPrice, $scope.newProduct.taxId, $scope.newProduct.actualPrice, $scope.newProduct.taxRate, $scope.newProduct.inStock, $scope.newProduct.discount, $scope.newProduct.categoryId, $scope.newProduct.categoryName, $scope.newProduct.image, $scope.newProduct.favourite);
        promise.then(function(result) {
            console.log(result);
            console.log("product Edited Sucessfully");
            $rootScope.hideDbLoading();
            $rootScope.ShowToast("product Edited Sucessfully", false);
            $ionicHistory.goBack();
        }, function(result) {
            console.log(result);
            $rootScope.ShowToast("Unable to Edit product", false);
            console.log("Unable to Edit product");
            $rootScope.hideDbLoading();
        })
    }

    $scope.onCategorySelect = function(categoryObj) {
        $scope.newProduct.categoryName = categoryObj.categoryName;
        $scope.newProduct.categoryId = categoryObj.categoryId;
        $scope.categoryModal.hide();
    }
    $scope.addNewCategary = function(newCategaryName) {
        $rootScope.cameFromProduct = true;
        $state.go('category');
        $scope.categoryModal.hide();
    }
    $scope.openCamera = function() {
        console.log('camera opened..');
        document.addEventListener("deviceready", function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1020,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function(sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
                // $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                console.log("Copying from : " + sourceDirectory + sourceFileName);
                console.log("Copying to : " + cordova.file.dataDirectory + sourceFileName);
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function(success) {
                    $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                    console.log($scope.cameraFileName);
                    $scope.newProduct.image = $scope.cameraFileName;
                }, function(error) {
                    console.dir(error);
                });
            }, function(err) {// error
            });
        }, false);
    }

    $scope.openGallery = function() {

        console.log('gallery opened..');
        document.addEventListener("deviceready", function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                // targetWidth: 1020,
                // targetHeight: 768,
                allowEdit: true
            };
            $cordovaCamera.getPicture(options).then(function(sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
                var destinationTypeFileName = (new Date()).getTime() + '.jpg';
                // $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                console.log("Copying from : " + sourceDirectory + sourceFileName);
                console.log("Copying to : " + cordova.file.dataDirectory + destinationTypeFileName);
                // sourceFileName =  sourceFileName.substr(9)+".jpg";

                console.log(sourceDirectory);
                console.log(sourceFileName);
                console.log(cordova.file.dataDirectory);
                console.log(destinationTypeFileName);
                console.log($scope.galleryFileName);

                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, destinationTypeFileName).then(function(success) {
                    $scope.galleryFileName = cordova.file.dataDirectory + destinationTypeFileName;
                    console.log($scope.galleryFileName);
                    $scope.newProduct.image = $scope.galleryFileName;
                }, function(error) {
                    console.dir(error);
                });
            }, function(err) {
                console.log(err);
            });
        }, false);
    }
    $ionicModal.fromTemplateUrl('templates/categoryModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.categoryModal = modal;
    })
    $scope.openCategoryModal = function() {
        console.log('open categoryModal');
        $scope.categoryModal.show();
    }
    console.log($rootScope.selShopDB);

}).controller('categoryCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $cordovaSQLite, $rootScope, dbService) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $scope.newCategory = {};
        $scope.newCategory.categoryId = "";
        $scope.newCategory.categoryName = "";
        $scope.newCategory.categoryDescription = "";

        if ($rootScope.CreateMode == 1)
            $rootScope.CategoryButtonText = "Add Category";
        else {
            $rootScope.CategoryButtonText = "Edit Category";
            loadCategory();
        }
    });

    function loadCategory() {

        $rootScope.showDbLoading();
        var promise = dbService.GetCategoryById($rootScope.SelCat);
        promise.then(function(res) {
            if (res.categoryId != "Failed")
                $scope.newCategory = res;

            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    $scope.OnDone = function() {
        if ($rootScope.CreateMode == 1)
            $scope.addNewCategory();
        else
            $scope.saveEditedCategory();

    }

    $scope.editedCategory = {
        name: "",
        description: ""
    };

    $scope.editCategory = function() {
        console.log('entered edit category');
        if ($scope.searchCategory.categoryId) {
            $scope.showEditField = true;
        } else {
            $scope.selectCategoryWarningMsg = true;
        }
    }

    $scope.saveEditedCategory = function() {
        if ($scope.newCategory.categoryName == undefined || $scope.newCategory.categoryName.length < 1) {
            $rootScope.ShowToast("Enter Categary Name", false);
            console.log('Enter Categary');
            return false;
        }
        if ($scope.newCategory.name != '') {
            console.log($scope.newCategory.categoryName);

            console.log($scope.newCategory.categoryDescription);
            $rootScope.showDbLoading();
            var promise = dbService.editCategory($scope.newCategory.categoryId, $scope.newCategory.categoryName, $scope.newCategory.categoryDescription);
            promise.then(function(res) {
                console.log(res);
                $rootScope.hideDbLoading();
                $scope.editedCategory = {};
                $scope.newNameDescSuccessMsg = true;
                newNameDescWarningMsg = false;
                $ionicHistory.goBack();
            }, function() {
                console.log(res);
                $rootScope.hideDbLoading();
            })
        } else {
            console.log('enter new name and description...');
            //$scope.newNameDescWarningMsg = true;
        }
    }

    $scope.nameFocused = function() {
        $scope.newNameDescWarningMsg = false;
    }

    $scope.searchCategory = {
        categoryId: ""
    };

    $scope.editSelectedCategory = function(categoryEditObj) {
        //  $scope.searchCategory = categoryEditObj;
        console.log(categoryEditObj);
        $scope.searchCategory.categoryId = categoryEditObj.categoryId;
        $scope.showCategoryEdit = true;
        $scope.selectCategoryWarningMsg = false;
    }

    $scope.newCategory = {};

    $scope.addNewCategory = function() {
        console.log('I am in add New Categary')
        console.log($scope.newCategory.categoryName)
        console.log($scope.newCategory.categoryName.length)
        if ($scope.newCategory.categoryName == undefined || $scope.newCategory.categoryName.length < 1) {
            $rootScope.ShowToast("Enter Categary Name", false);
            console.log('Enter Categary');
            return false;
        }

        if (!($scope.catIdErrorMsg)) {
            $rootScope.showDbLoading();
            var promise = dbService.addNewCategory($scope.newCategory.categoryName, $scope.newCategory.categoryDescription);
            promise.then(function(result) {
                console.log(result);
                $rootScope.hideDbLoading();
                $scope.succesMessage = true;
                //   $rootScope.categoryArr.push($scope.newCategory);
                $scope.newCategory = {};
                if ($rootScope.cameFromProduct) {
                    $rootScope.cameFromProduct = false;
                    $ionicHistory.goBack();
                } else {
                    //confirmation popup
                    $rootScope.ShowToast("Category Added Sucessfully", false);
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Add More Category ',
                        template: 'Do you want to add more Category?'
                    });
                    confirmPopup.then(function(res) {
                        if (res) {
                            console.log('add more Category');
                            $state.reload();
                        } else {
                            console.log('No');
                            $ionicHistory.goBack();
                        }
                    });
                }
            }, function() {
                console.log("Failed to Add Category");
                $rootScope.ShowToast("Failed to Add Category", false);
                $rootScope.hideDbLoading();
            });
        } else {
            console.log("Id already Exists");
            $rootScope.ShowToast("Id already Exists", false);
        }
    }

}).controller('MenuCtrl', function($scope, settingService, $rootScope, $state, dbService) {

    $rootScope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
    console.log($rootScope.devWidth);
    $rootScope.menuWidth = 0.90 * $rootScope.devWidth;
    console.log("In Menu Ctrl");
    $scope.rightItems = [];

    jQuery.getJSON('json/MenuItems.json', function(data) {

        $scope.rightItems = data.MenuItems;

    });

    $scope.itemclick = function(obj) {
        console.log("OnClick");
        if (obj.name == "Reprint-Bill")
            $rootScope.reprintBillButtonEnable = 1;
        else
            $rootScope.reprintBillButtonEnable = 0;
        $state.go(obj.state);
    }

}).controller('tableInfoCtrl', function($scope, $ionicPopup, $rootScope, dbService, $state, $timeout) {

    loadSection();
    loadTables();

    $rootScope.$on('tableChange', function(event, data) {
        console.log("On Table change Table broadcast reciever");

        loadSection();
        loadTables();

    });

    function loadSection() {

        $rootScope.showDbLoading();
        var promise = dbService.loadSectionFromDB('TableInfoSection');
        promise.then(function(res) {
            $scope.sectionArr = res;
            console.log('sections loaded...');
            console.log($scope.sectionArr);
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    function loadTables() {
        $rootScope.showDbLoading();
        var promise = dbService.loadTablesFromDB('TableInfo');
        promise.then(function(res) {
            $scope.tables = res;
            var firstSectionId;
            //status and other details load here;;

            console.log('tables loaded...');
            $rootScope.hideDbLoading();

            if ($scope.sectionArr[0]) {
                firstSectionId = $scope.sectionArr[0].sectionId;
            }

            if ($rootScope.SelSection == '0') {
                $scope.OnSectionClick(firstSectionId)
                //$scope.highlight = "favourite";
            } else {
                $scope.OnSectionClick($rootScope.SelSection);
            }

        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    console.log('entered table info ctrl')
    /* 
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        loadTables();
        console.log("table loaded in tableinfocontrol +++++++++++++++++++++++++++++");

        loadSection();
        //$scope.highlight = "1x";
        //  if ($rootScope.SelSection != '0') {
        //       $scope.OnSectionClick($rootScope.SelSection)
        //$scope.highlight = $rootScope.SelCat;
        //  }
    });
*/

    /*
    $scope.sectionsArr = [{
        sectionId: "01",
        sectionName: "1st floor",
        sectionDescription: "This is Section 01"
    }, {
        sectionId: "02",
        sectionName: "2nd floor",
        sectionDescription: "This is Section 02"
    }, {
        sectionId: "03",
        sectionName: "3rd floor",
        sectionDescription: "This is Section 03"
    }, {
        sectionId: "04",
        sectionName: "4th floor",
        sectionDescription: "This is Section 04"
    }, {
        sectionId: "05",
        sectionName: "5th floor",
        sectionDescription: "This is Section 05"
    }]

   
    $scope.tables = [{
        tableId: "01",
        tableNumber: "table01",
        tableDescription: "This is Table number 01",
        image: "/img/database.jpg",
        color:'red'
    }, {
        tableId: "02",
        tableNumber: "table02",
        tableDescription: "This is Table number 02",
        image: "/img/database.jpg",
        color:'green'
    }, {
        tableId: "03",
        tableNumber: "table03",
        tableDescription: "This is Table number 03",
        image: "/img/database.jpg",
        color:'yellow'
    }, {
        tableId: "04",
        tableNumber: "table04",
        tableDescription: "This is Table number 04",
        image: "/img/database.jpg",
        color:'green'
    }, {
        tableId: "05",
        tableNumber: "table05",
        tableDescription: "This is Table number 05",
        image: "/img/database.jpg",
        color:'yellow'
    }, {
        tableId: "06",
        tableNumber: "table06",
        tableDescription: "This is Table number 06",
        image: "/img/database.jpg",
        color:'red'
    }];
  */

    $scope.deleteTable = function(tableId) {

        console.log("Table Id:", tableId);
        $scope.TableId = tableId;
        var confirmPopup = $ionicPopup.confirm({
            title: 'The table will be permantly deleted',
            template: 'Are you sure you want to delete table?'
        });

        confirmPopup.then(function(res) {
            if (res) {

                $rootScope.showDbLoading();
                console.log("tableId 2:", tableId);
                var promise = dbService.deleteTable(tableId);
                promise.then(function(result) {
                    $rootScope.hideDbLoading();
                    loadTables();
                }, function(result) {
                    console.log(result);
                    $rootScope.hideDbLoading();
                });

            } else
                return;

        });

    }

    $scope.OnTableClick = function(table) {
        console.log(table);

        console.log("on table click");
        if ($rootScope.tableEditMode == 1) //edit or add mode;;
        {
            console.log("Mode Edit");
            $rootScope.CreateMode = 0;
            //edit mode;
            $rootScope.CurrentTable = table;
            $state.go('addEditTableInfo');

        } else {
            console.log("table loaded");
            $rootScope.selTable = table;
            $rootScope.$broadcast('tableSel', []);
            //$state.go('home');
        }
    }

    $scope.OnSectionClick = function(sectionId) {
        console.log(sectionId);
        $rootScope.SelSection = sectionId;

        $scope.highlight = sectionId;

        $rootScope.showDbLoading();
        var promise = dbService.loadTablesForSection(sectionId);
        promise.then(function(res) {
            $scope.tables = res;
            console.log('tables loaded...');
            $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            $rootScope.hideDbLoading();
        })
    }

    $scope.deleteAllTablesAndSections = function(sectionId) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Will also delete all tables in section ',
            template: 'Are you sure you want to delete Section?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('Confirm Delete');
                $rootScope.showDbLoading();
                var promise1 = dbService.deleteAllProductsInCat(sectionId);
                promise1.then(function(res) {
                    console.log(res);
                    console.log("deleted Products");
                    loadTables();
                    $scope.deleteSection(sectionId);

                }, function() {
                    console.log(res);
                    console.log("Failed to delete Tables in Section");
                    $rootScope.ShowToast("Failed to delete Tables in Section", false);
                    $rootScope.hideDbLoading();
                })

            } else
                return;

        });

    }

    $scope.deleteSection = function(sectionId) {

        var promise = dbService.deleteSection(sectionId);
        promise.then(function(res) {
            console.log(res);
            $rootScope.ShowToast("Delete Section Success", false);
            $rootScope.hideDbLoading();

            loadSection();
            $ionicHistory.goBack();
            //$state.go('home');
        }, function() {
            console.log(res);
            $rootScope.ShowToast("Failed to Delete Section", false);
            $rootScope.hideDbLoading();
        })

    }
    //$rootScope.startTimer();

}).controller('addEditTableInfoCtrl', function($scope, $ionicHistory, $rootScope, dbService, $state, $ionicPopup, $ionicModal) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        console.log('working before enter..')

        if ($rootScope.CreateMode == 0) {
            //editing;;
            console.log("Edit Table: ");
            console.log($rootScope.CurrentTable);
            $scope.tableInfoObj = $rootScope.CurrentTable;

        } else {
            $scope.tableInfoObj = {};
        }
        loadSection();
    });

    function loadSection() {
        //$rootScope.showDbLoading();
        var promise = dbService.loadSectionFromDB('TableInfoSection');
        promise.then(function(res) {
            $scope.sectionArr = res;
            //$rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            //$rootScope.hideDbLoading();
        })
    }

    $scope.onSectionSelect = function(sectionObj) {
        $scope.tableInfoObj.tableSectionName = sectionObj.sectionName;
        $scope.tableInfoObj.tableSectionId = sectionObj.sectionId;
        //$scope.$apply();
        $scope.sectionModal.hide();
    }

    $scope.addNewSection = function(newSectionName) {
        $rootScope.cameFromTable = true;
        $state.go('addEditTableSection');
        $scope.sectionModal.hide();
    }

    $ionicModal.fromTemplateUrl('templates/tableSectionModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.sectionModal = modal;
    })
    $scope.openSectionModal = function() {
        console.log('open sectionModal')
        $scope.sectionModal.show();
    }

    $scope.saveTableInfo = function(tableInfoObj) {
        console.log(tableInfoObj.tableNumber);

        if (tableInfoObj.tableNumber == undefined || tableInfoObj.tableNumber == "") {
            $rootScope.ShowToast("Please Enter table number", false);
            console.log('Please Enter table number');
            return false
        }

        if (tableInfoObj.tableNumber.length > 10) {
            $rootScope.ShowToast("Table number should contain max 10 characters", false);
            console.log('Table number should contain max 10 characters');
            return false
        }

        if (tableInfoObj.tableDescription == undefined) {
            $scope.tableInfoObj.tableDescription = "";
        }

        if (tableInfoObj.tableDescription.length > 25) {
            $rootScope.ShowToast("Table Description should contain max 25 characters", false);
            console.log('Table Description should contain max 25 characters');
            return false
        }

        if (tableInfoObj.tableCharges == undefined || tableInfoObj.tableCharges == "") {
            tableInfoObj.tableCharges = 0;
        }

        if (typeof tableInfoObj.tableCharges !== 'number') {
            $rootScope.ShowToast("Invalid table charge", false);
            console.log('Invalid table charge...');
            return false
        }

        if ((typeof tableInfoObj.tableCapacity !== 'number') || (tableInfoObj.tableCapacity % 1 !== 0)) {
            $rootScope.ShowToast("Invalid table capacity", false);
            console.log('Invalid table capacity...');
            return false
        }

        if (tableInfoObj.tableCapacity > 25 || tableInfoObj.tableCapacity < 0) {
            $rootScope.ShowToast("table capacity should be atleast 1 and less than 25", false);
            console.log('table capacity should be atleast 1 and less than 25...');
            return false
        }

        if (tableInfoObj.tableCapacity == undefined) {
            tableInfoObj.tableCapacity = null;
        }

        if (typeof tableInfoObj.tableSectionName == undefined || tableInfoObj.tableSectionName == "") {
            $rootScope.ShowToast("Select table section name", false);
            console.log('select table section name...');
            return false
        }

        if ($rootScope.CreateMode == 0) {
            console.log("Edit Product");
            editTable(tableInfoObj);
        } else {
            console.log("Add Product");
            addNewTable(tableInfoObj);
        }
    }

    function addNewTable(tableInfoObj) {
        console.log('entered addNewTable()..');

        $rootScope.showDbLoading();
        var promise = dbService.addNewTable(tableInfoObj.tableNumber, tableInfoObj.tableDescription, tableInfoObj.tableSectionId, tableInfoObj.tableSectionName, tableInfoObj.tableCharges, tableInfoObj.tableCapacity);
        promise.then(function(result) {
            console.log(result);
            console.log("Table Added Sucessfully");
            $rootScope.ShowToast("Table Added Sucessfully", false);
            //  $rootScope.Products.push($scope.newProduct);
            $scope.tableInfoObj = {};
            $rootScope.hideDbLoading();

            //confirmation popup
            var confirmPopup = $ionicPopup.confirm({
                title: 'Add More Tables ',
                template: 'Do you want to add more Tables?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    console.log('add more Tables');
                } else {
                    console.log('No');
                    $rootScope.$broadcast('tableChange', []);
                    // $ionicHistory.goBack();
                    $state.go('home');
                }
            });
        }, function(result) {
            console.log(result);
            console.log("Unable to add Tables");
            $rootScope.ShowToast("Unable to add Tables", false);
            $rootScope.hideDbLoading();
        })

    }

    function editTable(tableInfoObj) {
        $rootScope.showDbLoading();
        var promise = dbService.editTable(tableInfoObj.tableId, tableInfoObj.tableNumber, tableInfoObj.tableDescription, tableInfoObj.tableSectionId, tableInfoObj.tableSectionName, tableInfoObj.tableCharges, tableInfoObj.tableCapacity);
        promise.then(function(result) {
            console.log(result);
            console.log("Table Edited Sucessfully");
            $rootScope.hideDbLoading();
            $rootScope.ShowToast("Table Edited Sucessfully", false);
            $rootScope.$broadcast('tableChange', []);
            //  $ionicHistory.goBack();
            $state.go('home');
        }, function(result) {
            console.log(result);
            $rootScope.ShowToast("Unable to Edit Table", false);
            console.log("Unable to Edit Table");
            $rootScope.hideDbLoading();
        })
    }

    $scope.closeView = function() {
        $ionicHistory.goBack();
    }
}).controller('addEditSectionCtrl', function($scope, $rootScope, dbService, $ionicHistory, $ionicPopup, $state) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $scope.tableInfoSection = {
            sectionName: "",
            sectionDescription: ""
        };
        if ($rootScope.CreateMode != 1) {
            getSection()
        }
    });

    function getSection() {
        // $rootScope.showDbLoading();
        var promise = dbService.GetSectionById($rootScope.SelSection);
        promise.then(function(res) {
            if (res.sectionId != "Failed")
                $scope.tableInfoSection = res;

            //   $rootScope.hideDbLoading();
        }, function(res) {
            console.log(res);
            //    $rootScope.hideDbLoading();
        })
    }

    $scope.OnSave = function() {
        if ($scope.tableInfoSection.sectionName == undefined || $scope.tableInfoSection.sectionName == "") {
            $rootScope.ShowToast("Please enter section name", false);
            console.log('Please enter section name');
            return false
        }

        if ($scope.tableInfoSection.sectionName.length > 15) {
            $rootScope.ShowToast("section name should be less than 15 characters", false);
            console.log('section name should be less than 15 characters');
            return false
        }

        if ($scope.tableInfoSection.sectionDescription == undefined) {
            $scope.tableInfoSection.sectionDescription = "";
        }

        if ($scope.tableInfoSection.sectionDescription.length > 25) {
            $rootScope.ShowToast("Section description should be less than 25 characters", false);
            console.log('Section description should be less than 25 characters');
            return false
        }

        if ($rootScope.CreateMode == 1)
            $scope.addNewSection();
        else
            $scope.saveEditedSection();
    }

    $scope.saveEditedSection = function() {
        if ($scope.tableInfoSection.sectionName == undefined || $scope.tableInfoSection.sectionName.length < 1) {
            $rootScope.ShowToast("Enter Section Name", false);
            console.log('Enter Section Name');
            return false;
        }

        if ($scope.tableInfoSection.sectionName != '') {
            console.log($scope.tableInfoSection.sectionName);

            $rootScope.showDbLoading();
            var promise = dbService.editSection($scope.tableInfoSection.sectionId, $scope.tableInfoSection.sectionName, $scope.tableInfoSection.sectionDescription);
            promise.then(function(res) {
                console.log(res);
                $rootScope.hideDbLoading();
                $scope.tableInfoSection = {
                    sectionName: "",
                    sectionDescription: ""
                };
                $rootScope.$broadcast('tableChange', []);
                //$ionicHistory.goBack();
                $state.go('home');
            }, function() {
                console.log(res);
                $rootScope.hideDbLoading();
            })
        } else {
            console.log('enter name and description...');
            //$scope.newNameDescWarningMsg = true;
        }
    }

    $scope.tableInfoSection = {
        sectionName: "",
        sectionDescription: ""
    };

    $scope.addNewSection = function() {
        console.log('I am in add New Section')
        if ($scope.tableInfoSection.sectionName == undefined || $scope.tableInfoSection.sectionName.length < 1) {
            $rootScope.ShowToast("Enter Section Name", false);
            console.log('Enter Section Name');
            return false;
        }

        $rootScope.showDbLoading();
        var promise = dbService.addNewSection($scope.tableInfoSection.sectionName, $scope.tableInfoSection.sectionDescription);
        promise.then(function(result) {
            console.log(result);
            $rootScope.hideDbLoading();
            //   $rootScope.categoryArr.push($scope.newCategory);
            $scope.tableInfoSection = {
                sectionName: "",
                sectionDescription: ""
            };

            if ($rootScope.cameFromTable) {
                $rootScope.cameFromTable = false;
                $rootScope.$broadcast('tableChange', []);
                $ionicHistory.goBack();
            } else {
                //confirmation popup
                $rootScope.ShowToast("Section Added Sucessfully", false);
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Add More Section ',
                    template: 'Do you want to add more Section?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        console.log('add more Section');
                        $state.reload();
                    } else {
                        console.log('No');
                        $rootScope.$broadcast('tableChange', []);
                        //$ionicHistory.goBack();
                        $state.go('home');
                    }
                });
            }
        }, function() {
            console.log("Failed to Add Section");
            $rootScope.ShowToast("Failed to Add Section", false);
            $rootScope.hideDbLoading();
        });
    }

}).controller('searchProductsCtrl', function($scope, dbService, $rootScope) {

    console.log('entered search Products Ctrl')
    $rootScope.searchObj = {};
    $scope.searchChange = function() {
        console.log('entered searchChange function');
        $rootScope.searchedResults = [];
        if ($rootScope.searchObj.pattern) {
            var promise = dbService.loadProductsForSearchPattern($rootScope.searchObj.pattern);
            promise.then(function(res) {
                $rootScope.searchedResults = res;
                console.log(res);
            }, function() {
                console.log('unable to search...')
            })
        }
    }
    ;

    $scope.resetSearch = function() {
        console.log('I am in reset');
        $rootScope.searchObj.pattern = "";
        $rootScope.searchedResults = [];
    }

    $scope.onClickSearchProduct = function(product) {

        $rootScope.$broadcast('OnClickSearchItem', {
            prod: product
        });
    }
}).controller('shopNameChangeCtrl', function($scope, $rootScope, $state) {
    console.log('entered shopNameChangeCtrl ');
    $scope.shopNames = [];
    $scope.selShopDB = "newPayUPos1.db";
   // $scope.selShopDB = "newPayUPos1.db";
  
    jQuery.getJSON('json/ShopNames.json', function(data) { 
        $scope.shopNames = data.ShopNames;
    });

    $scope.changeShopName = function(shop) {
        $rootScope.$broadcast('DbChange', []);
        console.log(shop.dbName);
        console.log(shop.tempName);
        $rootScope.openDb(shop.dbName, shop.tempName);
        console.log('reload db');
        $state.reload();
    }
})
