$(function() {

	Reveal.initialize({
		history: true		//xác nhận các slide bằng việc chuyển url
	});

	// ket noi socket 

	var socket = io();

	// xac nhận đăng nhập

	var form = $('form.login');
	var secretTextBox = form.find('input[type=password]');
	var presentation = $('.reveal');

	var key = "", animationTimeout;


	form.submit(function(e){

		e.preventDefault();

		key = secretTextBox.val().trim();

		if(key.length) {
			socket.emit('load', {
				key: key
			});
		}

	});

	// các kết nối sẽ tiếp tục nếu có cùng pass cho trước 

	socket.on('access', function(data){

		// Check if we have "granted" access.
		// If we do, we can continue with the presentation.

		const slides = document.querySelector('#slide1');

		const Whatarews = document.querySelector('#whatarews');

		const howmanynetwork = document.querySelector('#howmanynetwork');

		const networktypes = document.querySelector('#networktypes');

		if(data.access === "granted") {

			// Unblur everything
			presentation.removeClass('blurred');

			form.hide();
	
			
			$(document).ready(function(){
				$("#text-introduction").hide();
				$("#text-introduction1").hide();
				$("#text-introduction2").hide();
				$("#text-introduction3").hide();
				$("#text-introduction4").hide();
				$("#graphic").hide();
				$("#graphic1").hide();
				$("#graphic2").hide();
				$("#graphic3").hide();
				$("#graphic4").hide();
				$("#graphic5").hide();
				$("#graphic6").hide();
				$("#graphic7").hide();
				$("#graphic8").hide();
			});

			var ignore = false;

			$(window).on('hashchange', function(){

				// chuyển tín hiệu chuyển slide 

				if(ignore){
					return;
				}

				var hash = window.location.hash;

				socket.emit('slide-changed', {
					hash: hash,
					key: key
				});
			});

			// gui thong diep hien thi text
			slides.onclick = () => {
				socket.emit('text-flyout', {
					hash: 1,
					key: key
				});
			};
			

			// nhan thong diep hien thi text o cac client
			socket.on('text-flyin', data => {
				if (data.hash==1){
					$("#text-introduction").show(1000);
					$("#text-introduction1").show(1000);
					$("#text-introduction2").show(1000);
					$("#text-introduction3").show(1000);
					$("#text-introduction4").show(1000);
				};
			})

			// what are websocket up
			Whatarews.onclick = () => {
				socket.emit('text-up',{
					hash: 1,
					key: key
				});
			}

			//slide thu 3
			howmanynetwork.onclick =() => {
				socket.emit('text-howmany',{
					hash: 1,
					key : key
				});
			}

			socket.on('text-howmany', data =>{
				if(data.hash ==  1){
					networktypes.style.width = '50%' ;
					$.when( $("#graphic8").show(1500)).done( ()=> {
						$("#graphic").show(1000);
						$("#graphic1").show(1000);
						$("#graphic2").show(1000);
						$("#graphic3").show(1000);
						$("#graphic4").show(1000);
						$("#graphic5").show(1000);
						$("#graphic6").show(1000);
						$("#graphic7").show(1000);
					});				
				}
			});


			// socket.on('text-up', data => {
			// 	if(data.hash == 1){
					// Whatarews.style.marginTop = '0px';
			// 	}
			// })

			socket.on('navigate', function(data){
	
				// tất cả các slide sẽ chuyển 

				window.location.hash = data.hash;

				ignore = true;

				setInterval(function () {
					ignore = false;
				},100);

			});

		}
		else {

			// nếu sai key

			clearTimeout(animationTimeout);

			// thêm css vào font đăng nhập 			

			secretTextBox.addClass('denied animation');
			
			animationTimeout = setTimeout(function(){
				secretTextBox.removeClass('animation');
			}, 1000);

			form.show();
		}

	});

});