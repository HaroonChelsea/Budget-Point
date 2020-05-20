//Get Current Date
const dateCtrl = (() => {

    return {
        currentDate: () => {
            let currentDate = new Date();
            let month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            let currentMonth = month[currentDate.getMonth()];
            let currentYear =  currentDate.getFullYear();
            document.querySelector(".yearAndMonth").innerText = `${currentMonth}, ${currentYear}`
        }
    }
})();
//Storage Controller
const storageCtrl = (() => {

    return {
        storeItem: (item) => {
            let items = [];
            if (localStorage.getItem("items") === null) {
                items = [];
                items.push(item);
                localStorage.setItem("items", JSON.stringify(items))
            } else {
                items = JSON.parse(localStorage.getItem("items"));
                items.push(item);
                localStorage.setItem("items", JSON.stringify(items));
            }
        },
        getDataFromStore: () => {
            let items;
            if (localStorage.getItem("items") === null) {
                items = [];

            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;
        },
        updateItem: (data) => {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index) => {
                if (item.id === data.id) {
                    items.splice(index, 1, data);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },
        deleteData: (id) => {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
            const totalBudget = budgetCtrl.getTotalBudget();
            uiCtrl.showTotalBudget(totalBudget);
        }
    }
})();


//Budget Controller
const budgetCtrl = (() => {
    const budgetItem = function (id, name, value, type) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.type = type;
    };

    const data = {
        budgetItemsArr: storageCtrl.getDataFromStore(),
        currentBudgetItem: null,
        totalBudget: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalExpensePercent: 0,
    }

    return {
        getBudgetItems: () => {
            return data.budgetItemsArr;
        },
        addNewBudgetItem: (name, value, type) => {
            let ID;
            if (data.budgetItemsArr.length > 0) {
                ID = data.budgetItemsArr[data.budgetItemsArr.length - 1].id + 1;
            } else {
                ID = 0;
            }
            let newBudgetItem = new budgetItem(ID, name, value, type);
            data.budgetItemsArr.push(newBudgetItem);
            return newBudgetItem;
        },
        getTotalBudget: () => {
            let totalIncome = 0;
            let totalExpense = 0;
            data.budgetItemsArr.forEach((eachItem) => {
                if (eachItem.type === "Income") {
                    totalIncome += +(eachItem.value);
                } else {
                    totalExpense += +(eachItem.value);
                }
            })
            data.budgetItemsArr.forEach((eachItemExpense) => {
                if (eachItemExpense.type === "Expense") {
                    if (totalIncome > 0) {
                        eachItemExpense.expensePercent = Math.round(+(eachItemExpense.value) * 100 / +(totalIncome));
                    } else {
                        eachItemExpense.expensePercent = "---";
                    }

                }
            })
            data.totalIncome = totalIncome;
            data.totalExpense = totalExpense;
            data.totalBudget = +(totalIncome) - +(totalExpense);
            if (totalIncome > 0) {
                data.totalExpensePercent = Math.round(+(totalExpense) * 100 / +(totalIncome));
            }
            return {
                totalBud: data.totalBudget,
                totalInc: data.totalIncome,
                totalExp: data.totalExpense,
                totalExpPer: data.totalExpensePercent,
            }
        },
        getItemByID: (id) => {
            let found = null;
            data.budgetItemsArr.forEach((findId) => {
                if (findId.id === id) {
                    found = findId;
                }
            });
            return found;
        },
        setCurrentItemToData: (item) => {
            data.currentBudItem = item;
        },
        getCurrentItem: () => {
            return data.currentBudItem;
        },
        updateData: (name, value, type) => {
            let found = null;
            data.budgetItemsArr.forEach((checkID) => {
                if (checkID.id === data.currentBudItem.id) {
                    checkID.name = name;
                    checkID.value = value;
                    checkID.type = type;
                    found = checkID;
                }
            });
            return found;

        },
        deleteData: (id) => {
            const ids = data.budgetItemsArr.map((item) => {
                return item.id;
            });
            const index = ids.indexOf(id);
            data.budgetItemsArr.splice(index, 1);

        },
        logData: () => {
            return data;
        }
    }
})();


//UI contoller
const uiCtrl = (() => {
    const uiSelectors = {
        tableInc: "tableIncome",
        tableExp: "tableExpense",
        addBtn: "fa-check-circle",
        inputDescription: "budgetDescription",
        inputBudgetValue: "budgetValue",
        inputTypeSelect: "budgetTypeSelect",
        totalBudget: "totalBudget",
        totalIncome: "totalIncome",
        totalExpense: "totalExpense",
        totalExPer: "totalExpensePercent",
        tableStriped: "table-striped",
        updateBtn: "updateBtn",
        delBtn: "delBtn",
        backBtn: "backBtn"
    }
    return {
        paintTableTD: (budItems) => {
            let tableIncome = "";
            let tableExpense = "";
            budItems.forEach((budItem) => {
                if (budItem.type === "Income") {
                    tableIncome += `
                          <tr id="tableRow-${budItem.id}">
                            <td class="font-weight-bold">${budItem.name}</td>
                            <td class="text-primary font-weight-bold">+${budItem.value}</td>
                            <td class="remove d-flex justify-content-around"><svg id="icon-circle-with-cross" class="delClickBtn">
                            <use pointer-events="auto"  xlink:href="dist/img/sprite.svg#icon-circle-with-cross">
                            </use>
                        </svg>
                        <svg id="icon-edit" class="updateClickBtn">
                            <use pointer-events="auto" xlink:href="dist/img/sprite.svg#icon-edit">
                            </use>
                        </svg></td>
                          </tr>
                `;
                } else {
                    tableExpense += `
                          <tr id="tableRow-${budItem.id}">
                            <td class="font-weight-bold">${budItem.name}</td>
                            <td class="text-danger font-weight-bold">-${budItem.value} <span class="badge badge-danger">${budItem.expensePercent}%</span> </td>
                            <td class="remove d-flex justify-content-around"><svg id="icon-circle-with-cross" class="delClickBtn">
                            <use pointer-events="auto"  xlink:href="dist/img/sprite.svg#icon-circle-with-cross">
                            </use>
                        </svg>
                        <svg id="icon-edit" class="updateClickBtn">
                            <use pointer-events="auto" xlink:href="dist/img/sprite.svg#icon-edit">
                            </use>
                        </svg></td>
                          </tr>
                `;

                }
                document.getElementById(uiSelectors.tableInc).innerHTML = tableIncome;
                document.getElementById(uiSelectors.tableExp).innerHTML = tableExpense;


            });

        },
        getInputData: () => {
            return {
                name: document.getElementById(uiSelectors.inputDescription).value,
                value: document.getElementById(uiSelectors.inputBudgetValue).value,
                type: document.getElementById(uiSelectors.inputTypeSelect).value
            }
        },
        addNewBudItemToTable: (item) => {
            const tr = document.createElement("tr");
            if (item.type === "Income") {
                tr.setAttribute("id", `tableRow-${item.id}`)
                tr.innerHTML = `
                            <td class="font-weight-bold">${item.name}</td>
                            <td class="text-primary font-weight-bold">+${item.value}</td>
                            <td class="remove d-flex justify-content-around"><svg id="icon-circle-with-cross" class="delClickBtn">
                            <use pointer-events="auto"  xlink:href="dist/img/sprite.svg#icon-circle-with-cross">
                            </use>
                        </svg>
                        <svg id="icon-edit" class="updateClickBtn">
                            <use pointer-events="auto" xlink:href="dist/img/sprite.svg#icon-edit">
                            </use>
                        </svg></td>
                `;
                document.getElementById(uiSelectors.tableInc).insertAdjacentElement("beforeend", tr);
            } else if (item.type === "Expense") {
                tr.setAttribute("id", `tableRow-${item.id}`)
                tr.innerHTML = `
                            <td class="font-weight-bold">${item.name}</td>
                            <td class="text-danger font-weight-bold">-${item.value} <span class="badge badge-danger">${item.expensePercent}%</span> </td>
                            <td class="remove d-flex justify-content-around"><svg id="icon-circle-with-cross" class="delClickBtn">
                            <use pointer-events="auto"  xlink:href="dist/img/sprite.svg#icon-circle-with-cross">
                            </use>
                        </svg>
                        <svg id="icon-edit" class="updateClickBtn">
                            <use pointer-events="auto" xlink:href="dist/img/sprite.svg#icon-edit">
                            </use>
                        </svg></td>
                `;
                document.getElementById(uiSelectors.tableExp).insertAdjacentElement("beforeend", tr);
            }

        },
        clearInputFields: () => {
            document.getElementById(uiSelectors.inputDescription).value = "";
            document.getElementById(uiSelectors.inputBudgetValue).value = "";
            document.getElementById(uiSelectors.updateBtn).style.display = "none";
            document.getElementById(uiSelectors.delBtn).style.display = "none";
            document.getElementById(uiSelectors.backBtn).style.display = "none";
            document.getElementById(uiSelectors.addBtn).style.display = "block";
        },
        showEditState: () => {
            document.getElementById(uiSelectors.addBtn).style.display = "none";
            document.getElementById(uiSelectors.updateBtn).style.display = "block";
            document.getElementById(uiSelectors.delBtn).style.display = "block";
            document.getElementById(uiSelectors.backBtn).style.display = "block";
        },
        setItemToForm: () => {
            document.getElementById(uiSelectors.inputDescription).value = budgetCtrl.getCurrentItem().name;
            document.getElementById(uiSelectors.inputBudgetValue).value = budgetCtrl.getCurrentItem().value;
            if (budgetCtrl.getCurrentItem().type === "Income") {
                document.getElementById(uiSelectors.inputTypeSelect).selectedIndex = 0;
            } else {
                document.getElementById(uiSelectors.inputTypeSelect).selectedIndex = 1;
            }
            uiCtrl.showEditState();
        },
        showTotalBudget: (total) => {
            document.getElementById(uiSelectors.totalBudget).textContent = total.totalBud;
            document.getElementById(uiSelectors.totalIncome).textContent = "+" + total.totalInc;
            document.getElementById(uiSelectors.totalExpense).innerText = "-" + total.totalExp;
            if (total.totalInc > 0) {
                document.getElementById(uiSelectors.totalExPer).innerText = total.totalExpPer + "%";
            } else {
                document.getElementById(uiSelectors.totalExPer).innerText = "---";
            }

        },
        updateTableData: (updateItem) => {
            let tableRowItems = document.getElementsByTagName("tr");
            let tableRowItemsArray = Array.from(tableRowItems);
            tableRowItemsArray.forEach((trItems) => {
                const itemId = trItems.getAttribute("id");
                if (itemId === `tabelRow-${itemId}`) {
                    if (updateItem.type === "Income") {
                        document.querySelector(`#${itemId}`).innerHTML = `
                    <td class="font-weight-bold">${item.name}</td>
                    <td class="text-primary font-weight-bold">+${item.value}</td>
                    <td class="remove d-flex justify-content-around"><svg id="icon-circle-with-cross" class="delClickBtn">
                    <use pointer-events="auto"  xlink:href="dist/img/sprite.svg#icon-circle-with-cross">
                    </use>
                </svg>
                <svg id="icon-edit" class="updateClickBtn">
                    <use pointer-events="auto" xlink:href="dist/img/sprite.svg#icon-edit">
                    </use>
                </svg></td>
                    `;
                    } else {
                        document.querySelector(`#${itemId}`).innerHTML = `
                        <td class="font-weight-bold">${item.name}</td>
                        <td class="text-danger font-weight-bold">-${item.value} <span class="badge badge-danger">${item.expensePercent}%</span> </td>
                        <td class="remove d-flex justify-content-around"><svg id="icon-circle-with-cross" class="delClickBtn">
                        <use pointer-events="auto"  xlink:href="dist/img/sprite.svg#icon-circle-with-cross">
                        </use>
                    </svg>
                    <svg id="icon-edit" class="updateClickBtn">
                        <use pointer-events="auto" xlink:href="dist/img/sprite.svg#icon-edit">
                        </use>
                    </svg></td>
                        `;
                    }

                }
                uiCtrl.clearInputFields();
                const totalBudget = budgetCtrl.getTotalBudget();
                uiCtrl.showTotalBudget(totalBudget);
                const budgetItems = budgetCtrl.getBudgetItems();
                uiCtrl.paintTableTD(budgetItems);
            });
        },
        deleteCurrentDataRow: (rowToDel) => {
            let tableRowItemsToDel = document.getElementsByTagName("tr");
            let tableRowItemsDelToArray = Array.from(tableRowItemsToDel)
            tableRowItemsDelToArray.forEach((trDel) => {
                const itemIdDel = trDel.getAttribute("id");
                if (itemIdDel === `tableRow-${rowToDel}`) {
                    trDel.remove();
                }
            });
        },
        getSelectors: () => {
            return uiSelectors;
        }
    }
})();



//App controller
const appCtrl = ((budgetCtrl, uiCtrl) => {
    const loadEventListener = () => {
        const uiSelectors = uiCtrl.getSelectors();
        document.getElementById(uiSelectors.addBtn).addEventListener("keypress", (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();

            }
            return false;
        });
        document.getElementById(uiSelectors.addBtn).addEventListener("click", addBudgetToTable);
        document.getElementById(uiSelectors.tableStriped).addEventListener("click", updateData);
        document.getElementById(uiSelectors.updateBtn).addEventListener("click", submitUpdateBudgetData);
        document.getElementById(uiSelectors.backBtn).addEventListener("click", uiCtrl.clearInputFields);
        document.getElementById(uiSelectors.delBtn).addEventListener("click", deleteRowData);
    }

    const addBudgetToTable = (e) => {
        const inputData = uiCtrl.getInputData();
        const uiSelectors = uiCtrl.getSelectors();
        if (inputData.name !== "") {
            if (inputData.value !== "") {
                const newBudgetItem = budgetCtrl.addNewBudgetItem(inputData.name, inputData.value, inputData.type);
                uiCtrl.addNewBudItemToTable(newBudgetItem);
                storageCtrl.storeItem(newBudgetItem);
                uiCtrl.clearInputFields();
                const totalBudget = budgetCtrl.getTotalBudget();
                uiCtrl.showTotalBudget(totalBudget);
                const budgetItems = budgetCtrl.getBudgetItems();
                uiCtrl.paintTableTD(budgetItems);


            } else {
                document.getElementById(uiSelectors.inputBudgetValue).classList.add("is-invalid");
                setTimeout(() => {
                    document.getElementById(uiSelectors.inputBudgetValue).classList.remove("is-invalid");
                }, 3000);
            }
        } else {
            document.getElementById(uiSelectors.inputDescription).classList.add("is-invalid");
            setTimeout(() => {
                document.getElementById(uiSelectors.inputDescription).classList.remove("is-invalid");
            }, 3000);
        }
        e.preventDefault();
    }
    //
    const updateData = (e) => {
        if (e.target.classList.contains("updateClickBtn")) {
            let tableRow = e.target.parentNode.parentNode.id;
            let tableRowID = tableRow.split("-");
            const id = parseInt(tableRowID[1]);
            const budgetItemToEdit = budgetCtrl.getItemByID(id);
            budgetCtrl.setCurrentItemToData(budgetItemToEdit);
            uiCtrl.setItemToForm();
        }
        if (e.target.classList.contains("delClickBtn")) {
            let tableRow = e.target.parentNode.parentNode.id;
            let tableRowID = tableRow.split("-");
            const id = parseInt(tableRowID[1]);
            const budgetItemToDel = budgetCtrl.getItemByID(id);
            budgetCtrl.setCurrentItemToData(budgetItemToDel);
            budgetCtrl.deleteData(id);
            storageCtrl.deleteData(id);
            uiCtrl.deleteCurrentDataRow(id);
            const totalBudget = budgetCtrl.getTotalBudget();
            uiCtrl.showTotalBudget(totalBudget);
            const budgetItems = budgetCtrl.getBudgetItems();
            uiCtrl.clearInputFields();
            uiCtrl.paintTableTD(budgetItems);
        }
        e.preventDefault();
    }
    const submitUpdateBudgetData = (e) => {
        const inputUpdateData = uiCtrl.getInputData();
        const updateData = budgetCtrl.updateData(inputUpdateData.name, inputUpdateData.value, inputUpdateData.type);
        storageCtrl.updateItem(updateData);
        uiCtrl.updateTableData(updateData);
        e.preventDefault();
    }
    const deleteRowData = (e) => {
        const currentItemID = budgetCtrl.getCurrentItem().id;
        budgetCtrl.deleteData(currentItemID);
        storageCtrl.deleteData(currentItemID);
        uiCtrl.deleteCurrentDataRow(currentItemID);
        uiCtrl.clearInputFields();
        const totalBudget = budgetCtrl.getTotalBudget();
        uiCtrl.showTotalBudget(totalBudget);
        const budgetItems = budgetCtrl.getBudgetItems();
        uiCtrl.paintTableTD(budgetItems);

        e.preventDefault();
    }
    return {
        init: () => {
            dateCtrl.currentDate();
            uiCtrl.clearInputFields();
            console.log("Running.....");
            const budgetItems = budgetCtrl.getBudgetItems();
            const totalBudget = budgetCtrl.getTotalBudget();
            uiCtrl.showTotalBudget(totalBudget);
            uiCtrl.paintTableTD(budgetItems);
            loadEventListener();

        }
    }
})(budgetCtrl, uiCtrl);

appCtrl.init();