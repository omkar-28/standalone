!(function (document, script, link) {
  var appjs, angularjs, div;
  var scriptJs = document.getElementsByTagName(script)[0];
  var stylelink = document.getElementsByTagName("head")[0];

  var style = document.createElement(link);
  style.rel = "stylesheet";
  style.type = "text/css";
  style.href = "/assets/css/dbr-page.css";
  stylelink.appendChild(style);

  //Load The Jquery SCript, if not already Loaded
  if (typeof jQuery === "undefined") {
    jqueryScript = document.createElement(script);
    jqueryScript.src = "/assets/js/jquery.min.js";
    scriptJs.parentNode.insertBefore(jqueryScript, scriptJs);
  }

  //Load The Jquery SCript, if not already Loaded
  if (typeof jQuery === "undefined") {
    Bootscript = document.createElement(script);
    Bootscript.src = "/assets/js/bootstrap.min.js";
    scriptJs.parentNode.insertBefore(Bootscript, scriptJs);
  }

  // load the AngularJS framework, if not already loaded
  if (typeof angular === "undefined") {
    angularjs = document.createElement(script);
    angularjs.src =
      "https://ajax.googleapis.com/ajax/libs/angularjs/1.8.0/angular.min.js";
    scriptJs.parentNode.insertBefore(angularjs, scriptJs);
    angularjs.addEventListener("load", loadScript, false);
  }

  // add a place for the AngularJS application to the div
  div = document.getElementById("dbr");
  div.setAttribute("ng-controller", "dbrCtrl");
  div.setAttribute("scroll", "");

  // load the AngularJS application
  function loadScript() {
    appjs = document.createElement(script);
    appjs.src = "/assets/js/ng-infinite-scroll.min.js";
    scriptJs.parentNode.insertBefore(appjs, scriptJs);
  }
  setTimeout(function () {
    loadLogic();
  }, 1000);
})(document, "script", "link");

function loadLogic() {
  var versionValue, versionValueJoin;
  var totalwidth, constVal, selectCat, seeAllwidth;
  var checkWid;
  var win = $(window).width();

  var element = document.querySelector("#dbr");
  element.setAttribute("ng-app", "dbr-app");
  angular.element(element).ready(function () {
    $(document).ready(function () {
      //Get he outer hight of the element
      var win = $(window).width();
      //Get height of the left category rails
      var categoryHeight = $(".category_list").height() + 800;

      var catlist = $("#categories").offset().top;
      var scrollPosition = $(window).scrollTop();
      //Scroll category pill to left on load
      $(".contents,.category").scrollLeft(0);

      //Adding class based on the window resize
      //Hide goto top based on the window resize
      var alterClass = function () {
        var ww = document.body.clientWidth;
        checkWid = ww;
        if (ww < 1025) {
          $("body").removeClass("deskTop");
        } else if (ww >= 1025) {
          $("body").addClass("deskTop");
          $(window).scroll(function () {
            var scrollPosition = $(window).scrollTop();
            if (categoryHeight <= scrollPosition) {
              $("#toTop").fadeIn();
            } else {
              $("#toTop").fadeOut();
            }
          });
        }
      };
      $(window).resize(function () {
        alterClass();
      });
      //Fire it when the page first loads:
      alterClass();

      $(".see_all").addClass("active_all");
      //Rest the category pills to left
      $(".see_all").click(function () {
        $(".category").scrollLeft(0);
        return false;
      });

      //Adding sticky class based on the position of window scroll
      $(window).scroll(function () {
        var scrollPosition = $(window).scrollTop();
        if (scrollPosition >= catlist) {
          $(".category_list, .desktopView").addClass("catSticky");
          $("#container").addClass("anchor");
        } else {
          $(".category_list, .desktopView").removeClass("catSticky");
          $("#container").removeClass("anchor");
        }
      });

      //Goto top click function
      $("#toTop").on("click", function (e) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: $("#categories").offset().top,
          },
          500
        );
      });
    });

    var app = angular.module("dbr-app", ["infinite-scroll"]);

    //Custome directive to output the DBR Contents
    app.directive("dbrContent", [
      function ($compile) {
        return {
          restrict: "A",
          transclude: true,
          template:
            '<div class="wrapper"><div id="container"><div class="benefit_section"><div id="categories" class="container-fluid container-xl"><div class="row align-items-start stickyScroll"><div class="desktopView desktopCat col-sm-12 col-md-12 col-lg-3 col-xl-3"><div class="category_list desktopCategory"><div class="clear_filter"><a class="view_all" ng-click="view($event)">View All {{ totalOffers }} Benefits</a></div><h3 class="filter_title">Filter by Category</h3><h2 class="loader">Loading...</h2><ul class="category" ng-cloak><li><div class="clear_filter"><a class="see_all" ng-click="view($event)">See All</a></div></li><li ng-repeat="category in categories"><a class="category_title deskcategory {{ category.name }}" id="{{ category.title | strReplace }}" data-formelementid="MEM-BEN-BTN-MOJ-MOM-CAT-{{ category.title | strReplace }}" data-categoryid="{{ category.name }}" ng-click="gtagDbrCategory(category.title); SelTopCategory(category.title, $event, this); ShowId($event)">{{ category.title }}<span>({{ countsCat[category.title] }})</span></a><ul class="dropdown {{ category.title | strReplace }}" ng-show="showContent"><li class="dropdown_catg deskcategory" id="{{ categoryDrop.title | strReplace }}" ng-repeat="categoryDrop in category.second_level_tags" data-formelementid="MEM-BEN-BTN-MOJ-MOM-CAT-{{ categoryDrop.title | strReplace }}" data-categoryid="{{ category.name }}" data-subcategoryid="{{ categoryDrop.deeplink_param_value }}" ng-click="gtagDbrCategory(categoryDrop.title); SelSubCategory(categoryDrop.title, category.title, $event); ShowId($event)" ng-model="categoryDrop.title">{{ categoryDrop.title }}</li></ul></li></ul></div></div><div class="right_cont col-sm-12 col-md-12 col-lg-9 col-xl-9" infinite-scroll="loadMore()" infinite-scroll-distance="-0.5" infinite-scroll-listen-for-event="loadMore"><div class="display_cat"><h2 class="loader">Loading...</h2><div class="row cartBox" ng-cloak><div class="col-sm-6 col-md-4 col-lg-4 col-xl-4 d-flex" ng-repeat="offers in sortedAllOffers | limitTo : limit | filter:offerFilter as filteredOffers"><div class="card catg"><div class="cardClick momentum" data-formelementid="MEM-BEN-BTN-MOJ-MOM-CLK-{{ offers.category.replace(\'&\',\'and\') | trimSpace | lowercase }}-{{ offers.master_brand }}" data-categoryid="{{ offers.category_list }}" data-subcategoryid="{{ offers.subcategory_list }}" data-dbrofferid="{{ offers.dbr_offer_id }}" ng-click="openOfferModal(offers)"><div class="card-img-top" ng-if="offers.provider_logo !== \'\'"><img src="https://d1rw5d3ceg0ac8.cloudfront.net/?width=324&imageUrl=https://www.aarp.org{{ offers.provider_logo }}" width="100%" aria-label="offers" aria-hidden="true" id="a{{ offers.dbr_offer_id }}" alt="{{ offers.image_alt_text }}"/></div><div class="card-img-top" ng-if="offers.provider_logo === \'\'"><div class="prod_img" style="background-image: url(\'https://d1rw5d3ceg0ac8.cloudfront.net/?width=324&imageUrl=https://www.aarp.org{{ offers.image_url }}\')"></div></div><div class="card-body" data-offer-type="{{ offers.dbr_offer_type }}"><h5 class="card-title">{{ offers.offer_short_description }}</h5><p class="card-text">{{ offers.source_name }}</p></div><div class="card-button card-btn">Learn More</div></div></div></div></div></div></div></div></div></div></div><modal-dialog model="offerDialog"></modal-dialog><a id="toTop">Go To Top</a></div>',
        };
      },
    ]);

    //DBR LOGICS START BELOW

    // Merge two arrays with alternative values
    function splicer(array, element, index) {
      array.splice(index * 2, 0, element);
      return array;
    }

    function orderAlternatively(array1, array2) {
      return array1.reduce(splicer, array2.slice());
    }

    //Initialize DBR App
    //   var dbrMod = angular.module("dbr-app", ["infinite-scroll"]);

    //Dbr modal popup function
    var DialogModel = function () {
      this.visible = false;
    };
    DialogModel.prototype.open = function (offer) {
      this.offer = offer;
      this.visible = true;
    };

    //Custome directive to output the DBR Contents
    app.directive("dbrContent", [
      function ($compile) {
        return {
          restrict: "E",
          transclude: true,
          template:
            '<div class="wrapper"><div id="container"><div class="benefit_section"><div id="categories" class="container-fluid container-xl"><div class="row align-items-start stickyScroll"><div class="desktopView desktopCat col-sm-12 col-md-12 col-lg-3 col-xl-3"><div class="category_list desktopCategory"><div class="clear_filter"><a class="view_all" ng-click="view($event)">View All {{ totalOffers }} Benefits</a></div><h3 class="filter_title">Filter by Category</h3><h2 class="loader">Loading...</h2><ul class="category" ng-cloak><li><div class="clear_filter"><a class="see_all" ng-click="view($event)">See All</a></div></li><li ng-repeat="category in categories"><a class="category_title deskcategory {{ category.name }}" id="{{ category.title | strReplace }}" data-formelementid="MEM-BEN-BTN-MOJ-MOM-CAT-{{ category.title | strReplace }}" data-categoryid="{{ category.name }}" ng-click="gtagDbrCategory(category.title); SelTopCategory(category.title, $event, this); ShowId($event)">{{ category.title }}<span>({{ countsCat[category.title] }})</span></a><ul class="dropdown {{ category.title | strReplace }}" ng-show="showContent"><li class="dropdown_catg deskcategory" id="{{ categoryDrop.title | strReplace }}" ng-repeat="categoryDrop in category.second_level_tags" data-formelementid="MEM-BEN-BTN-MOJ-MOM-CAT-{{ categoryDrop.title | strReplace }}" data-categoryid="{{ category.name }}" data-subcategoryid="{{ categoryDrop.deeplink_param_value }}" ng-click="gtagDbrCategory(categoryDrop.title); SelSubCategory(categoryDrop.title, category.title, $event); ShowId($event)" ng-model="categoryDrop.title">{{ categoryDrop.title }}</li></ul></li></ul></div></div><div class="right_cont col-sm-12 col-md-12 col-lg-9 col-xl-9" infinite-scroll="loadMore()" infinite-scroll-distance="-0.5" infinite-scroll-listen-for-event="loadMore"><div class="display_cat"><h2 class="loader">Loading...</h2><div class="row cartBox" ng-cloak><div class="col-sm-6 col-md-4 col-lg-4 col-xl-4 d-flex" ng-repeat="offers in sortedAllOffers | limitTo : limit | filter:offerFilter as filteredOffers"><div class="card catg"><div class="cardClick momentum" data-formelementid="MEM-BEN-BTN-MOJ-MOM-CLK-{{ offers.category.replace(\'&\',\'and\') | trimSpace | lowercase }}-{{ offers.master_brand }}" data-categoryid="{{ offers.category_list }}" data-subcategoryid="{{ offers.subcategory_list }}" data-dbrofferid="{{ offers.dbr_offer_id }}" ng-click="openOfferModal(offers)"><div class="card-img-top" ng-if="offers.provider_logo !== \'\'"><img src="https://d1rw5d3ceg0ac8.cloudfront.net/?width=324&imageUrl=https://www.aarp.org{{ offers.provider_logo }}" width="100%" aria-label="offers" aria-hidden="true" id="a{{ offers.dbr_offer_id }}" alt="{{ offers.image_alt_text }}"/></div><div class="card-img-top" ng-if="offers.provider_logo === \'\'"><div class="prod_img" style="background-image: url(\'https://d1rw5d3ceg0ac8.cloudfront.net/?width=324&imageUrl=https://www.aarp.org{{ offers.image_url }}\')"></div></div><div class="card-body" data-offer-type="{{ offers.dbr_offer_type }}"><h5 class="card-title">{{ offers.offer_short_description }}</h5><p class="card-text">{{ offers.source_name }}</p></div><div class="card-button card-btn">Learn More</div></div></div></div></div></div></div></div></div></div></div><modal-dialog model="offerDialog"></modal-dialog><a id="toTop">Go To Top</a></div>',
        };
      },
    ]);

    //Dbr modal popup custom directive
    app.directive("modalDialog", [
      function () {
        return {
          restrict: "E",
          scope: {
            model: "=",
          },
          transclude: true,
          template:
            '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg container-fluid"> <div class="row justify-content-center h-100"> <div class="col-sm-12 col-xl-8"> <div class="modal-content"> <div class="modal-header"> <p>Details</p><button type="button" class="close" data-dismiss="modal" aria-label="Close" > <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body col-sm-12 col-xl-8 align-self-center"> <div class="offer_details"> <div id="tab-1" class="tab-content current"> <h5>{{model.offer.category}}</h5> <h4>{{model.offer.source_name}}</h4> <h2>{{model.offer.offer_short_description}}</h2> <p class="offer-desc">{{model.offer.offer_title}}</p><img src="https://www.aarp.org" width="100%" alt="{{model.offer.image_alt_text}}" id="modal-offer-img"/> <script type="text/javascript">$("#modal-offer-img").attr( "src", "https://d1rw5d3ceg0ac8.cloudfront.net/?width=324&imageUrl=https://www.aarp.org" + \'{{model.offer.image_url.replace(" ", "")}}\' ); </script> </div></div><div class="join-details"> <div class="providers"> <a href="https://appsec.aarp.org/mem/join" target="blank" data-formelementid="MEM-BEN-BTN-MOJ-MOM-LRN-learn-more-{{model.offer.master_brand}}" class="joinNow mom-card" >Access Now</a > <p> You\'ll leave AARP.org and go to the website of a trusted provider. The provider\'s terms, conditions, and policies apply. </p></div></div></div></div></div></div></div></div>',
          link: function (scope, element) {
            scope.$watch("model.visible", function (newValue) {
              var modalElement = element.find(".modal");
              modalElement.modal(newValue ? "show" : "hide");
            });

            element.on("shown.bs.modal", function () {
              scope.$apply(function () {
                scope.model.visible = true;
              });
            });

            element.on("hidden.bs.modal", function () {
              scope.$apply(function () {
                scope.model.visible = false;
              });
            });
          },
        };
      },
    ]);

    app.directive("dynamicCtrl", [
      "$compile",
      "$parse",
      function ($compile, $parse) {
        return {
          restrict: "A",
          terminal: true,
          priority: 100000,
          link: function (scope, elem) {
            var name = $parse(elem.attr("dynamic-ctrl"))(scope);
            elem.removeAttr("dynamic-ctrl");
            elem.attr("ng-controller", name);
            $compile(elem)(scope);
          },
        };
      },
    ]);

    //Filter function to trim spaces
    app.filter("trimSpace", function () {
      return function (value) {
        return !value ? "" : value.replace(/ /g, "");
      };
    });

    // String replcae filter for " & " -> "and", ", " -> "__", " " -> "_"
    app.filter("strReplace", function () {
      return function (catText) {
        var catclass = catText.replace(/\&/g, "and");
        var catclass = catclass.replace(/[^A-Z0-9]/gi, "_");
        return catclass.toLowerCase();
      };
    });

    //DBR controller initialize
    app.controller("dbrCtrl", [
      "$scope",
      "$http",
      "$filter",
      function ($scope, $http, $filter) {
        $scope.oneAtATime = true;
        $scope.offerDialog = new DialogModel();

        //Helper function for random output
        $scope.random = function () {
          return 0.5 - Math.random();
        };

        //Ajax callto fetch the data from the DBR Json
        $http({
          method: "GET",
          url:
            "https://ddxp5xijf3rk2.cloudfront.net/json/dbr/memberbenefits.json",
          beforeSend: function () {
            $(".loader").show();
          },
        }).then(
          function (response) {
            $(".loader").hide();
            $scope.categories = response.data.all_offers.top_level_tags;
            $scope.catgIcon = response.data.ui_content.catIcon;
            $scope.allCategories = []; //All vategory titles
            $scope.allOffers = []; // Storing all the offers
            $scope.socialOffers = []; //store offers related to Social
            $scope.discountOffers = []; //store offers related to Discounted offer

            ($scope.remainingOffers = []), ($scope.sortedAllOffers = []); // Storing offers after sorting
            ($scope.countDt = 0), ($scope.countSc = 0); //Global initial count value
            $scope.selCategoriesTop = []; // Store al the title of top category
            $scope.limit = 15; //Set the initial limit to display 15 offers on page load

            $scope.socialCount = 0;
            $scope.discountCount = 0;

            var offersCategoryCount = []; //Empty array to store offers total counts

            var countSlp,
              countOffer = 0;

            // Storing top and second level offers from json response to an array
            //Loop through top_level tags from JSON
            angular.forEach($scope.categories, function (tlt, tltKey) {
              $scope.allCategories.push(tlt.title); //Psuhing top level titles to array
              if (tlt.offers && tlt.offers.length) {
                //Foreach array of top level offer
                angular.forEach(tlt.offers, function (tltOffer, tlpOfferkey) {
                  tltOffer.category = tlt.title;
                  offersCategoryCount.push(tlt.title); //Store the title to get count of offers
                  $scope.allOffers.push(tltOffer); //Storing top level offers
                });
              }

              //Loop through second_level_tags tags from JSON
              angular.forEach(tlt.second_level_tags, function (slt, sltKey) {
                $scope.selCategoriesTop.push(slt.title); //Psuhing second level titles to array
                //Foreach array of second level offer
                angular.forEach(slt.offers, function (offer, offerKey) {
                  offer.category = tlt.title;
                  offer.category_sub = slt.title;
                  offersCategoryCount.push(tlt.title); //Store the title to get count of offers
                  $scope.allOffers.push(offer); //Storing top level offers
                });
              });
            });

            //To get the total counts of the offers present for the top and sub categories
            $scope.countsCat = [];
            $.each(offersCategoryCount, function (key, value) {
              var totalCategoryCount = $.grep(offersCategoryCount, function (
                elem
              ) {
                return elem === value;
              }).length;
              $scope.countsCat[value] = ("0" + totalCategoryCount).slice(-2);
            });

            //Check for the mobile width to hide the top categories and change the names of the the categories
            angular.element(document).ready(function () {
              if (win <= 767 || checkWid < 767) {
                $(
                  "#community, #travel, #insurance, .health_and_wellness #medicare_eligible, #shopping_and_groceries, #community"
                ).hide();
                $(
                  "#community, #travel, #insurance, .health_and_wellness #medicare_eligible, #shopping_and_groceries, #community"
                ).removeClass("deskcategory");
                $("#healthcare").text("Healthcare Insurance");
                $(".insurance #medicare_eligible").text(
                  "Medicare Eligible Insurance"
                );
                $("#pet").text("Pet Insurance");
                $("#vehicle__life_and_property").text("Other Insurance");
                $("#home__real_estate_and_technology").text(
                  "Home & Technology"
                );
              } else {
                $(
                  "#community, #travel, #insurance, .health_and_wellness #medicare_eligible, #shopping_and_groceries, #community"
                ).show();
              }
            });

            // All offers shuffled
            $scope.allOffers = shuffle($scope.allOffers);

            //Global variable count
            $scope.offerCount = $scope.allOffers.length;
            $scope.totalOffers = $scope.allOffers.length;

            // Sorting all offers as first 9 social, next 7 discount and then all remaining offers
            angular.forEach($scope.allOffers, function (offer, offerKey) {
              if (
                offer.dbr_offer_type == "discount" &&
                offer.category_list !== "travel" &&
                offer.category_list !== "entertainment"
              ) {
                $scope.discountOffers.push(offer);
                $scope.countDt++;
              } else if (
                offer.dbr_offer_type == "socialmission" &&
                offer.category_list !== "travel" &&
                offer.category_list !== "entertainment"
              ) {
                $scope.socialOffers.push(offer);
                $scope.countSc++;
              } else {
                $scope.remainingOffers.push(offer);
              }
            });

            $scope.sortedAllOffers = orderAlternatively(
              $scope.socialOffers,
              $scope.discountOffers
            );

            //Function to shuufle the array
            function shuffle(offerArr) {
              var a = offerArr.length,
                t,
                i;
              while (a) {
                i = Math.floor(Math.random() * a--);
                t = offerArr[a];
                offerArr[a] = offerArr[i];
                offerArr[i] = t;
              }
              return offerArr;
            }

            //On click category buttons scroll page to top
            $scope.funcScroll = function () {
              var top_div = $("#categories").offset().top - 2;
              // var topScroll = top_div - $("body").outerHeight(true);
              $("html,body").animate({
                scrollTop: top_div,
              });
            };

            // On click category pills filter the offers and start from the beginning of the offers
            $scope.funcScrollCat = function () {
              $(".right_cont .display_cat").fadeOut(100).delay(100);
              var top_div = $("#categories").offset().top;
              // var topScroll = top_div - $(".desktopView").outerHeight(true);
              $("html,body").animate(
                {
                  scrollTop: top_div,
                },
                100
              );
              $(".right_cont .display_cat").fadeIn(100);
            };

            $scope.selCategory = "";
            $scope.showContent = false;
            var lastActiveTab = false;

            // Reset Category, remove active classes, reset active category tabs on left
            $(".clear_filter").hide();
            $scope.view = function (e) {
              $(".category_title").removeClass("active_cat");
              $(".dropdown_catg").removeClass("active_sub");
              $(".card").removeClass("active_Topcat");
              $(event.target).addClass("active_all");
              $scope.sortedAllOffers = orderAlternatively(
                $scope.socialOffers,
                $scope.discountOffers
              );
              $scope.selCategory = "";
              lastActiveTab.showContent = false;
              $scope.limit = 15;
              $scope.offerCount = $scope.allOffers.length;
              $(".clear_filter").hide();
              $(".filter_title").show();
              if (checkWid < 1025 || win < 1025) {
                $scope.funcScrollCat();
              }
            };

            //Lazy Loading content on scroll
            $scope.loadMore = function () {
              $scope.limit += 15;
            };

            //filtering function for the offer based on the Topcategory selections
            $scope.SelTopCategory = function (categoryTop, event, itemScope) {
              var categoryTops = $filter("strReplace")(
                categoryTop
              ).toLowerCase();

              $(".card").removeClass("active_Topcat");
              itemScope.showContent = !itemScope.showContent;

              var catclass = $filter("strReplace")(categoryTop).toLowerCase();
              //itemScope.showContent = !itemScope.showContent;
              //Toggle subcategory category buttons, open only active category
              if (lastActiveTab) {
                if (lastActiveTab !== itemScope) {
                  lastActiveTab.showContent = false;
                }
              }
              if (itemScope.showContent) {
                lastActiveTab = itemScope;
              }

              $(".clear_filter").show(); //Show View All 275 Benefits
              $(".filter_title").hide(); //Hide title from left rail

              $scope.limit = 500; //Set limit to 500 to display all the offers repect to the slected category

              searchCategory = categoryTop;
              $(".see_all").removeClass("active_all");
              $(".category_title").removeClass("active_cat");
              $(".dropdown_catg").removeClass("active_sub");
              $(event.target).addClass("active_cat");

              //Scroll to top in desktop width when user clicks on category
              if ($("body").hasClass("deskTop")) {
                $scope.funcScroll();
              }

              //Scroll to top in mobile width when user clicks on category
              if (checkWid < 1025) {
                if ($("#container").hasClass("anchor")) {
                  $scope.funcScrollCat();
                }
              }

              if (win <= 767 || checkWid <= 767) {
                $(".see_all").removeClass("active_all");
                $("." + categoryTops).addClass("active_cat");
                $(".dropdown").removeClass("active_cat");
              }

              $scope.selCategory = categoryTop; //Store selected category
              $scope.socialCount = 0;
              $scope.discountCount = 0;
              $scope.socialOffersFiltered = [];
              $scope.discountOffersFiltered = [];
              $scope.sortedAllOffers = $scope.socialOffers
                .concat($scope.discountOffers)
                .concat($scope.remainingOffers); //Storing the filtered offers
            };

            //filtering function for the offer based on the subcategory selections
            $scope.SelSubCategory = function (
              categoryDrop,
              topCategory,
              event
            ) {
              var categorySub = $filter("strReplace")(
                categoryDrop
              ).toLowerCase();
              if (event.originalEvent) {
                $(".card").removeClass("active_Topcat");
              }

              $scope.limit = 500; //Set limit to 500 to display all the offers repect to the slected category
              searchCategory = categoryDrop;

              if (win <= 1025) {
                $(".dropdown").removeClass("active_cat");
                $(".category_title").removeClass("active_cat");
                $(".see_all").removeClass("active_all");
                $(".dropdown_catg").removeClass("active_sub");
              }

              $("#" + categorySub).addClass("active_sub");
              $(".dropdown").removeClass("active_cat");
              $(event.target).addClass("active_sub");
              $(event.target).siblings().removeClass("active_sub");

              //Scroll to top in desktop width when user clicks on category
              if ($("body").hasClass("deskTop")) {
                $scope.funcScroll();
              }

              //Scroll to top in mobile width when user clicks on category
              if (checkWid < 1025) {
                if ($("#container").hasClass("anchor")) {
                  $scope.funcScrollCat();
                }
              }

              $scope.selCategory = topCategory + "-" + categoryDrop;
              $scope.socialCount = 0;
              $scope.discountCount = 0;
              $scope.socialOffersFiltered = [];
              $scope.discountOffersFiltered = [];
              $scope.sortedAllOffers = $scope.socialOffers
                .concat($scope.discountOffers)
                .concat($scope.remainingOffers); //Storing the final filtered offers
            };

            //Filtering offers based on the user click selected category
            $scope.offerFilter = function (offers) {
              if ($scope.selCategory) {
                if ($scope.selCategory.indexOf("-") >= 0) {
                  var topCat = $scope.selCategory.substr(
                    0,
                    $scope.selCategory.indexOf("-")
                  );
                  if (
                    offers.category == $scope.selCategory.split("-")[0] &&
                    offers.category_sub == $scope.selCategory.split("-")[1]
                  ) {
                    angular.forEach(offers, function (value, key) {
                      if (key == "dbr_offer_type" && value == "socialmission") {
                        $scope.socialOffersFiltered.push(offers);
                      } else if (
                        key == "dbr_offer_type" &&
                        value == "discount"
                      ) {
                        $scope.discountOffersFiltered.push(offers);
                      }
                    });
                    $scope.socialOffersFiltered = $scope.socialOffersFiltered.filter(
                      function (item, i, ar) {
                        return ar.indexOf(item) === i;
                      }
                    );
                    $scope.discountOffersFiltered = $scope.discountOffersFiltered.filter(
                      function (item, i, ar) {
                        return ar.indexOf(item) === i;
                      }
                    );
                    if ($scope.socialOffersFiltered.length == 1) {
                      $scope.sortedAllOffers = orderAlternatively(
                        $scope.discountOffersFiltered,
                        $scope.socialOffersFiltered
                      );
                    } else {
                      $scope.sortedAllOffers = orderAlternatively(
                        $scope.socialOffersFiltered,
                        $scope.discountOffersFiltered
                      );
                    }

                    //Update Total count with respect to Second level filtering
                    $scope.offerCount = $scope.sortedAllOffers.length;
                    return $scope.sortedAllOffers;
                  }
                } else {
                  if (offers.category == $scope.selCategory) {
                    angular.forEach(offers, function (value, key) {
                      if (key == "dbr_offer_type" && value == "socialmission") {
                        $scope.socialOffersFiltered.push(offers);
                      } else if (
                        key == "dbr_offer_type" &&
                        value == "discount"
                      ) {
                        $scope.discountOffersFiltered.push(offers);
                      }
                    });
                    $scope.socialOffersFiltered = $scope.socialOffersFiltered.filter(
                      function (item, i, ar) {
                        return ar.indexOf(item) === i;
                      }
                    );
                    $scope.discountOffersFiltered = $scope.discountOffersFiltered.filter(
                      function (item, i, ar) {
                        return ar.indexOf(item) === i;
                      }
                    );
                    if ($scope.socialOffersFiltered.length == 1) {
                      $scope.sortedAllOffers = orderAlternatively(
                        $scope.discountOffersFiltered,
                        $scope.socialOffersFiltered
                      );
                    } else {
                      $scope.sortedAllOffers = orderAlternatively(
                        $scope.socialOffersFiltered,
                        $scope.discountOffersFiltered
                      );
                    }

                    //Update Total count with respect to Top level filtering
                    $scope.offerCount = $scope.sortedAllOffers.length;
                    return $scope.sortedAllOffers;
                  }
                }
              } else {
                return offers;
              }
            };

            //Function the open modal popup and display offers details of the clicked card offer
            $scope.openOfferModal = function (offer) {
              $(".offer-desc").text("...");
              $(".offer_details h5").text(offer.category);

              //Ajax Post the get the details decription of the selected offers card
              $.ajax({
                type: "POST",
                url: "https://scripts.targetclose.com/tc/get-json-data",
                data: {
                  ourl: "https://aarp.org" + offer.offer_page_data,
                },
                async: true,
              }).done(function (data) {
                if (typeof data != "undefiend") {
                  offerData = JSON.parse(data);
                  if (offerData.success == true && offerData.message) {
                    if (offerData.message.offer_description) {
                      offer.offer_description =
                        offerData.message.offer_description;
                    } else {
                      offer.offer_description = "";
                    }
                    $(".offer-desc").text($(offer.offer_description).text());

                    //Added sticky bottom CTA for mobile width
                    $(".modal-body .join-details").removeClass("shadows");
                    var textHeight = $(".offer-desc").height();
                    if (textHeight > 220) {
                      $(".modal-body .join-details").addClass("shadows");
                    }
                    $(".joinNow").attr(
                      "href",
                      offerData.message.howto_redeem_url
                    );
                  }
                }
              });
              $scope.offerDialog.open(offer);
            };

            //Based on the clicked id of category pills in mobile scroll the active pill to left
            $scope.ShowId = function (event) {
              selectCat = event.target.id;
              seeAllwidth = 95;
              (constVal = 52), (totalwidth = 0);

              $(".desktopCategory .deskcategory").each(function () {
                if ($(this).attr("id") == selectCat) {
                  totalwidth = (seeAllwidth + totalwidth).toFixed(0);
                  $(".desktopCategory .category").animate(
                    {
                      scrollLeft: totalwidth,
                    },
                    500
                  );
                  return false;
                }
                totalwidth = totalwidth + $(this).width() + constVal;
              });
            };
          },
          function errorCallback(response) {
            console.log("Failed to load Json");
          }
        );
      },
    ]);

    angular.bootstrap(element, ["dbr-app"]);
  });
}
