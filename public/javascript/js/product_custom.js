//import { isLoggedIn } from "../../../controllers/accountController";
/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Custom Dropdown
4. Init Page Menu
5. Init Recently Viewed Slider
6. Init Brands Slider
7. Init Quantity
8. Init Color
9. Init Favorites
10. Init Image


******************************/

$(document).ready(function() {
  "use strict";

  /*

	1. Vars and Inits

	*/

  var menuActive = false;
  var header = $(".header");

  setHeader();

  initCustomDropdown();
  initPageMenu();
  initViewedSlider();
  initBrandsSlider();
  initQuantity();
  initColor();
  initFavs();
  initImage();
  initTimerList();
  setThousandSeperator();
  setIndex();
  setInputFormat();

  $(window).on("resize", function() {
    setHeader();
  });

  /*

	2. Set Header

	*/

  function setHeader() {
    //To pin main nav to the top of the page when it's reached
    //uncomment the following

    // var controller = new ScrollMagic.Controller(
    // {
    // 	globalSceneOptions:
    // 	{
    // 		triggerHook: 'onLeave'
    // 	}
    // });

    // var pin = new ScrollMagic.Scene(
    // {
    // 	triggerElement: '.main_nav'
    // })
    // .setPin('.main_nav').addTo(controller);

    if (window.innerWidth > 991 && menuActive) {
      closeMenu();
    }
  }

  /*

	3. Init Custom Dropdown

	*/

  function initCustomDropdown() {
    if ($(".custom_dropdown_placeholder").length && $(".custom_list").length) {
      var placeholder = $(".custom_dropdown_placeholder");
      var list = $(".custom_list");
    }

    placeholder.on("click", function(ev) {
      if (list.hasClass("active")) {
        list.removeClass("active");
      } else {
        list.addClass("active");
      }

      $(document).one("click", function closeForm(e) {
        if ($(e.target).hasClass("clc")) {
          $(document).one("click", closeForm);
        } else {
          list.removeClass("active");
        }
      });
    });

    $(".custom_list a").on("click", function(ev) {
      ev.preventDefault();
      var index = $(this)
        .parent()
        .index();

      placeholder.text($(this).text()).css("opacity", "1");

      if (list.hasClass("active")) {
        list.removeClass("active");
      } else {
        list.addClass("active");
      }
    });

    // $("select").on("change", function(e) {
    //   placeholder.text(this.value);

    //   $(this).animate({ width: placeholder.width() + "px" });
    // });
  }

  /*

	4. Init Page Menu

	*/

  function initPageMenu() {
    if ($(".page_menu").length && $(".page_menu_content").length) {
      var menu = $(".page_menu");
      var menuContent = $(".page_menu_content");
      var menuTrigger = $(".menu_trigger");

      //Open / close page menu
      menuTrigger.on("click", function() {
        if (!menuActive) {
          openMenu();
        } else {
          closeMenu();
        }
      });

      //Handle page menu
      if ($(".page_menu_item").length) {
        var items = $(".page_menu_item");
        items.each(function() {
          var item = $(this);
          if (item.hasClass("has-children")) {
            item.on("click", function(evt) {
              evt.preventDefault();
              evt.stopPropagation();
              var subItem = item.find("> ul");
              if (subItem.hasClass("active")) {
                subItem.toggleClass("active");
                TweenMax.to(subItem, 0.3, { height: 0 });
              } else {
                subItem.toggleClass("active");
                TweenMax.set(subItem, { height: "auto" });
                TweenMax.from(subItem, 0.3, { height: 0 });
              }
            });
          }
        });
      }
    }
  }

  function openMenu() {
    var menu = $(".page_menu");
    var menuContent = $(".page_menu_content");
    TweenMax.set(menuContent, { height: "auto" });
    TweenMax.from(menuContent, 0.3, { height: 0 });
    menuActive = true;
  }

  function closeMenu() {
    var menu = $(".page_menu");
    var menuContent = $(".page_menu_content");
    TweenMax.to(menuContent, 0.3, { height: 0 });
    menuActive = false;
  }

  /*

	5. Init Recently Viewed Slider

	*/

  function initViewedSlider() {
    if ($(".viewed_slider").length) {
      var viewedSlider = $(".viewed_slider");

      viewedSlider.owlCarousel({
        loop: true,
        margin: 30,
        autoplay: true,
        autoplayTimeout: 6000,
        nav: false,
        dots: false,
        responsive: {
          0: { items: 1 },
          575: { items: 2 },
          768: { items: 3 },
          991: { items: 4 },
          1199: { items: 6 }
        }
      });

      if ($(".viewed_prev").length) {
        var prev = $(".viewed_prev");
        prev.on("click", function() {
          viewedSlider.trigger("prev.owl.carousel");
        });
      }

      if ($(".viewed_next").length) {
        var next = $(".viewed_next");
        next.on("click", function() {
          viewedSlider.trigger("next.owl.carousel");
        });
      }
    }
  }

  /*

	6. Init Brands Slider

	*/

  function initBrandsSlider() {
    if ($(".brands_slider").length) {
      var brandsSlider = $(".brands_slider");

      brandsSlider.owlCarousel({
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        nav: false,
        dots: false,
        autoWidth: true,
        items: 8,
        margin: 42
      });

      if ($(".brands_prev").length) {
        var prev = $(".brands_prev");
        prev.on("click", function() {
          brandsSlider.trigger("prev.owl.carousel");
        });
      }

      if ($(".brands_next").length) {
        var next = $(".brands_next");
        next.on("click", function() {
          brandsSlider.trigger("next.owl.carousel");
        });
      }
    }
  }

  /*

	7. Init Quantity

	*/

  function initQuantity() {
    // Handle product quantity input
    if ($(".product_quantity").length) {
      var input = $("#quantity_input");
      var incButton = $("#quantity_inc_button");
      var decButton = $("#quantity_dec_button");

      var originalVal;
      var endVal;

      incButton.on("click", function() {
        originalVal = input.val();
        endVal = parseFloat(originalVal) + 1;
        input.val(endVal);
      });

      decButton.on("click", function() {
        originalVal = input.val();
        if (originalVal > 0) {
          endVal = parseFloat(originalVal) - 1;
          input.val(endVal);
        }
      });
    }
  }

  /*

	8. Init Color

	*/

  function initColor() {
    if ($(".product_color").length) {
      var selectedCol = $("#selected_color");
      var colorItems = $(".color_list li .color_mark");
      colorItems.each(function() {
        var colorItem = $(this);
        colorItem.on("click", function() {
          var color = colorItem.css("backgroundColor");
          selectedCol.css("backgroundColor", color);
        });
      });
    }
  }

  /*

	9. Init Favorites

	*/

  function initFavs() {
    // Handle Favorites
    var fav = $(".fav");
    var id = $(fav).data("id");
    if (!logged) {
      $(fav).css("visibility", "hidden");
    } else {
      $(fav).css("visibility", "visible");
      var wish_list = user.wish_list;
      if (wish_list.findIndex(v => v.pro_id == id) != -1)
        $(fav).addClass("active");
    }
    fav.on("click", function() {
      fav.toggleClass("active");
      var check = $(this).hasClass("active");
      console.log(check);
      var proid = $(this).data("id");
      var wishItem = {
        pro_id: proid
      };
      var wish_list = $(".wishlist_count span");
      if (check) {
        $.ajax({
          url: "/" + proid + "/addToWishList",
          type: "post",
          dataType: "json",
          data: JSON.stringify(wishItem),
          success: data => {
            if (data == "-1") {
              console.log("ajax wish list: send false");
              window.location.href = "/";
            }
            if (data == "1") {
              $(wish_list).html(parseInt($(wish_list).html()) + 1);
            }
          }
        });
      } else {
        $.ajax({
          url: "/" + proid + "/removeFromWishList",
          type: "post",
          dataType: "json",
          data: JSON.stringify(wishItem),
          success: data => {
            if (data == "-1") {
              console.log("ajax wish list: send false");
              window.location.href = "/";
            }
            if (data == "1") {
              $(wish_list).html(parseInt($(wish_list).html()) - 1);
            }
          }
        });
      }
    });
  }

  /*

	10. Init Image

	*/

  function initImage() {
    var images = $(".image_list li");
    var selected = $(".image_selected img");

    images.each(function() {
      var image = $(this);
      image.on("click", function() {
        var imagePath = new String(image.data("image"));
        selected.attr("src", imagePath);
      });
    });
  }

  /*

21. Init Timer Item

*/
  function initTimerList() {
    if ($(".deals_timer_box_item").length) {
      var timers = $(".deals_timer_box_item");
      timers.each(function() {
        var timer = $(this);

        var targetTime;
        var target_date;

        // Add a date to data-target-time of the .deals_timer_box
        // Format: "Feb 17, 2018"
        if (timer.data("target-time") !== "") {
          targetTime = timer.data("");
          target_date = new Date(targetTime).getTime();
        } else {
          var date = new Date();
          date.setDate(date.getDate() + 2);
          target_date = date.getTime();
        }

        // variables for time units
        var days, hours, minutes, seconds;

        var h = timer.find(".deals_timer_hr");
        var m = timer.find(".deals_timer_min");
        var s = timer.find(".deals_timer_sec");
        var d = timer.find(".deals_timer_day");

        setInterval(function() {
          // find the amount of "seconds" between now and target
          var current_date = new Date().getTime();
          var seconds_left = 0;
          if (target_date > current_date) {
            seconds_left = (target_date - current_date) / 1000;
          }
          console.log(seconds_left);

          // do some time calculations
          days = parseInt(seconds_left / 86400);
          seconds_left = seconds_left % 86400;

          hours = parseInt(seconds_left / 3600);
          hours = hours + days * 24;
          seconds_left = seconds_left % 3600;

          minutes = parseInt(seconds_left / 60);
          seconds = parseInt(seconds_left % 60);

          if (hours.toString().length < 2) {
            hours = "0" + hours;
          }
          if (minutes.toString().length < 2) {
            minutes = "0" + minutes;
          }
          if (seconds.toString().length < 2) {
            seconds = "0" + seconds;
          }

          // display results
          h.text(hours);
          m.text(minutes);
          s.text(seconds);
          d.text(days);
        }, 1000);
      });
    }
  }

  function setThousandSeperator() {
    var products_price = $(".price");
    for (var i = 0; i <= products_price.length; i++) {
      if ($(products_price[i]).html())
        $(products_price[i]).html(
          $(products_price[i])
            .html()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        );
    }
  }

  function setIndex() {
    var index = $(".index");
    for (var i = 0; i <= index.length; i++) {
      var value = parseInt($(index[i]).html());
      if (value == 0) {
        $(index[i]).html("Current Winner");
      } else {
        $(index[i]).html(value + 1);
      }
    }
  }

  function setInputFormat() {
    // $("input#quantity_input").on("keyup", function(event) {
    //   // When the arrow keys are pressed, abort.
    //   var $this = $(this);
    //   // Get the value.
    //   var input = $this.val().toString();
    //   input = input.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    //   $this.val(function() {
    //     return parseInt(input);
    //   });
    // });
  }
});

function check() {
  var proName = $("#inputProductName");
  var category = $("#selectCategory");
  var startPrice = $("#inputStartPrice");
  var stepPrice = $("#inputPriceStep");
  var purcharePrice = $("#inputPurchasePrice");
  //var startPrice = $('#inputStartPrice');
  var ch = true;
  if (proName.val() == "") {
    $(".reqProductName").html("Không được bỏ trống tên sản phẩm");
    ch = false;
  } else $(".reqProductName").html("verified");
  if (startPrice.val() <= 0) {
    $(".reqStartPrice").html("Không được bỏ trống giá khởi điểm");
    ch = false;
  } else $(".reqStartPrice").html("verified");
  if (stepPrice.val() <= 0) {
    $(".reqStepPrice").html("Không được bỏ trống bước giá");
    ch = false;
  } else $(".reqStepPrice").html("verified");
  var files = $("#img")[0].files;
  if (files.length < 3) {
    $(".reqImg").html("Hãy chọn tối thiểu 3 ảnh");
    ch = false;
  } else {
    $(".reqImg").html("");
  }
  if (ch == true) window.alert("Đăng sản phẩm thành công!");
  return ch;
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $("#imgHolder").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$("#img").change(function() {
  readURL(this);
});

function notification() {
  var r = confirm("Bạn có thật sự muốn ra giá sản phẩm này!");
  if (r == true) window.alert("Ra giá thành công!");
  if (r == false) return false;
}
