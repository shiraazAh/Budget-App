var budgetController = (function () {
    //Expense and  income contructor

    var expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var income = function (id, descriptiom, value) {
        this.id = id;
        this.description = descriptiom;
        this.value = value;
    };

    // calculate total inc and exp
    var calculateExpInc = function (type) {
      var sum = 0;
      data.allItems[type].forEach( function (cur) {
          sum += cur.value
      });

      data.totalItems[type] = sum;

    };
    //A place to store all of them , to calculate as well

    var data = {
        allItems: {
            exp: [],
            inc: []
        }, totalItems: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };



    return {
        addData: function(type, des, value){
            var ID; var newItem;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1 ].id + 1
            }
            else {
                ID = 0;
            }

            if(type === 'inc') {
                newItem = new income(ID, des,value);
            }
            else if(type=== 'exp') {
                newItem = new expenses(ID, des, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, id) {
            var index, ids;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            };
        },
        calcItems: function() {

            calculateExpInc('exp');
            calculateExpInc('inc');

            // budget
            data.budget = data.totalItems.inc - data.totalItems.exp;

            //percentage
            if (data.totalItems.inc > 0){
            data.percentage = Math.round((data.totalItems.exp / data.totalItems.inc) * 100)
            } else {
                data.percentage = -1
            }

        },
        toGetBudget: function() {
            return{
                totBudget: data.budget,
                totIncome: data.totalItems.inc,
                totExpense: data.totalItems.exp,
                totPercentage: data.percentage
            }
        },
        getData: function () {
            return data;
            return totPercentage;
        }
    }



})();

var UIcontroller = (function () {

    //DOM of everything
    var DOM = {
        inputExpType: ".button-exp",
        inputIncType: ".button-inc",
        inputExpDescription: ".userbox-exp-desc",
        inputIncDescription: ".userbox-inc-desc",
        inputExpValue: ".userbox-exp-value",
        inputIncValue: ".userbox-inc-value",
        budgetLabel: ".budget-amount",
        expenseLabel: ".expense-amount",
        incomeLabel: ".income-amount",
        expenseContainer: ".expenses-list",
        incomeContainer: ".income-list",
        blockExp: ".block-exp",
        blockInc: ".block-inc"
    };


//Getting value
    return {
        getExpense: function () {
            return {
                type: document.querySelector(DOM.inputExpType).value,
                description: document.querySelector(DOM.inputExpDescription).value,
                value: parseFloat(document.querySelector(DOM.inputExpValue).value)
            }
        },
        getIncome: function () {
            return {
                type: document.querySelector(DOM.inputIncType).value,
                description: document.querySelector(DOM.inputIncDescription).value,
                value: parseFloat(document.querySelector(DOM.inputIncValue).value)
            }
        },
        clearFieldsExp: function () {

            var fields; var fieldsArr;
            fields = document.querySelectorAll(DOM.inputExpDescription + ', ' + DOM.inputExpValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (cur, i, arr) {
                cur.value = "";
            });
            fieldsArr[0].focus();
        },
        clearFieldsInc: function () {

            var fields; var fieldsArr;
            fields = document.querySelectorAll(DOM.inputIncDescription + ', ' + DOM.inputIncValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (cur, i, arr) {
                cur.value = "";
            });
            fieldsArr[0].focus();
        },
        showCalc: function(obj){
            var per;
            document.querySelector(DOM.budgetLabel).textContent = obj.totBudget;
            document.querySelector(DOM.expenseLabel).textContent = obj.totExpense;
            document.querySelector(DOM.incomeLabel).textContent = obj.totIncome;
            per = obj.totPercentage;
            document.querySelector(".percent-age").textContent = per;
            document.querySelector(".gauge").setAttribute("data-value-text", obj.totPercentage)
        },
        /*
        showPer: function(obj) {
            return{
                ped: obj.totPercentage
            }
        },*/
        addListItem: function(obj, type){
            var html, newHtml, element;
                // html content
                if(type === 'exp') {
                    element = DOM.expenseContainer;
                    html = '<tr class="item" id="exp-%id%"> <td class="label-cell">%description%</td> <td class="numeric-cell">%value%</td> <td class="actions-cell"> <a class="link icon-only"> <i class="f7-icons size-28">trash</i> </a> </td> </tr>'
                }
                if(type ==='inc') {
                    element = DOM.incomeContainer;
                    html = '<tr class="item" id="inc-%id%"> <td class="label-cell">%description%</td> <td class="numeric-cell">%value%</td> <td class="actions-cell"> <a class="link icon-only"> <i class="f7-icons size-28">trash</i> </a> </td> </tr>'
                }

                //replace placeholder text with data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);

            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function(selectorID) {
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el)
        },
        DOMout: function () {
            return DOM;
        }
    }

})();

var controller = (function (bugtCntrl, UICntrl) {

    //calling DOM
    var DOMstrings = UICntrl.DOMout();
    //seting up event listeners for buttons
    var setupButtons = function() {
        document.querySelector(DOMstrings.inputExpType).addEventListener("click", addExpense);
        document.querySelector(DOMstrings.inputIncType).addEventListener("click", addIncome);
        document.querySelector(DOMstrings.blockExp).addEventListener("click", deleteExpense);
        document.querySelector(DOMstrings.blockInc).addEventListener("click", deleteExpense);
    };

    //updateBudget
    var updateBudget = function () {
        //call calc
        bugtCntrl.calcItems();
        //return value
        var budget = bugtCntrl.toGetBudget();
        //Show in UI
        UICntrl.showCalc(budget);
    };

    /*
    var updateForPercentage = function () {
        //call calc
        bugtCntrl.calcItems();
        //return value
        var budget = bugtCntrl.toGetBudget();
        //return value of percentage
        document.getElementById("gauge-id").setAttribute("data-value-text", UICntrl.showPer(budget).ped);
    };
    */

    //add Expense call
    var addExpense = function() {
        var inputExp, newItemExp;
        inputExp = UICntrl.getExpense();

        //add expense item
        if(inputExp.description !== "" && !isNaN(inputExp.value) && inputExp.value > 0 ) {
           newItemExp = bugtCntrl.addData(inputExp.type, inputExp.description, inputExp.value);
        }
        else {
            alert("Add value or description")
        };

        //display expense
        UICntrl.addListItem(newItemExp, inputExp.type);
        //clear fields
        UICntrl.clearFieldsExp();

        //upadate budget
        updateBudget();

        /*     to show that totperc is working
        var x = document.querySelector(".gauge").getAttribute("data-value-text");
        console.log(x); */
    };

    //delete Epense
    var deleteExpense = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }

        // delete item from budget controller
        bugtCntrl.deleteItem(type, ID);

        // Delete the item from UI
        UICntrl.deleteListItem(itemID);

        // update the budget and show new budget
        updateBudget();
    };

    //add Income call
    var addIncome = function() {
        var inputInc, newItemInc;
        inputInc = UICntrl.getIncome();

        //add income items
        if(inputInc.description !== "" && !isNaN(inputInc.value) && inputInc.value > 0 ) {
            newItemInc = bugtCntrl.addData(inputInc.type, inputInc.description, inputInc.value);
        }
        else {
            alert("Add value or description")
        }

        //clear fields
        UICntrl.clearFieldsInc();

        //display Income
        //display expense
        UICntrl.addListItem(newItemInc, inputInc.type);

        //upadate budget
        updateBudget();

    };

    return {
        init: function () {
            console.log("App Started");
            UICntrl.showCalc({
                totBudget: 0,
                totIncome: 0,
                totExpense: 0,
                totPercentage: -1
            });
            setupButtons();
        },
    }


    //clear fields

    //add UI


})(budgetController, UIcontroller);

controller.init();