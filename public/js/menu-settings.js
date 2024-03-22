const addItem = (id) => {
    const nameField = document.querySelector(`#${id}-name`);
    const priceField = document.querySelector(`#${id}-price`);
    const itemName = nameField.value.trim();
    const itemPrice = priceField.value;
    if (itemName == "" || itemPrice == "" || itemPrice==0)
        return;
    const itemRow = document.createElement("div");
    itemRow.innerHTML = `<p class="name"><b>${itemName}</b></p><p>Price: <code  class="price">${itemPrice}</code></p><button onclick='deleteItem(this)'>Remove</button>`;
    itemRow.classList.add("item-row");
    const itembox = document.querySelector(`#${id}`);
    itembox.appendChild(itemRow);
    priceField.value = "";
    nameField.value = "";
    nameField.focus();
}
  
const deleteItem = (item) => { item.parentElement.remove(); }
  
const collapse = (item) => {
    item.nextElementSibling.classList.toggle("collapsed");
    const boxId = item.parentElement.parentElement.id;
    const collapsedHeader = document.querySelector(`#${boxId}-saved`);
    if (collapsedHeader)
        collapsedHeader.classList.toggle("collapsed");
}
  
const extractMenu = (menu) => {
    if (menu.length == 0)
        return;
    var itemList = [];
    for (const row of menu.querySelectorAll(".item-row")) {
        const itemName = row.querySelector(".name").innerText;
        const itemPrice = row.querySelector(".price").innerText;
        itemList.push({
        name: itemName,
        price: parseInt(itemPrice)
        });
    }
    return itemList;
};
  
const postMenuChanges = (button) => {
    const dayMenu = button.parentElement.parentElement;
    const day = dayMenu.id;
    const breakfastDiv = dayMenu.querySelector(`#${day}-breakfast`);
    const lunchDiv = dayMenu.querySelector(`#${day}-lunch`);
    const dinnerDiv = dayMenu.querySelector(`#${day}-dinner`);
    const data = {
        day: day,
        breakfast: extractMenu(breakfastDiv),
        lunch: extractMenu(lunchDiv),
        dinner: extractMenu(dinnerDiv)
    };
    if (!data.breakfast.length || !data.lunch.length || !data.dinner.length)
        return;
    fetch("/admin/post-menu-changes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) 
        return response.json();
        else 
        throw new Error("Error getting response");
    })
    .then(data => {
        const savedMessage = document.createElement("p");
        savedMessage.innerHTML = `Menu for ${data.day} updated.`;
        savedMessage.style = "color: green";
        const collapsible = document.querySelector(`#${data.day}-collapsible`);
        collapsible.appendChild(savedMessage);

        const day = collapsible.parentElement;
        const dayHeader = day.querySelector("h2");
        const savedHeader = document.createElement("p");
        savedHeader.innerHTML = `updated`;
        savedHeader.style = "color: green; font-style: italic;";
        savedHeader.id = `${data.day}-saved`;
        day.insertBefore(savedHeader, dayHeader);
    })
    .catch(err => console.log(err));
}

const displayMenuTable = (item) => {
    const dayTable = item.parentElement.parentElement;
    const thisMeal = item.value;
    for (const meal of ["breakfast", "lunch", "dinner"]) {
        const mealTable = dayTable.querySelector(`#${meal}-table`);
        if (thisMeal == meal) 
        mealTable.style = "display: table";
        else 
        mealTable.style = "display: none";
    } 
}