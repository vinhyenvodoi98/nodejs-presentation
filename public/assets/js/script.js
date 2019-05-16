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

		const robot_detail = document.querySelector('#robot_detail');
		const robot_img = document.querySelector('#robot_img');
		const blockchain_hackathon_img = document.querySelector('#blockchain_hackathon_img');
		const blockchain_setivicate = document.querySelector('#blockchain_setivicate');
		const category_content = document.querySelector('#category_content');
		const content1 = document.querySelector('#content1');
		const content2 = document.querySelector('#content2');
		const content3 = document.querySelector('#content3');
		const content4 = document.querySelector('#content4');

		$(document).ready(()=>{
			$("#robot_detail").hide();
			$("#blockchain_setivicate").hide();
			$("#content1").hide();
			$("#content2").hide();
			$("#content3").hide();
			$("#content4").hide();
			$("#content5").hide();
		});

		if(data.access === "granted") {

			// Unblur everything
			presentation.removeClass('blurred');

			form.hide();

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
			category_content.onclick = () => {
				socket.emit('text-flyout', {
					hash: '1',
					key: key
				});
			}

			content1.onclick = () => {
				socket.emit('text-flyout', {
					hash: '2',
					key: key
				});
			}

			content2.onclick = () => {
				socket.emit('text-flyout', {
					hash: '3',
					key: key
				});
			}

			content3.onclick = () => {
				socket.emit('text-flyout', {
					hash: '4',
					key: key
				});
			}

			content4.onclick = () => {
				socket.emit('text-flyout', {
					hash: '5',
					key: key
				});
			}

			robot_img.onclick = () => {
				socket.emit('text-flyout', {
					hash: '12',
					key: key
				});
			};

			robot_detail.onclick = () => {
				socket.emit('text-flyout', {
					hash: '13',
					key: key
				});
			}

			blockchain_hackathon_img.onclick = () => {
				socket.emit('text-flyout', {
					hash: '14',
					key: key
				});
			}

			blockchain_setivicate.onclick = () => {
				socket.emit('text-flyout', {
					hash: '15',
					key: key
				});
			}

			// nhan thong diep hien thi text o cac client
			socket.on('text-flyout', data => {
				if(data.hash == 1){
					$("#content1").show(1000);
				}
				if(data.hash == 2){
					$("#content2").show(1000);
				}
				if(data.hash == 3){
					$("#content3").show(1000);
				}
				if(data.hash == 4){
					$("#content4").show(1000);
				}
				if(data.hash == 5){
					// content5.style.marginTop = '0px';
					$("#content5").show(1000);
				}
				if (data.hash == 12){
					$("#robot_img").hide(1000);
					$("#robot_detail").show(1000);
				};
				if (data.hash == 13 ){
					$("#robot_img").show(1000);
					$("#robot_detail").hide(1000);
				}
				if (data.hash == 14 ){
					$("#blockchain_setivicate").show(1000);
					$("#blockchain_hackathon_img").hide(1000);
				}
				if (data.hash == 15 ){
					$("#blockchain_hackathon_img").show(1000);
					$("#blockchain_setivicate").hide(1000);
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