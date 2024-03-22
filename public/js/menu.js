const increaseQuantity = (id) => {
    var quantityInput = document.getElementById(id);
    quantityInput.value = parseInt(quantityInput.value) + 1;
    calcTot(id);
}
  
const decreaseQuantity = (id) => {
    var quantityInput = document.getElementById(id);
    var currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
        quantityInput.value = currentValue - 1;
        calcTot(id, decrease=true);
    }
}
  
const calcTot =  (id, decrease=false) => {
    const price = parseInt(document.getElementById(id + "-price").innerHTML);
    const tot = document.querySelector("#tot-amt");
    var oldTot = parseInt(tot.innerHTML);  
    const itemAmt = document.getElementById(`${id}-amt`);
    var oldItemAmt = parseInt(itemAmt.innerHTML);
    if (decrease) {
        tot.innerHTML = oldTot - price;
        itemAmt.innerHTML = oldItemAmt - price;
        return;
    }
    tot.innerHTML = oldTot + price;
    itemAmt.innerHTML = oldItemAmt + price;
}

const getOrder = (id) => {
    const time = document.querySelector(`#${id}`);
    const items = Array.from(time.querySelectorAll("tr")).slice(1);
    console.log(items);
    const order = [];
    for (const item of items) {
        const qtyContainer = item.querySelector(".quantity-container");
        const qty = parseInt(qtyContainer.querySelector("input").value);
        if (!qty)
            continue;
        const priceContainer = qtyContainer.parentElement.previousElementSibling;
        const price = parseInt(priceContainer.innerHTML);
        const name = priceContainer.previousElementSibling.innerText.trim();
        order.push({
            name: name,
            qty: qty,
            price: price, 
            tot: price * qty
        })
    }
    return order;
}
  
const orderButton = document.getElementById("submit-order");
    if (orderButton) 
    orderButton.addEventListener("click", () => {
        console.log("lunch: ", getOrder("lunch"));
        const order = {
        date: document.getElementById("date-today").value,
        breakfast: getOrder("breakfast"),
        lunch: getOrder("lunch"),
        dinner: getOrder("dinner")
        };
        fetch("/process-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
        })
        .then(response => {
            if (response.ok)
            window.location.href = "/confirm-order";
            else
            window.location.href = "/";
        })
        .catch(err => console.log(err));
});
  
const confirmation = (item) => {
    fetch("/post-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buttonType: item.id })
    })
        .then(response => {
        console.log("here");
        if (!response.ok)
            throw new Error("bad confirmation request");
        window.location.href = "/";
        })
};