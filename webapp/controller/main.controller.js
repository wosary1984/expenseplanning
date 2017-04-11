jQuery.sap.require("com.sap.expenseplanning.util.Formatter");
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

		g_current_cell_context: null,
		g_dimension_input_id: '',
		g_filter:null,

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

			// reset global variable
			this.g_current_cell_context = null;

			this._discardToFirstStep();

		},

		_discardToFirstStep: function() {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard) {
				var oStep = sap.ui.getCore().byId("BasicStep");
				oWizard.discardProgress(oStep);
			}
			this._setWizardNextButtonText("next");
		},

		_discardToSecondStep: function() {

			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard) {
				var oStep = sap.ui.getCore().byId("SetDimensionStep");
				oWizard.discardProgress(oStep);
			}
			this._setWizardNextButtonText("next");
		},
		onItemPressed: function(oEvent) {
			///alert("asd");
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
					oData.d.results.splice(temp[temp.length - 1], 1);
					oSourceList.getModel("dimension").setData(oData);

					var oTargetData = oTargetList.getModel().getData();
					// var length = oTargetData.DimensionCollection.length;
					oTargetData.DimensionCollection.push({
						DimensionName: object.DimensionName,
						DimensionId: object.DimensionId,
						IsMasterData: object.DimensionName,
						DimensionDesc: object.IsMasterData,
						MD_BOName: object.MD_BOName,
						MD_DescField: object.MD_DescField,
						MD_NameField: object.MD_NameField,
						IsCategory: true
					});

					this._reOrderDimension(oTargetData.DimensionCollection);

					oTargetData.height = oTargetData.DimensionCollection.length;
					oTargetList.getModel().setData(oTargetData);

					this._discardToSecondStep();

				}
			}
		},

		_reOrderDimension: function(DimensionCollection) {
			for (var x in DimensionCollection) {
				if (DimensionCollection[x]) {
					DimensionCollection[x].level = Number(x) + 1;

					for (var y in DimensionCollection[x].nodes) {
						if (DimensionCollection[x].nodes[y]) {
							DimensionCollection[x].nodes[y].level = DimensionCollection[x].level;
						}
					}
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
					oData.DimensionCollection.splice(temp[temp.length - 1], 1);
					oData.height = oData.DimensionCollection.length;
					this._reOrderDimension(oData.DimensionCollection);
					oSourceList.getModel().setData(oData);

					var oTargetData = oTargetList.getModel("dimension").getData();
					// var length = oTargetData.DimensionCollection.length;
					oTargetData.d.results.push({
						DimensionName: object.DimensionName,
						DimensionId: object.DimensionId,
						IsMasterData: object.DimensionName,
						DimensionDesc: object.IsMasterData,
						MD_BOName: object.MD_BOName,
						MD_DescField: object.MD_DescField,
						MD_NameField: object.MD_NameField
					});
					oTargetList.getModel("dimension").setData(oTargetData);

					this._discardToSecondStep();

				}
			}
		},
		onTreeTableUpDimension: function(oEvent) {
			var oSource = oEvent.getSource();
			var object = oSource.getBindingContext().getObject();
			var oSourceList = sap.ui.getCore().byId("idTargetDimensions");
			if (object && object.IsCategory) {
				var swapItems = function(arr, index1, index2) {
					arr[index1] = arr.splice(index2, 1, arr[index1])[0];
					return arr;
				};

				var oData = oSource.getModel().getData();

				var index = object.level - 1;

				if (index === 0) {
					return;
				}
				swapItems(oData.DimensionCollection, index, index - 1);
				this._reOrderDimension(oData.DimensionCollection);
				oSourceList.getModel().setData(oData);
				// oSourceList.removeSelections(true);

				this._discardToSecondStep();
			}
		},

		onRemoveButtonPress: function(oEvent) {
			var oSource = oEvent.getSource();
			var path = oSource.getBindingContext().getPath();
			var object = oSource.getBindingContext().getObject();
			var oSourceList = sap.ui.getCore().byId("idTargetDimensions");
			var oTargetList = sap.ui.getCore().byId("idAvaiableDimensions");
			var oData = oSourceList.getModel().getData();
			if (object && object.IsCategory) {

				if (oSourceList) {
					
					var temp = path.split("/");
					oData.DimensionCollection.splice(temp[temp.length - 1], 1);
					oData.height = oData.DimensionCollection.length;
					this._reOrderDimension(oData.DimensionCollection);
					oSourceList.getModel().setData(oData);

					var oTargetData = oTargetList.getModel("dimension").getData();
					// var length = oTargetData.DimensionCollection.length;
					oTargetData.d.results.push({
						DimensionName: object.DimensionName,
						DimensionId: object.DimensionId,
						IsMasterData: object.DimensionName,
						DimensionDesc: object.IsMasterData,
						MD_BOName: object.MD_BOName,
						MD_DescField: object.MD_DescField,
						MD_NameField: object.MD_NameField
					});
					oTargetList.getModel("dimension").setData(oTargetData);

					this._discardToSecondStep();
				}
			} else if (object && !object.IsCategory) {
				var temp = path.split("/");
				var currentIndex = temp[temp.length - 1];
				temp.splice(temp.length - 1, 1);
				var sParentPath = temp.join("/");
				var oParentObject = oSourceList.getModel().getProperty(sParentPath);
				oParentObject.splice(temp[temp.length - 1], 1);
				oSourceList.getModel().setData(oData);

				this._discardToSecondStep();
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
					// var path = oItem.getBindingContext().getPath();
					// var object = oItem.getBindingContext().getObject();

					var oData = oSourceList.getModel().getData();

					var index = oSourceList.indexOfItem(oItem);

					if (index === 0) {
						return;
					}
					swapItems(oData.DimensionCollection, index, index - 1);
					this._reOrderDimension(oData.DimensionCollection);
					oSourceList.getModel().setData(oData);
					// oSourceList.removeSelections(true);

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
					// var path = oItem.getBindingContext().getPath();
					// var object = oItem.getBindingContext().getObject();

					var oData = oSourceList.getModel().getData();

					var index = oSourceList.indexOfItem(oItem);

					if ((index + 1) === oData.DimensionCollection.length) {
						return;
					}
					swapItems(oData.DimensionCollection, index, index + 1);
					this._reOrderDimension(oData.DimensionCollection);
					oSourceList.getModel().setData(oData);
					// oSourceList.removeSelections(true);

					this._discardToSecondStep();

				}
			}
		},

		onTreeTableDownDimension: function(oEvent) {
			var oSource = oEvent.getSource();
			var object = oSource.getBindingContext().getObject();
			var oSourceList = sap.ui.getCore().byId("idTargetDimensions");
			if (object && object.IsCategory) {
				var swapItems = function(arr, index1, index2) {
					arr[index1] = arr.splice(index2, 1, arr[index1])[0];
					return arr;
				};
				// var path = oItem.getBindingContext().getPath();
				// var object = oItem.getBindingContext().getObject();

				var oData = oSource.getModel().getData();

				var index = object.level - 1;

				if ((index + 1) === oData.DimensionCollection.length) {
					return;
				}
				swapItems(oData.DimensionCollection, index, index + 1);
				this._reOrderDimension(oData.DimensionCollection);
				oSourceList.getModel().setData(oData);
				// oSourceList.removeSelections(true);

				this._discardToSecondStep();
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
			var sUrl = this.c4c_my500047_basic_destination + this.c4c_relative_path +
				"BO_ExpenseDimensionRootCollection?$format=json";
			AjaxUtil.asynchGetJSON(this, sUrl, function(data) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data);
				dialog.setModel(oModel, "dimension");
			}, function() {
				
				//remove below code in future
				var dimensionModelPath = jQuery.sap.getModulePath("com.sap.expenseplanning", "/model/dimension_sample.json");
				var dimensionModel = new sap.ui.model.json.JSONModel();
				dimensionModel.loadData(dimensionModelPath, null, false);
				dialog.setModel(dimensionModel, "dimension");
			}, function() {});

			//
			var selectedDimensionModelPath = jQuery.sap.getModulePath("com.sap.expenseplanning", "/model/selected_dimension_template.json");
			var selectedDimensionModel = new sap.ui.model.json.JSONModel();
			selectedDimensionModel.loadData(selectedDimensionModelPath, null, false);
			dialog.setModel(selectedDimensionModel, "selected_dimension");
			//
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

		onDialogClose: function() {
			if (this.oCreateDialog) {
				return this.oCreateDialog.close();
			}
		},

		onDialogAfterClose: function() {
			if (this.oCreateDialog) {
				// this.oCreateDialog.destroy();
				// this.oCreateDialog = null;
			}
		},

		onWizardNext: function(oEvent) {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard) {
				var iProgress = oWizard.getProgress();
				// window.console.log(iProgress);

				if (iProgress === 1 && this._basicStepValidation()) {
					oWizard.nextStep();
				} else if (iProgress === 2 && this._selectDimensionValidation()) {
					oWizard.nextStep();
					this._constructTreeData();

					// change next button text to preview
					this._setWizardNextButtonText("preview");

				} else if (iProgress === 3) {
					if (this._thirdStepValidation()) {
						var oNavContainer = sap.ui.getCore().byId("wizardContainer");
						oNavContainer.to(this._getReviewPage());
					} else {

					}
				}

			}
		},

		_getReviewPage: function() {
			if (this._oWizardReviewPage) {
				return this._oWizardReviewPage;
			}
			this._oWizardReviewPage = sap.ui.xmlfragment("com.sap.expenseplanning.view.review", this);
			var oNavContainer = sap.ui.getCore().byId("wizardContainer");
			oNavContainer.addPage(this._oWizardReviewPage);
			return this._oWizardReviewPage;
		},

		_thirdStepValidation: function() {
			var result = true;
			var oData = this._getDialog().getModel().getData();
			var validateNode = function(node) {
				var r = true;
				if (node.valueState !== "None" || node.text === "")
					return false;
				else {
					for (var x in node.nodes) {
						r = validateNode(node.nodes[x]);
						if (!r)
							break;
					}
				}
				return result;
			};
			if (oData) {
				result = validateNode(oData.Tree[0]);
			}
			return result;
		},

		_setWizardNextButtonText: function(text) {
			var oButton = sap.ui.getCore().byId("idWizardNext");
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			oButton.setText(oBundle.getText(text));
		},

		_constructTreeData: function() {
			var oModel = this._getDialog().getModel();
			if (oModel) {
				var oData = oModel.getData();

				var oTreeData = {};

				oTreeData.text = oData.planningName;
				oTreeData.planningAmount = Number(oData.planningAmount);
				oTreeData.planningAmount = Number(oData.planningAmount);
				oTreeData.Currency = oData.planningAmountCurrency;
				oTreeData.level = 0;
				oTreeData.height = oData.height;
				oTreeData.valueState = "None";
				oTreeData.valueStateText = "";

				this._constructTreeNode(oTreeData, oData.DimensionCollection);

				oData.Tree[0] = oTreeData;

				this._getDialog().getModel().setData(oData);
			}
		},

		_constructTreeNode: function(parent, dimensions) {
			if (parent.level !== parent.height) {
				if (dimensions[parent.level]) {
					var iAverage = parseInt(parent.planningAmount / dimensions[parent.level].nodes.length);
					var iResidue = parent.planningAmount % dimensions[parent.level].nodes.length;

					for (var x in dimensions[parent.level].nodes) {
						var child = {};
						if (Number(x) === dimensions[parent.level].nodes.length - 1) {
							child.planningAmount = iAverage + iResidue;
						} else {
							child.planningAmount = iAverage;
						}
						child.parentAmount = parent.planningAmount;
						child.text = dimensions[parent.level].nodes[x].DimensionName;
						child.Currency = parent.Currency;
						child.level = parent.level + 1;
						child.height = parent.height;
						child.valueState = "None";
						child.valueStateText = "Enter Planning Amount";
						if (!parent.nodes) {
							parent.nodes = [];
						}
						this._constructTreeNode(child, dimensions);
						parent.nodes.push(child);
					}

				}
			}

		},

		_selectDimensionValidation: function() {
			var oSourceList = sap.ui.getCore().byId("idTargetDimensions");
			var oData = oSourceList.getModel().getData();
			var result = true;
			if (oData.DimensionCollection.length > 0) {

				for (var x in oData.DimensionCollection) {
					if (!oData.DimensionCollection[x].nodes || oData.DimensionCollection[x].nodes.length === 0) {
						sap.m.MessageToast.show("No Dimension Item in " + oData.DimensionCollection[x].DimensionName);
						result = false;
						break;
					}
				}

			} else {
				sap.m.MessageToast.show("Please Set at least One Dimention");
				return false;
			}
			return result;
		},

		_basicStepValidation: function() {
			var result = true;
			var oForm = sap.ui.getCore().byId("basicStepForm");
			if (oForm) {
				var oContents = oForm.getContent();

				for (var x in oContents) {
					var oCustData = oContents[x].getCustomData();
					for (var m in oCustData) {
						if (oCustData[m].getKey() === "validation") {
							if (oCustData[0].getValue() === "NOT_NULL") {
								var path = oContents[x].getBindingPath("value");
								var value = oContents[x].getBindingContext().getModel().getProperty(path);

								if (value === "") {
									oContents[x].setValueState("Error");
									result = false;
								} else {
									oContents[x].setValueState("None");
								}
								// object =
								// oContents[x].getBindingContext().getObject();
							}
							break;
						}
					}
				}
			}
			return result;
		},

		setDimensionActivate: function(oEvent) {
			// window.console.log("setDimensionActivate called");
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			if (oWizard) {
				var oSource = oEvent.getSource();
				oWizard.validateStep(oSource);
			}

		},

		basicInfoValidation: function(oEvent) {
			var oWizard = sap.ui.getCore().byId("CreateExpensePlanWizard");
			oWizard.validateStep(sap.ui.getCore().byId("BasicStep"));
		},

		onAddChildButtonPress: function(oEvent) {
			if (this.g_current_cell_context) {
				var sPath = this.g_current_cell_context.getPath();
				var object = this.g_current_cell_context.getModel().getObject(sPath);
				var child = {};
				child.planningAmount = 0;
				child.parentAmount = object.planningAmount;
				child.text = "";
				child.Currency = "CNY";
				child.level = object.level + 1;
				child.height = object.height;
				child.valueState = "Error";
				child.valueStateText = "Enter Planning Amount";
				if (!object.nodes) {
					object.nodes = [];
				}
				object.nodes.push(child);
				this.g_current_cell_context.getModel().updateBindings();
			}
		},

		onAddChildDimensionButtonPress: function(oEvent) {
			if (this.g_current_cell_context) {
				var sPath = this.g_current_cell_context.getPath();
				var object = this.g_current_cell_context.getModel().getObject(sPath);
				var child = {};
				child.DimensionDesc = "";
				child.DimensionId = "";
				child.DimensionName = "";
				child.level = object.level;
				child.IsCategory = false;
				if (!object.nodes) {
					object.nodes = [];
				}
				object.nodes.push(child);
				this.g_current_cell_context.getModel().updateBindings();
				this._discardToSecondStep();
			}
		},

		onCellClicked: function(oEvent) {
			var context = oEvent.getParameter("rowBindingContext");
			this.g_current_cell_context = context;
		},

		onValueHelpPress: function(oEvent) {

			this.g_dimension_input_id = oEvent.getSource().getId();

			var oSource = oEvent.getSource();
			var oCustData = oSource.getCustomData();
			var level = 0;
			for (var x in oCustData) {
				if (oCustData[x].getKey() === "level") {
					level = oCustData[x].getValue();
					break;
				}
			}

			if (level !== 0) {
				var oData = this._getDialog().getModel().getData();
				var dimension = oData.DimensionCollection[level - 1];
					if (!this._oValueHelpDialog) {
						this._oValueHelpDialog = sap.ui.xmlfragment("com.sap.expenseplanning.view.valueHelp", this);
					}
					
					var sUrl = this.c4c_my500047_basic_destination + this.c4c_relative_path +
					"BO_ExpenseDimensionItemRootCollection?$format=json";
					var oModel =this._oValueHelpDialog.getModel();
					
					if(oModel){
						this.g_filter = new sap.ui.model.Filter("DimensionTypeID", sap.ui.model.FilterOperator.EQ, dimension.DimensionId);
						oModel.updateBindings();
						this._oValueHelpDialog.getBinding("items").filter([this.g_filter]);
						
					}else{
						AjaxUtil.asynchGetJSON(this, sUrl, function(data) {
							oModel = new sap.ui.model.json.JSONModel();
							oModel.setData(data);
							
							this._oValueHelpDialog.setModel(oModel);
							this.g_filter  = new sap.ui.model.Filter("DimensionTypeID", sap.ui.model.FilterOperator.EQ, dimension.DimensionId);
							oModel.updateBindings();
							this._oValueHelpDialog.getBinding("items").filter([this.g_filter ]);
							
							
						}, function() {
							var sPath = jQuery.sap.getModulePath("com.sap.expenseplanning", "/model/dimension_item_sample.json");
							oModel = new sap.ui.model.json.JSONModel();
							oModel.loadData(sPath, null, false);
							
							this._oValueHelpDialog.setModel(oModel);
							this.g_filter  = new sap.ui.model.Filter("DimensionTypeID", sap.ui.model.FilterOperator.EQ, dimension.DimensionId);
							oModel.updateBindings();
							this._oValueHelpDialog.getBinding("items").filter([this.g_filter ]);
							
						}, function() {});
					}
					// toggle compact style
					jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oValueHelpDialog);
					this._oValueHelpDialog.open();
			}
		},

		_createDataModel: function(dimension) {
			
			var sUrl = this.c4c_my500047_basic_destination + this.c4c_relative_path +
			"BO_ExpenseDimensionItemRootCollection?$format=json";
			var oModel ;
			
			AjaxUtil.asynchGetJSON(this, sUrl, function(data) {
				oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data);
				return oModel;
			}, function() {
				var sPath = jQuery.sap.getModulePath("com.sap.expenseplanning", "/model/dimension_item_sample.json");
				oModel = new sap.ui.model.json.JSONModel();
				oModel.loadData(sPath, null, false);
				return oModel;
			}, function() {});
	
		},

		onSelectSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("ItemId", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter,this.g_filter ]);
		},

		onSelectClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var oInput = sap.ui.getCore().byId(this.g_dimension_input_id);
				var sDescription = oSelectedItem.getDescription();
				var sTitle = oSelectedItem.getTitle();

				oInput.setValue(sTitle + "("+ sDescription +")");

				this._discardToSecondStep();
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		onPlanningAmountChange: function(oEvent) {
			var newValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();
			var oModel = oSource.getBindingContext().getModel();
			var sPath = oSource.getBindingContext().getPath();
			var oCurrentObject = oModel.getProperty(sPath);

			var temp = sPath.split("/");
			var currentIndex = temp[temp.length - 1];
			temp.splice(temp.length - 1, 1);
			var sParentPath = temp.join("/");

			var objects = oModel.getProperty(sParentPath);

			var iTotal = 0;
			var iParent = Number(oCurrentObject.parentAmount);
			for (var x in objects) {
				if (x !== currentIndex) {
					iTotal += Number(objects[x].planningAmount);

					// clear other planning amount value state
					objects[x].valueState = "None";
					objects[x].valueStateText = "";
				}
			}

			if (iTotal + Number(newValue) !== iParent) {
				oSource.setValueState("Error");
				oSource.setValueStateText("Childs Total Planning Amount is not Match Parent Amount!");
			} else {
				oSource.setValueState("None");
			}

		},

		onWizardReviewBack: function(oEvent) {
			var oNavContainer = sap.ui.getCore().byId("wizardContainer");
			oNavContainer.backToPage("wizardContentPage");
		},

		onDimensionTextChange: function(oEvent) {
			this._discardToSecondStep();
		},

		onTitlePressed: function(oEvent) {}

	});
});