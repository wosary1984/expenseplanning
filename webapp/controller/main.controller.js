sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.sap.testcom.sap.test.controller.main", {
		c4c_MY323481_basic_destination: "C4C-MY323481-BASIC",
		c4c_MY323481_destination: "C4C-MY323481",
		c4c_my500047_destination: "c4c-my500047",
		c4c_service_destination:"SAP_CLOUD_EXT_SERVICE",
		onMY323481Clicked: function(oEvent) {
			var sUrl = this.c4c_MY323481_destination + "/sap/c4c/odata/v1/c4codata/AccountCollection?$format=json";
			$.ajax({
				url: sUrl,
				async: true,
				type: "GET",
				dataType: "json",
				contentType: "application/json"
			}).done(function(data) {
				console.log(data);

			}).fail(function(error) {
				console.error(error);
			});
		},
		onMY323481BasicClicked: function(oEvent) {
			var sUrl = this.c4c_MY323481_basic_destination + "/sap/c4c/odata/v1/c4codata/AccountCollection?$format=json";
			$.ajax({
				url: sUrl,
				async: true,
				type: "GET",
				dataType: "json",
				contentType: "application/json"
			}).done(function(data) {
				console.log(data);

			}).fail(function(error) {
				console.error(error);
			});
		},
		onmy500047Clicked: function(oEvent) {
			var sUrl = this.c4c_my500047_destination + "/sap/c4c/odata/v1/c4codata/AccountCollection?$format=json";
			$.ajax({
				url: sUrl,
				async: true,
				type: "GET",
				dataType: "json",
				contentType: "application/json"
			}).done(function(data) {
				console.log(data);

			}).fail(function(error) {
				console.error(error);
			});
		},

		initFunction:function(){
			var sUrl = this.c4c_my500047_destination + "/sap/c4c/odata/cust/v1/c4cext/CostPlanSimpleRootCollection?$format=json";
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
		
		initFunction2:function(){
			var sUrl = this.c4c_service_destination + "/api/test2";
			var oList = this.getView().byId("c4c_data2");
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
		
		onInit: function(evt) {
			this.initFunction();
			this.initFunction2();
		}
	});
});