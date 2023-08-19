var HTMLToPDF = HTMLToPDF || {};

HTMLToPDF.messageLog = {
    1: 'Please provide your email ID.',
	2: 'Please provide a valid email ID.',
	3: 'Please provide your name',
};

HTMLToPDF.system = {
	login: function() {		
		HTMLToPDF.model.close_pop(1);
		HTMLToPDF.model.open_pop(HTMLToPDF.login.showLoginLayer, 'lgn_pop ', 1);		
	},
	changePassword: function () {},
	editProfile: function () {},
	logout: function() {
		
	}
};

HTMLToPDF.login = (() => {
	var showLoginLayer = () => {

	}
	return {
		showLoginLayer : showLoginLayer,
	}
})();

HTMLToPDF.model = (() =>  {

	const open_pop = (custom_function, add_class, head) => {	
	
		var modelBoxes = document.querySelectorAll('.model-box');
		var model_id = modelBoxes.length === 0 ? 1 : modelBoxes.length + 1;
	
		var obj_id = "model_" + head;
		var xtra_cls = ' ';
		if (add_class) {
			xtra_cls += add_class;
		}
	
		var append_str = '';
		var close_txt = '';		
		
		close_txt = close === 'N' ? '' : '<a onclick="HTMLToPDF.model.close_pop();" class="close" style="z-index:9999">&#10005;</a>';
		append_str = '<div id="' + obj_id + '" class="model-container ' + xtra_cls + '" style="display:none;">' + close_txt + '<div class="model-wrapper"><div class="model-content clearfix" id="model_content_' + model_id + '"><span class="pre_loader" id="pre_loader_' + model_id + '"><span class="loader">&nbsp;</span>Loading...</span></div></div></div>';
		
		document.body.insertAdjacentHTML('beforeend', append_str);
		
		var popupElement = document.getElementById(obj_id);
		popupElement.style.display = 'block';
	
		document.body.insertAdjacentHTML('beforeend', '<div id="l2_overlay_bx_' + model_id + '" class="model-bg "></div>');
	
		custom_function(head);
		
		var wrapperDiv = document.createElement('div');
		wrapperDiv.className = 'model-box';
		wrapperDiv.id = 'wrapper_' + model_id;
		popupElement.parentNode.insertBefore(wrapperDiv, popupElement);
		wrapperDiv.appendChild(popupElement);
	
		return model_id;
	};
	

	const close_pop = (obj) => {
		if (obj) {
			var popupElement = document.getElementById('model_' + obj);
			if (popupElement) {
				var overlayElement = document.getElementById('l2_overlay_bx_' + obj);
				var wrapperElement = document.getElementById('wrapper_' + obj);
				
				if (document.getElementById('model_' + obj).classList.contains('fadeInUp')) {
					popupElement.classList.remove('fadeInUp');
					popupElement.classList.add('fadeInDown');
					if (overlayElement) overlayElement.remove();
					if (wrapperElement) wrapperElement.remove();
				} else {
					if (overlayElement) overlayElement.remove();
					if (wrapperElement) wrapperElement.remove();
				}
			}
		}
	};
	

	return {
		open_pop  : open_pop,
		close_pop : close_pop
	}
})();