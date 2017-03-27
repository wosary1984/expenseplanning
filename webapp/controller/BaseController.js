sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.sap.expenseplanning.controller.BaseController", {
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
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