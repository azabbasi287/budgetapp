if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("servis.js").then(registration => {
            console.log("SW Registered!");
            console.log(registration);
        }).catch(error => {
            console.log("SW Registered faild !");
            console.log(error);
        })
}
const balanceEl = document.querySelector(".balance .value");
const incometotal = document.querySelector(".income-total");
const outcomtotal = document.querySelector(".outcome-total");
const chart = document.querySelector(".chart");
const expensebtn = document.querySelector(".tab1");
const incomebtn = document.querySelector(".tab2");
const allbtn = document.querySelector(".tab3");
const incomelist = document.querySelector("#income .list");
const expenselist = document.querySelector("#expense .list");
const alllist = document.querySelector("#all .list");
const expenseel = document.querySelector("#expense");
const allel = document.querySelector("#all");
const incomeelel = document.querySelector("#income");
const addincome = document.querySelector(".add-income");
const incometitle = document.querySelector("#income-title-input");
const incomamount = document.querySelector("#income-amount-input");
const addexpense = document.querySelector(".add-expense");
const expenseamount = document.querySelector("#expense-amount-input");
const expensetitle = document.querySelector("#expense-title-input");
// varibles  // 
let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUi();
income = calucatortotal("income", ENTRY_LIST);
outcome = calucatortotal("expense", ENTRY_LIST);
balance = calucatorbalanc(income, outcome);
incomelist.addEventListener("click" , deleteorEdite);
expenselist.addEventListener("click" , deleteorEdite);
alllist.addEventListener("click" , deleteorEdite);
function deleteorEdite(event){
    const targetBtn = event.target;
    const entry = targetBtn.parentNode;
    if (targetBtn.id == DELETE) {
        deleteENtry(entry)
    }else if (targetBtn.id == EDIT) {
        editeEnty(entry)
    }
}
function deleteENtry(ENTRY) {
    ENTRY_LIST.splice(ENTRY.id , 1);
    updateUi();
}
function editeEnty(ENTRY) {
    let entry = ENTRY_LIST[ENTRY.id];
    if (entry.type == "income") {
        incometitle.value = entry.title;
        incomamount.value = entry.amount;
    } else if (entry.type == "expense") {
        expensetitle.value = entry.title;
        expenseamount.value = entry.amount;
    }
    deleteENtry(ENTRY);
}
addincome.addEventListener('click', function () {
    if (!incomamount.value || !incometitle.value)
        return;
    let income = {
        type: "income",
        title: incometitle.value,
        amount: parseFloat(incomamount.value)
    }
    ENTRY_LIST.push(income);
    updateUi();
    cleareinput([incometitle, incomamount]);
});
addexpense.addEventListener('click', function () {
    if (!expenseamount.value || !expensetitle.value)
        return;
    let expense = {
        type: "expense",
        title: expensetitle.value,
        amount: parseFloat(expenseamount.value)
    }
    ENTRY_LIST.push(expense);
    updateUi();
    cleareinput([expensetitle, expenseamount]);
});

expensebtn.addEventListener('click', function () {
    show(expenseel);
    hide([allel, incomeelel]);
    active(expensebtn);
    inactive([allbtn, incomebtn]);
})
incomebtn.addEventListener('click', function () {
    show(incomeelel);
    hide([allel, expenseel]);
    active(incomebtn);
    inactive([allbtn, expensebtn]);
})
allbtn.addEventListener('click', function () {
    show(allel);
    hide([expenseel, incomeelel]);
    active(allbtn);
    inactive([expensebtn, incomebtn]);
})
function calucatortotal(type, ENTRY_LIST) {
    let sum = 0;
    ENTRY_LIST.forEach(entry => {
        if (entry.type == type) {
            sum += entry.amount;
        }
    })
    return sum;
}
function calucatorbalanc(income, outcome) {
    return income - outcome;
}
function updateUi() {
    income = calucatortotal("income", ENTRY_LIST);
    outcome = calucatortotal("expense", ENTRY_LIST);
    balance = Math.abs(calucatorbalanc(income, outcome));
    let sign = (income >= outcome) ? "$" : "-$";

    clearElement([expenselist ,incomelist ,alllist]);

    ENTRY_LIST.forEach((entry, index) => {
        if (entry.type == "expense") {
            showentry(expenselist, entry.type, entry.title, entry.amount, index)
        }
        else if (entry.type == "income") {
            showentry(incomelist, entry.type, entry.title, entry.amount, index)
        } 
            showentry(alllist, entry.type, entry.title, entry.amount, index)
    });
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    incometotal.innerHTML = `<small>$</small>${income}`;
    outcomtotal.innerHTML = `<small>$</small>${outcome}`;
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showentry(list, type, title, amount, id) {

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>` ;
    const position = "afterbegin";
    list.insertAdjacentHTML(position, entry);
}
 function clearElement(elements){
     elements.forEach(element => {
        element.innerHTML = "";
     })
 }
function cleareinput(inputs) {
    inputs.forEach(input => {
        input.value = "";
    })
}
function show(element){
    element.classList.remove("hide");
}
function hide(elements) {
    elements.forEach(element => {
        element.classList.add("hide");
    });
}
function active(element) {
    element.classList.add("active");
}
function inactive(elements) {
    elements.forEach(element => {
        element.classList.remove("active")
    });
}
