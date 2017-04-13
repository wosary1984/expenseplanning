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

	flatTree: function(tree, dimensions) {
		var res = [];
		var simpleId = -1;

		function addNodes(entry, parentId) {
			if (entry && entry.length > 0) {
				entry.forEach(function(node) {
					var nodeId = ++simpleId;
					res.push({
						NodeLevel: node.level,
						PlanningExpense: {
							currencyCode: node.Currency,
							content: "" + node.planningAmount
						},
						PlanedExpense: {
							currencyCode: node.Currency
						},
						UsedExpense: {
							currencyCode: node.Currency
						},
						DimensionID: node.DimensionId,
						DimensionItemRef: node.DimensionItemRef,
						Name: node.text,
						ExpenseNodeId: "" + simpleId,
						ParentExpenseNodeId: "" + parentId
					});
					// Recursively add nodes
					if (node.nodes)
						addNodes(node.nodes, nodeId);
				});
				return;
			} else {
				// if not have node, return 
				return;
			}
		}
		addNodes(tree.nodes, -1);
		return res;
	},

	reConstructTree: function(expenseNodes) {
		// result
		var Tree = {
			nodes: []
		};
		// use this map to retrive node by id
		var dataMap = expenseNodes.reduce(function(pre, cur) {
			pre[cur.ExpenseNodeId] = cur;
			return pre;
		}, {});
		// construct tree
		expenseNodes.forEach(function(node) {
			if (node.ParentExpenseNodeId > -1) {
				var parentNode = dataMap[node.ParentExpenseNodeId];
				parentNode.nodes = parentNode.nodes || [];
				parentNode.nodes.push(node);
			} else {
				Tree.nodes.push(node);
			}
		});
		return Tree;
	}
};