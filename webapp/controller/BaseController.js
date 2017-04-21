sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.sap.expenseplanning.controller.BaseController", {
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getServiceHost: function() {
			var host = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
			return host;
		},

		getServiceUrl: function(path) {
			var host = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
			var url = host + jQuery.sap.getModulePath("com.sap.expenseplanning").replace(/./g,"/");
			return url;
		},

		getHost: function() {
			return window.location.host + jQuery.sap.getModulePath("com.sap.expenseplanning");
		},

		navToTarget: function(pattern, data) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);

			if (router) {
				if (data) {
					router.navTo(pattern, {
						parameter: data
					});
				} else {
					router.navTo(pattern);
				}

			}
		}
	});
});