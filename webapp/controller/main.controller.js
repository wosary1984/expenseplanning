sap.ui.define([
	"com/sap/expenseplanning/controller/BaseController",
	"com/sap/expenseplanning/util/AjaxUtil"
], function(BaseController, AjaxUtil) {
	"use strict";

	return BaseController.extend("com.sap.expenseplanning.controller.main", {
		initFunction: function() {
			var doneCallback = function(data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data.d.results);
				var oList = this.getView().byId("c4c_data");
				oList.setModel(oModel);
				oList.setBusy(false);
			};

			var failCallback = function() {};

			var alwaysCallback = function() {
				var oList = this.getView().byId("c4c_data");
				oList.setBusy(false);
			};

			var sUrl = this.c4c_my500047_basic_destination + this.c4c_relative_path +
				"BO_ExpensePlanRootCollection?$format=json&$expand=BO_ExpensePlanExpenseNode";
			var oList = this.getView().byId("c4c_data");
			oList.setBusy(true);
			return AjaxUtil.asynchGetJSON(this,
				sUrl, doneCallback, failCallback, alwaysCallback);
		},

		handleRefresh: function(oEvent) {
			this.initFunction();
		},

		onInit: function(evt) {
			this.initFunction();
		}
	});
});