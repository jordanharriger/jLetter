/**
* @license jLetter - jQuery text rotator plugin ##VERSION## 
* Written by Miriam Zusin (2011)
* Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
* MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
*/
(function($){
	'use strict';
	
	/**
	* get random number
	* @param {number} x 
	* @return {number}
	*/
	var random = function(x){
		return Math.floor(x * (Math.random() % 1));
	};
	
	/**
	* get random: [min, max]
	* @param {number} min 
	* @param {number} max 
	* @return {number}
	*/
	var randomBetween = function(min, max){
		return min + random(max - min + 1);
	};
	
	/**
	* set next slide
	* @param {Object} self - 'this' object
	*/
	var next = function(self){
		
		if(self.current < self.slidesNum - 1){
			self.current++;
		}
		else{
			self.current = 0;
		}
	};
	
	/**
	* make effect
	* @param {Object} self - 'this' object
	*/
	var makeEffect = function(self){
		
		var promises = []
			,promise;
		
		self.$par.find('[data-type="letter"]').each(function(){
		
			//animate
			promise = $(this).animate(
				{
					left: randomBetween(-self.options.width/2, self.options.width/2)
					,top: randomBetween(-self.options.height/2, self.options.height/2)
					,opacity: 0
				}
				,{
					duration: self.options.rotateSpeed
					
					/*
					,step: function(now, fx){
						if(fx['prop'] === 'opacity'){
							$(this).css('filter', 'alpha(opacity = ' + now*100 + ')');
						}
					}
					*/
				}
			);
			
			//add promise to the list
			promises.push(promise);
		});	

		$['when'].apply($, promises)['then'](function(){
		
			//update next
			next(self);
			
			//restart effect
			run(self);	
		});
	};
	
	/**
	* fade letters
	* @param {Object} self - 'this' object
	* @param {Function} callback
	*/
	var fade = function(self, callback){
		
		var cpar;
	
		//get paragraph
		cpar = self.$slidesPars.eq(self.current);
		
		//update html
		self.$par.html(cpar.html());
		
		//hide it
		self.$par.hide(0);
		
		//fade in
		self.$par.fadeIn(self.options.fadeSpeed, function(){
		
			if($.isFunction(callback)){
				callback();
			}
		});
	};
	
	/**
	* run
	* @param {Object} self - 'this' object
	*/
	var run = function(self){
	
		//fade letters
		fade(self, function(){
		
			setTimeout(function(){
				makeEffect(self);
			}, self.options.pause);
		});
	};
	
	/**
	* replace texts with spans
	* @param {Object} self - 'this' object
	*/
	var initTexts = function(self){
	
		var parTxt
			,lettersList
			,html = ''
			,par;
			
		//replace slides texts with spans
		self.$slidesPars.each(function(){
		
			//empty html
			html = '';
			
			//get paragraph
			par = $(this);
			
			//get text
			parTxt = par.text();
			
			//init letter array
			lettersList = jQuery['makeArray'](parTxt.split(''));
			
			//replace text with spans
			for(var i=0; i<lettersList.length; i++){
			
				if(lettersList[i] == ' '){
					html += '<span data-type="letter" style="position: relative; display: inline-block;">&nbsp;</span>';
				}
				else{
					html += '<span data-type="letter" style="position: relative; display: inline-block;;">' + lettersList[i] + '</span>';
				}
			}
			
			//set html
			par.html(html);
		});
	};
		
	/**
	* init html
	* @param {Object} self - 'this' object
	*/
	var initHtml = function(self){
	
		//set class
		self.root.addClass('jletter');
		
		//init slides
		self.$slides = self.root.find('[data-type="slide"]').hide(0);
		self.$slidesPars = self.$slides.find('p');
		
		//init css
		self.root.css('width', self.options.width + 'px');
		self.root.css('height', self.options.height + 'px');		
		
		//init panel
		self.root.prepend('<div class="panel"><p></p></div>');	
		self.$panel = self.root.find('.panel');			
		
		//init panels css
		self.$panel.css('width', self.options.width + 'px');
		self.$panel.css('height', self.options.height + 'px');
		self.$panel.css('position', 'relative');
		self.$panel.css('overflow','hidden');
		
		//init paragraph css
		self.$par = self.$panel.find('p');
		self.$par.css('position', 'relative');
		
		//replace texts with spans
		initTexts(self);
	};
	
	/** 
	* jLetter main contructor 
	* @param {Object} options - user options
	* @param {jQueryObject} root - jLetter container
	* @constructor 
	*/
	var init = function(options, root){
	
		var self = {
			options: options
			,root: root
			
			//sliding
			,current: 0
			,slidesNum: 0
			
			//jquery elements
			,$slides: null
			,$slidesPars: null
			,$panel: null
			,$par: null
		};
		
		self.options = $.extend(true, {		
		
			width: 300
			,height: 100
			,rotateSpeed: 2500
			,pause: 3000
			,fadeSpeed: 1000
		}, options);
			
		//init html
		initHtml(self);
		
		//init slides num
		self.slidesNum = self.$slides.length;
		
		//start effect
		run(self);
		
		return jQuery.extend(this, self);
	};
	
	/** 
	* jLetter main contructor
	* @param {Object} options - user options
	* @name jLetter - jQuery text rotator plugin
    * @class jLetter - jQuery text rotator plugin
    * @memberOf jQuery.fn	
	*/
	jQuery.fn.jLetter = function(options){
	
		return this.each(function(){
		
			//init constructor
			var self = new init(options, $(this));
			
			//dave data
			$(this).data('jletter', self);
			
			//return 'this' object
			return self;
		});
	};
})(jQuery);