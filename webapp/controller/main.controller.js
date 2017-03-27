sap.ui.define([
	"com/sap/expenseplanning/controller/BaseController",
	"com/sap/expenseplanning/util/AjaxUtil"
], function(BaseController, AjaxUtil) {
	"use strict";

	return BaseController.extend("com.sap.expenseplanning.controller.main", {
		c4c_my323481_basic_destination: "C4C-MY323481-BASIC",
		c4c_MY323481_destination: "C4C-MY323481",
		c4c_my500047_destination: "c4c-my500047",
		c4c_my500047_basic_destination: "C4C-my500047-BASIC",
		c4c_service_destination: "SAP_CLOUD_EXT_SERVICE",
		c4c_relative_path: "/sap/c4c/odata/cust/v1/c4cext/",
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

		handleCreate: function(oEvent) {
			var oCreateDialog = this._getDialog();

			// set create dialog model
			this._setCreateModel(oCreateDialog);

			oCreateDialog.open();
		},

		handleDlgNext: function(oEvent) {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard)
				oWizard.nextStep();
		},

		onInit: function(evt) {
			this.initFunction();
		},
		_setCreateModel: function(dialog) {
			var dialogModelPath = jQuery.sap.getModulePath("com.sap.expenseplanning", "/model/new_plan_template.json");
			var dialogModel = new sap.ui.model.json.JSONModel();
			dialogModel.loadData(dialogModelPath, null, false);
			dialog.setModel(dialogModel);

			//
			var dimensionModelPath = jQuery.sap.getModulePath("com.sap.expenseplanning", "/model/dimension_sample.json");
			var dimensionModel = new sap.ui.model.json.JSONModel();
			dimensionModel.loadData(dimensionModelPath, null, false);
			dialog.setModel(dimensionModel, "dimension");

			//
			var selectedDimensionModelPath = jQuery.sap.getModulePath("com.sap.expenseplanning", "/model/selected_dimension_template.json");
			var selectedDimensionModel = new sap.ui.model.json.JSONModel();
			selectedDimensionModel.loadData(selectedDimensionModelPath, null, false);
			dialog.setModel(selectedDimensionModel, "selected_dimension");
			//
			var treeModelPath = jQuery.sap.getModulePath("com.sap.expenseplanning", "/model/tree_sample.json");
			var treeModel = new sap.ui.model.json.JSONModel();
			treeModel.loadData(treeModelPath, null, false);
			dialog.setModel(treeModel, "tree");
		},

		_getDialog: function() {
			if (this.oCreateDialog) {
				return this.oCreateDialog;
			}

			// associate controller with the fragment
			this.oCreateDialog = sap.ui.xmlfragment("com.sap.expenseplanning.view.wizard", this);
			this.getView().addDependent(this.oCreateDialog);

			/*this.getView().setModel(new sap.ui.model.resource.ResourceModel({
				bundleName: "com.sap.expenseplanning.i18n.i18n"
			}), "i18n");*/

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oCreateDialog);

			return this.oCreateDialog;
		},

		handleDlgClose: function() {
			if (this.oCreateDialog) {
				return this.oCreateDialog.close();
			}
		},

		handleDlgAfterClose: function() {
			if (this.oCreateDialog) {
				//this.oCreateDialog.destroy();
				//this.oCreateDialog = null;
			}
		},

		basicInfoValidation: function(oEvent) {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			oWizard.validateStep(sap.ui.getCore().byId("BasicStep"));
		},

		dimensionValidation: function(oEvent) {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard)
				oWizard.validateStep(sap.ui.getCore().byId("DimensionStep"));
		}

	});
});