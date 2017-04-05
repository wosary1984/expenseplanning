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

			this._discardToFirstStep();

		},

		_discardToFirstStep: function() {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard) {
				var oStep = sap.ui.getCore().byId("BasicStep");
				oWizard.discardProgress(oStep);
			}
		},

		_discardToSecondStep: function() {

			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard) {
				var oStep = sap.ui.getCore().byId("SetDimensionStep");
				oWizard.discardProgress(oStep);
			}
		},

		onAddDimension: function(oEvent) {
			var oSourceList = sap.ui.getCore().byId("idAvaiableDimensions");
			var oTargetList = sap.ui.getCore().byId("idTargetDimensions");
			if (oSourceList) {
				var oItem = oSourceList.getSelectedItem();

				if (oItem) {
					var path = oItem.getBindingContext("dimension").getPath();
					var object = oItem.getBindingContext("dimension").getObject();

					var oData = oSourceList.getModel("dimension").getData();
					var temp = path.split("/");
					oData.DimensionCollection.splice(temp[temp.length - 1], 1);
					oSourceList.getModel("dimension").setData(oData);

					var oTargetData = oTargetList.getModel().getData();
					//var length = oTargetData.DimensionCollection.length;
					oTargetData.DimensionCollection.push({
						name: object.key
					});
					oTargetList.getModel().setData(oTargetData);

					this._discardToSecondStep();

				}
			}
		},

		onRemoveDimension: function(oEvent) {
			var oSourceList = sap.ui.getCore().byId("idTargetDimensions");
			var oTargetList = sap.ui.getCore().byId("idAvaiableDimensions");
			if (oSourceList) {
				var oItem = oSourceList.getSelectedItem();

				if (oItem) {
					var path = oItem.getBindingContext().getPath();
					var object = oItem.getBindingContext().getObject();

					var oData = oSourceList.getModel().getData();
					var temp = path.split("/");
					oData.DimensionCollection.splice(temp[temp.length - 1], 1)
					oSourceList.getModel().setData(oData);

					var oTargetData = oTargetList.getModel("dimension").getData();
					//var length = oTargetData.DimensionCollection.length;
					oTargetData.DimensionCollection.push({
						key: object.name,
						value: object.name
					});
					oTargetList.getModel("dimension").setData(oTargetData);

					this._discardToSecondStep();

				}
			}
		},

		onUpDimension: function(oEvent) {
			var oSourceList = sap.ui.getCore().byId("idTargetDimensions");
			if (oSourceList) {
				var oItem = oSourceList.getSelectedItem();

				if (oItem) {

					var swapItems = function(arr, index1, index2) {
						arr[index1] = arr.splice(index2, 1, arr[index1])[0];
						return arr;
					};
					//var path = oItem.getBindingContext().getPath();
					//var object = oItem.getBindingContext().getObject();

					var oData = oSourceList.getModel().getData();

					var index = oSourceList.indexOfItem(oItem);

					if (index === 0) {
						return;
					}
					swapItems(oData.DimensionCollection, index, index - 1);

					oSourceList.getModel().setData(oData);
					//oSourceList.removeSelections(true);

					this._discardToSecondStep();

				}
			}
		},

		onDownDimension: function(oEvent) {
			var oSourceList = sap.ui.getCore().byId("idTargetDimensions");
			if (oSourceList) {
				var oItem = oSourceList.getSelectedItem();

				if (oItem) {

					var swapItems = function(arr, index1, index2) {
						arr[index1] = arr.splice(index2, 1, arr[index1])[0];
						return arr;
					};
					//var path = oItem.getBindingContext().getPath();
					//var object = oItem.getBindingContext().getObject();

					var oData = oSourceList.getModel().getData();

					var index = oSourceList.indexOfItem(oItem);

					if (index === oData.DimensionCollection.length) {
						return;
					}
					swapItems(oData.DimensionCollection, index, index + 1);

					oSourceList.getModel().setData(oData);
					//oSourceList.removeSelections(true);

					this._discardToSecondStep();

				}
			}
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

		handleDlgNext: function(oEvent) {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard) {
				var iProgress = oWizard.getProgress();
				window.console.log(iProgress);

				if (iProgress === 1 && this._basicStepValidation()) {
					oWizard.nextStep();
				} else if (iProgress === 2 && this._selectDimensionValidation()) {
					oWizard.nextStep();
					this._constructTreeData();
				} else if (iProgress === 3) {
					oWizard.nextStep();
				}

			}
		},

		_constructTreeData: function() {
			var oModel =this._getDialog().getModel();
			if(oModel){
				var oData = oModel.getData();
			}
		},
		_selectDimensionValidation: function() {
			var oSourceList = sap.ui.getCore().byId("idTargetDimensions");
			if (oSourceList && oSourceList.getItems().length > 0) {
				return true;
			} else {
				return false;
			}
		},

		_basicStepValidation: function() {
			var result = true;
			var oForm = sap.ui.getCore().byId("basicStepForm");
			if (oForm) {
				var oContents = oForm.getContent();

				for (var x in oContents) {
					var data = oContents[x].getCustomData();
					if (data && data.length === 1) {
						if (data[0].getValue("validation") === "NOT_NULL") {
							var path = oContents[x].getBindingPath("value");
							var value = oContents[x].getBindingContext().getModel().getProperty(path);

							if (value === "") {
								oContents[x].setValueState("Error");
								result = false;
							} else {
								oContents[x].setValueState("None");
							}
							//object = oContents[x].getBindingContext().getObject();
						}
					}
				}
			}
			return result;
		},

		setDimensionActivate: function(oEvent) {
			window.console.log("setDimensionActivate called");
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard) {
				var oSource = oEvent.getSource();
				oWizard.validateStep(oSource);
			}

		},

		basicInfoValidation: function(oEvent) {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			oWizard.validateStep(sap.ui.getCore().byId("BasicStep"));
		}

	});
});