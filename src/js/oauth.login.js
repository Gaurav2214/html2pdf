var HTMLToPDF = HTMLToPDF || {};

HTMLToPDF.globalVar = HTMLToPDF.globalVar || {
	errorValueInFlow: '',
};

HTMLToPDF.messageLog = {
    1: 'Please provide your email ID.',
	2: 'Please provide a valid email ID.',
	3: 'Please provide your name',
};

HTMLToPDF.common = (() => {
	var isNull = function (obj) {
		return obj == null || obj == 'null';
	};
	
	var isUndefined = function (obj) {
		return obj == undefined;
	};
	
	var isBlank = function (obj) {
		return typeof obj == 'undefined' || obj == '';
	};
	var isOperatable = function (obj) {
		if (typeof obj == 'object' &&
			!this.isNull(obj)) {
	
			return Object.keys(obj).length == 0 ? false : true;
		} else {
			return !this.isBlank(obj) && !this.isNull(obj) && !this.isUndefined(obj);
		}
	}
	var setLocalStorage = (key, data, exdays) => {
		var $data = {};
		$data['expires'] = Math.floor(Date.now() / 1000) + exdays * 24 * 60 * 60;
		$data['data'] = data;
		localStorage.setItem(key, JSON.stringify($data));
	}
	var getLocalStorage = (key) => {
		var $data = localStorage.getItem(key);
		if ($data != null) {
			$data = JSON.parse($data);
			var lsexpires = $data['expires'];
			if (Math.floor(Date.now() / 1000) >= lsexpires) {
				deleteLocalStorage(key);
				return null;
			}
			if ('data' in $data)
				return $data['data'];
			else {
				deleteLocalStorage(key);
				return null;
			}
		} else {
			return null;
		}
	}
	var deleteLocalStorage = (key) => {
		localStorage.removeItem(key);
	}
	var encodeHTML = (param) => {
		if (!param) {
			return param;
		}
		return param.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
	};

	var validateName = (name, key) => {
		var error = '';
		name = name.replace(/ /g, '');

		function handleBlankNameVal(msgkey1, msgkey2) {
			if (name == "") {
				error = HTMLToPDF.messageLog[msgkey1];
			} else if (!name.match(/^([a-zA-Z]+)$/i)) {
				error = HTMLToPDF.messageLog[msgkey2];
			}
		}

		switch (key) {
			case "b2boauth_name":
				handleBlankNameVal(29, 30);
		}
		return error;
	}

	var validatePassword = (password, key) => {
		var error = '';
		password = password.replace(/ /g, '');
		switch (key) {
			case "b2boauth_log_pswd":
			case "b2boauth_curr_password":
			case "b2boauth_frgt_pswd_password":
			case "b2boauth_verify_registration_password":
			case "b2boauth_registration_password":
				if (password == "") {
					error = HTMLToPDF.messageLog[26];
				} else if (password.length < 6) {
					error = HTMLToPDF.messageLog[27];
				} else if (password.length > 32) {
					error = HTMLToPDF.messageLog[28];
				}
				break;
			case "b2boauth_new_password1":
				if (password == "") {
					error = HTMLToPDF.messageLog[48];
				} else if (password.length < 6) {
					error = HTMLToPDF.messageLog[27];
				} else if (password.length > 32) {
					error = HTMLToPDF.messageLog[28];
				}
				break;
			case "b2boauth_new_password2":
				var newpass = encodeHTML($('#b2boauth_new_password1').val());
				if (password != newpass) {
					error = HTMLToPDF.messageLog[37];
				}
		}
		return error;
	}

	var isValidEmail = (email) => {
		var pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		if (!pattern.test(email)) {
			return false;
		} else {
			return true;
		}
	}

	var validateEmail = (email) => {
		var error = '';
		email = email.replace(/^\s+|\s+$/gm,'');
		if (email == "") {
			error = HTMLToPDF.messageLog[31];
		}
		else if (!isValidEmail(email)) {
			error = HTMLToPDF.messageLog[2];
		}
		return error;
	}

	var removeRequiredFields = (e) => {
		var id, value;
		if (e.type != 'blur') {
			id = $(e).attr('id');
			value = $('#' + id).val();
		} else {
			id = $(e.target).attr('id');
			value = $('#' + id).val();
		}	
	
		if (value) {
			value = encodeHTML(value);
			$('#' + id + '_err').html('').hide();
			$('#' + id + '_err').siblings('input').removeClass('error');
			validateFields(id, value);
		} else {
			validateFields(id, value);
		}
	}

	var validateFields = (id, value) =>{
		var error_val = true;
		valError = false;
		HTMLToPDF.globalVar.errorValueInFlow = '';
		var valParam = {
			'b2boauth_name': validateName,
			'b2boauth_reg_pwd': validatePassword,
			'b2boauth_registration_email': validateEmail,
			'b2boauth_log_email': validateEmail,
			'b2boauth_registration_password': validatePassword,
			'b2boauth_log_pswd': validatePassword,
		};	
	
		for (var key in valParam) {
			var valFunction = valParam[key];
			if (id == key) {
				error_val = valParam[key](value, key);
				if (error_val) {
					$('#' + key + '_err').html(error_val);
					$('#' + key + '_err').show();
					$('#' + key).addClass('error');
					valError = true;
					HTMLToPDF.globalVar.errorValueInFlow = error_val;
	
					if ($('.autocomplete-items').length)
						$('.autocomplete-items').remove();
	
					return false;
				}
			}
		}
	}

	var hitAjaxApi = function (requestSet, ajaxSuccess, ajaxError) {
		if (isOperatable(requestSet)) {
			requestSet = requestSet || {};
			requestSet.data = requestSet.data || {};
            requestSet.data.portal = ET_PORTAL;
			$.ajax({
				url: requestSet.url,
				type: requestSet.type || 'POST',
				data: requestSet.data,
                xhrFields: { withCredentials: true },
				crossDomain: true,
				success: function (data) {
					ajaxSuccess(data);
				},
				error: function (data, XMLHttpRequest, textStatus, errorThrown) {
					ajaxError(data);
				}
			});
		}
	}
	return {
		isNull 		 		 : isNull,
		isBlank		 		 : isBlank,
		isUndefined	 		 : isUndefined,
		isOperatable 		 : isOperatable,
		hitAjaxApi 	 		 : hitAjaxApi,
		setLocalStorage 	 : setLocalStorage,
		getLocalStorage 	 : getLocalStorage,
		deleteLocalStorage   : deleteLocalStorage,
		encodeHTML			 : encodeHTML,
		removeRequiredFields : removeRequiredFields
	}
})();

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
		let layer_html = `
			<div class="model-content">
				<h2 class="brand-icon">
					<img src="/src/images/logo.png" width="160" height="38" title="Logo" alt="">
				</h2>
				<div class="login-form" id="login-form" style="">
					<div class="login-model">
						<div class="showloader" style="display: none;"></div>
						<h3 class="oauth-login-title">
							Log in to your account
						</h3>
						<div id="login_model" class="oauth_submit_status clearfix">
							<div class="create-section input_sec ">
								<input required="" data-id="" placeholder="" name="" type="text" id="b2boauth_log_email" class="input_txt_box" value="" /> 
																
								<label for="b2boauth_log_email">
									Email ID
								</label>

								<p id="b2boauth_log_email_err" class="error">
								</p>
							</div>
							<div class="create-section input_sec ">									
								<i class="lg_sprite oauth-eye-slash show-pwd" aria-hidden="true" data-testid="show-password">
								</i>									 
								<input required="" data-id="" placeholder="" name="" type="password" id="b2boauth_log_pswd" class="input_txt_box" value=""> 
								
								<label for="b2boauth_log_pswd">
									Password
								</label>
								<p id="b2boauth_log_pswd_err" class="error">
								</p>
							</div>
							<a id="forgot_pswd_link" class="forgot">Forgot your password?</a>
							<p id="b2boauth_log_main_err" class="error error_info"></p>
							<div class="create-section marg-bottom0 clearfix">
								<input type="button" id="log_submit" class="btn submit-button2" onclick="EtB2b.login.loginUser()" value="Log in" disabled="disabled"> 
							</div>
						</div>
						<div class="log_popup_bottom oauth-bottom-login model-bottom">
							<p class="sub-stm">By continuing, you agree to the 
								<a target="_blank" class="link" href="">Terms &amp; Conditions</a> 
								and acknowledge our <a target="_blank" class="link" href="">Privacy Policy</a>.
							</p>
							Don't have account? <a class="signup link">Create one</a>
						</div>
					</div>
				</div>
				<div class="login-form" id="registration-form" style="display:none;">
					<div class="registration-model">
						<div class="showloader" style="display: none;"></div>
						<h3 class="oauth-login-title">
							Create your free account
						</h3>
						<div id="login_model" class="oauth_submit_status clearfix">
							<div class="create-section input_sec ">
								<input required="" data-id="" placeholder="" name="" type="text" id="b2boauth_name" class="input_txt_box" value="" maxlength="45" title="">
								<label for="b2boauth_name"> Name </label>
								<p id="b2boauth_name_err" class="error">
								</p>
							</div>
							<div class="create-section input_sec ">
								<input required="" data-id="" placeholder="" name="" type="text" id="b2boauth_registration_email" class="input_txt_box" value="" /> 																
								<label for="b2boauth_registration_email"> Email ID </label>
								<p id="b2boauth_registration_email_err" class="error">
								</p>
							</div>
							<div class="create-section input_sec ">									
								<i class="lg_sprite oauth-eye-slash show-pwd" aria-hidden="true" data-testid="show-password">
								</i>									 
								<input required="" data-id="" placeholder="" name="" type="password" id="b2boauth_registration_password" class="input_txt_box" value=""> 
								
								<label for="b2boauth_registration_password">
									Password
								</label>
								<p id="b2boauth_registration_password_err" class="error">
								</p>
							</div>
							<p id="reg_main_err" class="error error_info"></p>
							<div class="create-section marg-bottom0 clearfix">
								<input type="button" id="log_submit" class="btn submit-button2" onclick="HTMLToPDF.login.userRegistration(1)" value="Create Account"> 
							</div>
						</div>
						<div class="log_popup_bottom oauth-bottom-login model-bottom">
							<p class="sub-stm">By continuing, you agree to the 
								<a target="_blank" class="link" href="">Terms &amp; Conditions</a> 
								and acknowledge our <a target="_blank" class="link" href="">Privacy Policy</a>.
							</p>
							Already have account? <a class="cancel">Log In</a>
						</div>
					</div>
				</div>
			</div>
		`;
		$('#model_content_1').html(layer_html);
		loadloginfunctions();
	}

	var loadloginfunctions = (lid) => {
		$("body").on("click", ".signup", function () {
			$("#login-form, #forgot_psswrd").hide();
			$("#registration-form").show('slow');
			$('.main_info, .ostore-pwd').remove();
			$('.reg_id_display').text('');
		});
		$("body").on("click", "#registration-form .cancel", function () {
			$("#login-form").show('slow');
			$("#registration-form").hide();
			$('.main_info').remove();			
		});
	}

	var loginUser = () => {	}
	var userRegistration = () => {
		var reg_name = $('#b2boauth_name').val();
		var reg_email = $('#b2boauth_registration_email').val();
		var reg_pwd = $('#b2boauth_registration_password').val();

		$(".registration-model input").each(function () {
			if ($(this).attr('type') != 'button' && $(this).attr('type') != 'checkbox') {
				HTMLToPDF.common.removeRequiredFields($(this));
				if (valError) { return false; }
			}
		});
	}
	var displayUserInfo = (data) =>{}

	return {
		showLoginLayer 	 : showLoginLayer,
		loginUser 	   	 : loginUser,
		userRegistration : userRegistration,
		displayUserInfo  : displayUserInfo,
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
		
		close_txt = close === 'N' ? '' : '<a onclick="HTMLToPDF.model.close_pop(1);" class="close" style="z-index:9999">&#10005;</a>';
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
		close_pop : close_pop,
	}
})();