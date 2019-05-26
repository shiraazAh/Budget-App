var budgetController = (function () {
    //Expense and  income contructor

    var expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    expenses.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    };

    expenses.prototype.getPercentage = function () {
        return this.percentage;
    };

    var income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // calculate total inc and exp
    var calculateExpInc = function (type) {
      var sum = 0;
      data.allItems[type].forEach(function(cur) {
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

        calculatePercentage: function() {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totalItems.inc);
            });
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        addToLocal: function(obj) {
            localStorage.setItem('budgety', obj.totBudget);
            console.log(localStorage.getItem('budgety'));
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
        blockInc: ".block-inc",
        dateContainer: ".budget-date",
        expensesToolbar: ".expenses-tab",
        incomeToolbar: ".income-tab",
        budgetToolbar: ".budget-tab"
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split(".");

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return(type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
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
            var type;

            obj.totBudget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOM.budgetLabel).textContent = formatNumber(obj.totBudget, type);
            document.querySelector(DOM.expenseLabel).textContent = formatNumber(obj.totExpense, 'exp');
            document.querySelector(DOM.incomeLabel).textContent = formatNumber(obj.totIncome, type);
            per = obj.totPercentage;
            document.querySelector(".percent-age").textContent = per;
            /*
            if (obj.percentage > 0) {
            document.querySelector(".gauge").setAttribute("data-value-text", obj.totPercentage)
            } else {
            document.querySelector(".gauge").textContent = '---'
            */
        },

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
                newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function(selectorID) {
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el)
        },
        displayMonth: function() {
          var totDate, month, year, months;

          totDate = new Date();

          month = totDate.getMonth();

          year = totDate.getFullYear();

          months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

          document.querySelector(DOM.dateContainer).textContent = months[month] + ' ' + year;
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
        /* For swiping
        if (document.getElementById('tab-1').classList.contains('tab-active')){
            document.querySelector('.navbar').classList.remove('greennavbar');
            document.querySelector('.navbar').classList.add('rednavbar');
            document.querySelector('.toolbar').classList.remove('greentoolbar');
            document.querySelector('.toolbar').classList.add('redtoolbar');
        };
        */

        document.querySelector(DOMstrings.expensesToolbar).addEventListener("click", function () {
            document.querySelector('.navbar').classList.remove('greennavbar');
            document.querySelector('.navbar').classList.add('rednavbar');
            document.querySelector('.toolbar').classList.remove('greentoolbar');
            document.querySelector('.toolbar').classList.add('redtoolbar');
        });
        document.querySelector(DOMstrings.incomeToolbar).addEventListener("click", function () {
            document.querySelector('.navbar').classList.remove('rednavbar');
            document.querySelector('.navbar').classList.add('greennavbar');
            document.querySelector('.toolbar').classList.remove('redtoolbar');
            document.querySelector('.toolbar').classList.add('greentoolbar');
        });
        document.querySelector(DOMstrings.budgetToolbar).addEventListener("click", function () {
            document.querySelector('.navbar').classList.remove('rednavbar');
            document.querySelector('.navbar').classList.remove('greennavbar');
            document.querySelector('.toolbar').classList.remove('redtoolbar');
            document.querySelector('.toolbar').classList.remove('greentoolbar');
        });
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


    var updateForPercentage = function () {

        //call calc
        bugtCntrl.calculatePercentage();

        //return value
        var percentages = bugtCntrl.getPercentages();

        //return value of percentage
        console.log(percentages);

    };


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

        //Update Percentage
        updateForPercentage()

        /*     to show that totpercentage is working
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

        //Update Percentage
        updateForPercentage()

    };

    return {
        init: function () {
            console.log("App Started");
            UICntrl.displayMonth();
            setupButtons();
        },
    }


    //clear fields

    //add UI


})(budgetController, UIcontroller);

controller.init();