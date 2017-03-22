sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.sap.expenseplanning.controller.BaseController", {
		c4c_MY323481_basic_destination: "C4C-MY323481-BASIC",
		c4c_MY323481_destination: "C4C-MY323481",
		c4c_my500047_destination: "c4c-my500047",
		c4c_my500047_basic_destination: "C4C-my500047-BASIC",
		c4c_service_destination: "SAP_CLOUD_EXT_SERVICE",
		c4c_relative_path: "/sap/c4c/odata/cust/v1/c4cext/",

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