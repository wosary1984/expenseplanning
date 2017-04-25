jQuery.sap.declare("com.sap.expenseplanning.util.Formatter");
com.sap.expenseplanning.util.Formatter = {

	str2Float: function(value) {
		return parseFloat(value);
	},

	valuteState: function(text) {
		if (text === "") {
			return "Error";
		} else {
			return "None";
		}

	},

	levelToLanesPosition: function(level) {
		if (Number(level) > 0) {
			return (Number(level) - 1);
		}

	},

	oDateStr: function(dateStr) {
		return "/Date(" + (new Date(dateStr)).getTime() + ")/";
	},

	oTimeStamp2Date: function(str) {
		var result = "";
		if (str) {
			var tmpDate = new Date(parseInt(str.replace(/[^0-9]+/g, "")));
			result = tmpDate.toLocaleDateString();
		}
		return result;
	},

	flatTree: function(tree) {
		var res = [];
		var simpleId = -1;

		function addNodes(entry, parent) {
			if (entry && entry.length > 0) {
				entry.forEach(function(node) {
					var nodeId = ++simpleId;
					// this item fields will be used in its children
					var node_item = {
						// if node not have "level" field, it maybe the root node
						NodeLevel: node.level || 0,
						PlanningExpense: {
							currencyCode: node.Currency,
							content: "" + node.planningAmount
						},
						PlanedExpense: {
							currencyCode: node.Currency
						},
						// this is a bo Misspell;
						TreeHighet: node.height,
						// if node have nodes field ,and nodes field have content, will give false(not leaf)
						IsLeaf: node.nodes ? node.nodes < 1 : true,
						UsedExpense: {
							currencyCode: node.Currency
						},
						DimensionID: node.DimensionId,
						DimensionItemRef: node.DimensionItemRef,
						Name: (parent && (parent.Name + "-") || "") + node.text,
						ExpenseNodeId: "" + nodeId,
						ParentExpenseNodeId: (parent && parent.ExpenseNodeId) || ""
					};
					res.push(node_item);
					// Recursively add nodes
					if (node.nodes)
						addNodes(node.nodes, node_item);
				});
				return;
			} else {
				// if not have node, return 
				return;
			}
		}
		addNodes(tree.nodes);
		return res;
	},

	reConstructTree: function(expensePlanWithExpandInfo) {

		// this function is used to constrcut a hirerachy Tree, from flat nodes

		// please make sure field of expenseplannode is correct
		var expenseNodes = expensePlanWithExpandInfo.BO_ExpensePlanExpenseNode;
		
		// result
		var Tree;

		if (expenseNodes) {
			// use this map to retrive node by id
			var dataMap = expenseNodes.reduce(function(pre, cur) {
				pre[cur.ExpenseNodeId] = cur;
				return pre;
			}, {});
			// construct tree
			for (var nodeId in dataMap) {
				var node = dataMap[nodeId];
				if (node.ParentExpenseNodeId) {
					var parentNode = dataMap[node.ParentExpenseNodeId];
					parentNode.nodes = parentNode.nodes || [];
					parentNode.nodes.push(node);
				} else {
					Tree = node;
				}
			}
		}

		// FormatTreeExpenseInfo
		Tree.Name = expensePlanWithExpandInfo.ExpensePlanName;
		// refresh this tree expense info 
		// c4c will calculate it, so ignore calculate process in ui5
		// this.calculateTreeExpense(Tree);
		return Tree;
	},

	calculateTreeExpense: function(root) {

		// this function use to refresh the planning/planed/used field of each node

		var strNumAdd = function(a, b) {
			var decimalPlaces = 6;
			return (parseFloat(a) + parseFloat(b)).toFixed(decimalPlaces);
		};

		var updateParentNodeExpense = function(node, parent) {
			// update currnet node expense use info firstly
			// if node is leaf node, will skip this process
			if (node.nodes) {
				node.nodes.forEach(function(child) {
					updateParentNodeExpense(child, node);
				});
			}
			// update expense usage info of the parent of currnet node
			if (parent) {
				// planning expense should not be fixed
				parent.UsedExpense.content = strNumAdd(parent.UsedExpense.content, node.UsedExpense.content);
				parent.PlanedExpense.content = strNumAdd(parent.PlanedExpense.content, node.PlanedExpense.content);
			}
		};

		if (root && root.nodes) {
			// make sure Integrity, these fields are also used in expenseinfo view
			root.PlanningExpense = root.PlanningExpense || root.TotalBudget;
			root.PlanedExpense = root.PlanedExpense || {
				content: "0.0",
				currencyCode: root.TotalBudget.currencyCode
			};
			root.UsedExpense = root.UsedExpense || {
				content: "0.0",
				currencyCode: root.TotalBudget.currencyCode
			};
			updateParentNodeExpense(root);
		}

	}

};