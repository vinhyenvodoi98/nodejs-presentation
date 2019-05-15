$(()=> {

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


	form.submit((e)=>{

		e.preventDefault();

		key = secretTextBox.val().trim();

		if(key.length) {
			socket.emit('load', {
				key: key
			});
		}

	});

	// các kết nối sẽ tiếp tục nếu có cùng pass cho trướcs

	socket.on('access', (data)=>{

		// Check if we have "granted" access.
		// If we do, we can continue with the presentation.

		const slides = document.querySelector('#slide1');

		const Whatarews = document.querySelector('#whatarews');

		if(data.access === "granted") {

			// Unblur everything
			presentation.removeClass('blurred');

			form.hide();

			$(document).ready(()=>{
				$("p").hide();
			});

			var ignore = false;

			$(window).on('hashchange', ()=>{

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
					// hash: 1,
					hash: '$("p").show(1000)',
					key: key
				});
			};

			// nhan thong diep hien thi text o cac client
			socket.on('text-flyout', data => {
				// if (data.hash==1){
				// 	$("p").show(1000);
				// };
				eval(data.hash);
			})

			// what are websocket up
			Whatarews.onclick = () => {
				socket.emit('text-up',{
					hash: 1,
					key: key
				});
			}

			socket.on('text-up', data => {
				if(data.hash == 1){
					Whatarews.style.marginTop = '0px';
				}
			})

			socket.on('navigate', (data)=>{

				// tất cả các slide sẽ chuyển

				window.location.hash = data.hash;

				ignore = true;

				setInterval( ()=> {
					ignore = false;
				},100);

			});

		}
		else {

			// nếu sai key

			clearTimeout(animationTimeout);

			// thêm css vào font đăng nhập

			secretTextBox.addClass('denied animation');

			animationTimeout = setTimeout(()=>{
				secretTextBox.removeClass('animation');
			}, 1000);

			form.show();
		}

	});

});