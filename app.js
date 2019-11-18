                                                ///Budget Controller
var budgetController = (function () {

    var Expense = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
    };
   
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
        
    }

                                                                     ///data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, ID) {
            var ids, index;
            /* TO-DO
             * get all exp or inc id ->in array( ids )
             * find the index of selected id in our array ( ids -> find if selected id matches)
             * if id matches delete the object in array with found index
             */
            ids = data.allItems[type].map(function (current) {

                return current.id;
            });
            //console.log(ids);
            //console.log(ID);
            index = ids.indexOf(ID);
            if (index !== -1) {
                data.allItems[type].splice(index, 1); //splice (position, count of data should delete)
            }
        },

        dataTesting: function () {
            console.log(data);
        },
        calculateBudget: function () {
            /*
             * Calculate total income and expenses
             * Calculate the budget: income - expenses
             * Calculate the percentage of income that we spent
             */
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;

            //console.log(data.totals.inc);
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentage: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalExpense: data.totals.exp,
                totalIncome: data.totals.inc,
                percentage: data.percentage
            }
        }
    }


})();










                                                                    ///UI Controller
var UIController = (function () {

    var DOMStrings = {
        addBtn: '.add__btn',
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpense: '.budget__expenses--value',
        percentageExpense: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };
    var formatNumbers = function (num, type) {
        /*  TO-DO
            * + or - before number
            * add exactly 2decimal points 
            * comma seperating the thousands
        */
        var spliter, rupees, paise, sign;
        num = Math.abs(num);
        num = num.toFixed(2);
        spliter = num.split('.');
        rupees = spliter[0];
        paise = spliter[1];
        if (rupees.length > 3) {
            rupees = rupees.substr(0, rupees.length - 3) + ',' + rupees.substr(rupees.length - 3, 3);
        }



        return (type === 'exp' ? '-' : '+') + ' ' + rupees + '.' + paise;
    };

    return {
        getDom: function () {
            return DOMStrings;
        },
        getinput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            /*  TO-DO
             * Create HTML string with placeholder text
             * Replace the placeholder text with some actual data
             * insert html into the DOM
             */

            var html, element, newHtml;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumbers(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            //console.log(fields);                    
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

           
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetValue).textContent = formatNumbers(obj.budget, type);
            document.querySelector(DOMStrings.budgetExpense).textContent = formatNumbers(obj.totalExpense, 'exp');
            document.querySelector(DOMStrings.budgetIncome).textContent = formatNumbers(obj.totalIncome, 'inc');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageExpense).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMStrings.percentageExpense).textContent = '--';
            }

        },
        displayPercentages: function (percentage) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            }

            nodeListForEach(fields, function (current, index) {
                if (percentage[index] > 0) {
                    current.textContent = percentage[index] + ' %';
                } else {
                    current.textContent = '--';
                }
            });
        },
        displayDate: function () {
            var now, year, month, months;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = year + ' ' + months[month];
        },
        changedType: function () {
            var fields = document.querySelectorAll(
                DOMStrings.inputDescription + ', ' +
                DOMStrings.inputType + ', ' +
                DOMStrings.inputValue
            );

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            }
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.addBtn).classList.toggle('red');
        }
    };

})();










                                                                        ///GLOBAL App Controller
var MainController = (function (budgetCtrl, uiCtrl) {
    var startupSetup = function () {
        var DOM = uiCtrl.getDom();
        var addBtn = document.querySelector(DOM.addBtn);
        addBtn.addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            //console.log(event);                            
            /*TO-DO
             * whn user press the enter key consider as a addBtn DOM Event listener
             */

            if (event.keyCode === 13 || event.which === 13) { 
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);
    };
    var updateBudget = function () {
        /*  TO-DO
         * Calculate the budget
         * Return the budget
         * Display the budget on the UI
         */
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        uiCtrl.displayBudget(budget);

    };


    var updatePercentage = function () {
        /* TO-DO
         * Calculate Percentage
         * Read percentages from the budgt controller
         * Update the UI with the new percentages
         */
        budgetController.calculatePercentage();
        percent = budgetController.getPercentages();
        //console.log(percent);
        uiCtrl.displayPercentages(percent);
    };

    
    var ctrlAddItem = function () {
        /* TO-DO
         * Get the filled input data
         * Add the item to the budget controller
         * Add the item to the UI
         * Clear prviously entered fields
         * Calculate and update budget
         */

        var input, newItem;
        input = uiCtrl.getinput();
        // console.log(input);

        if (input.description.trim() !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            uiCtrl.addListItem(newItem, input.type);
            uiCtrl.clearFields();
            updateBudget();
            updatePercentage();
        }
    };

    var ctrlDeleteItem = function (event) {
        // console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        var itemID, s, ID, type;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            s = itemID.split('-');
            ID = parseInt(s[1]);
            type = s[0];
            /*   TO-DO
             * Delete the item from the data strcture
             * Delete the item from the UI
             * Update and show the new budget
             */
          
            budgetCtrl.deleteItem(type, ID);
            uiCtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentage();
        }
    };


    return {
        init: function () {
            console.log('App Started');
            startupSetup();
            uiCtrl.displayBudget({
                budget: 0,
                totalExpense: 0,
                totalIncome: 0,
                percentage: -1
            });
            uiCtrl.displayDate();
        }
    }
})(budgetController, UIController);











MainController.init();
