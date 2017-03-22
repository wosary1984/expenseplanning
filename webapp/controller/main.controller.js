sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.sap.expenseplanning.controller.main", {
		c4c_MY323481_basic_destination: "C4C-MY323481-BASIC",
		c4c_MY323481_destination: "C4C-MY323481",
		c4c_my500047_destination: "c4c-my500047",
		c4c_my500047_basic_destination: "C4C-my500047-BASIC",
		c4c_service_destination: "SAP_CLOUD_EXT_SERVICE",
		c4c_relative_path: "/sap/c4c/odata/cust/v1/c4cext/",

		initFunction: function() {
			var sUrl = this.c4c_my500047_basic_destination + this.c4c_relative_path +
				"BO_ExpensePlanRootCollection?$format=json&$expand=BO_ExpensePlanExpenseNode";
			var oList = this.getView().byId("c4c_data");
			oList.setBusy(true);
			$.ajax({
				url: sUrl,
				async: true,
				type: "GET",
				dataType: "json",
				contentType: "application/json"
			}).done(function(data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data.d.results);
				oList.setModel(oModel);
				oList.setBusy(false);
			}).fail(function(error) {
				console.error(error);
				oList.setBusy(false);
			});
		},

		handleRefresh: function(oEvent) {
			this.initFunction();
		},

		onInit: function(evt) {
			this.initFunction();
		}
	});
});