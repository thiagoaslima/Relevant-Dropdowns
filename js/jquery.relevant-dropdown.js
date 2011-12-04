(function($) {
  
  // Make jQuery's :contains case insensitive (like HTML5 datalist)
  // Changed the name to prevent overriding original functionality
  $.expr[':'].RD_contains = function(a, i, m) { 
    return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
  };
  
  
  $.fn.relevantDropdown = function(options) {
    
    options = $.extend({
      fadeOutSpeed: 'normal' // speed to fade out the dataList Popup
    }, options);
    
    
    return this.each(function() {
            
      var doc = $(document),
          $searchInput = $(this),
      		$datalist = $("#" + $searchInput.attr("list")),
      		datalistItems = $datalist.find("option"),
      		
      		searchPosition,
      		scrollValue = 0;
      		      
      // Makes sure the browser doesn't already support the list attribute
      // todo: I couldn't figure out how to make an opposite `if statement` without Safari acting up
      if( !Modernizr.input.list || (parseInt($.browser.version) > 400) ) {
        
      	// Insert home for new fake datalist
    		$("<ul />", {
    			"class": "datalist",
    			"id"   : $searchInput.attr("list")
    		}).appendTo("body");

    		// Remove old datalist
    		$datalist.remove();

    		// Update pointer
    		var $datalist = $("#" + $searchInput.attr("list"));

    		// Fill new fake datalist
    		datalistItems.each(function() {
    			$("<li />", {
    				"text": $(this).val()
    			}).appendTo($datalist);
    		});

    		// Update pointer
    		var datalistItems = $datalist.find("li");

    		// Typey type type
    		$searchInput
    		    .on("focus", function(){   					
    				// Reset scroll				
    				$datalist.scrollTop(0);    					
    			    scrollValue = 0;
        		})    		
        		.on("blur", function(){
        		    // If this fires immediately, it prevents click-to-select from working
    			    setTimeout(function() {
    		            $datalist.fadeOut(options.fadeOutSpeed);
    			    	datalistItems.removeClass("active"); 
    				}, 500);

    		    })
    		    .on("keyup focus", function(e) {
    		        searchPosition = $searchInput.position();

    	        	// Build datalist							
    			    $datalist
        				.show()
    					.css({
    						top: searchPosition.top + $(this).outerHeight(),
    						left: searchPosition.left,
    						width: $searchInput.outerWidth()
    					});

        			datalistItems.hide();
        			$datalist.find("li:RD_contains('" + $searchInput.val() + "')").show();    				
        		});

    		// Don't want to use :hover in CSS so doing this instead
    		datalistItems.on("mouseenter", function() {
    			$(this).addClass("active").siblings().removeClass("active");
    		});
    		datalistItems.on("mouseleave", function() {
    		    $(this).removeClass("active");
    		});

    	    // Window resize
    		$(window).resize(function() {
    			searchPosition = $searchInput.position();
    			$datalist
    				.css({
    					top: searchPosition.top + $(this).outerHeight(),
    					left: searchPosition.left,
    					width: $searchInput.outerWidth()
    				});
    		});		

    		// Watch arrow keys for up and down
    		$searchInput.on("keydown", function(e) {	

    			var active = $("li.active");
        		var datalistHeight = $datalist.outerHeight();
        		var datalistItemsHeight = datalistItems.outerHeight();

    			// up arrow		
    			if ( e.keyCode == 38 ) {
    				if (active.length) {
    					prevAll = active.prevAll("li:visible");
    					if (prevAll.length > 0) {
    						active.removeClass("active");
    						prevAll.eq(0).addClass("active");
    					}            

                        if ( active.prevAll(":visible").position().top < 0 && scrollValue > 0 ){
                            $datalist.scrollTop(scrollValue-=datalistItemsHeight);                        
                        }                    
    				}
    			}

    			// down arrow
    			if ( e.keyCode == 40 ) {
    				if (active.length) {
    					var nextAll = active.nextAll("li:visible");
    					if (nextAll.length > 0) {
    						active.removeClass("active");
    						nextAll.eq(0).addClass("active");
    					}                 

                        if ( active.nextAll(":visible").position().top == datalistHeight ){
                            $datalist.scrollTop(scrollValue+=datalistItemsHeight);                      
                        }                    
    				} else {			    
    			        datalistItems.removeClass("active");
    				    $datalist.find("li:visible:first").addClass("active");	
    				}		    
    			}

    			// return or tab key
    			if ( e.keyCode == 13 || e.keyCode == 9 ) {
    				var active = $("li.active");
    				if (active.length) {
    					$searchInput.val(active.text());
    				}
                    $datalist.fadeOut(options.fadeOutSpeed);
        		    datalistItems.removeClass("active");
    			}

    			// keys
    			if ( e.keyCode != 13 && e.keyCode != 38 && e.keyCode != 40 ){
    			    // Reset active class
    			    datalistItems.removeClass("active");
    				$datalist.find("li:visible:first").addClass("active");

    				// Reset scroll
    			    $datalist.scrollTop(0);	
    			    scrollValue = 0;		    
    			}

    		});

    		// When choosing from dropdown
    		datalistItems.on("click", function() {
    			var active = $("li.active");
    			if (active.length) {
    				$searchInput.val($(this).text());
    			}
    			$datalist.fadeOut(options.fadeOutSpeed);
    			datalistItems.removeClass("active");
    		});
  		
		  }
      
    });
  };
  
})(jQuery);